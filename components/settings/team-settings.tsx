"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Send,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { TeamMember } from "@/app/settings/page"

interface TeamSettingsProps {
  members: TeamMember[]
  onUpdate: (members: TeamMember[]) => void
}

const roleConfig: Record<TeamMember["role"], { label: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }> = {
  owner: {
    label: "Owner",
    icon: Crown,
    color: "text-amber-500 bg-amber-500/10",
    description: "Full access to all features and settings",
  },
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    color: "text-purple-500 bg-purple-500/10",
    description: "Can manage team, settings, and all content",
  },
  editor: {
    label: "Editor",
    icon: Shield,
    color: "text-blue-500 bg-blue-500/10",
    description: "Can create, edit, and schedule content",
  },
  viewer: {
    label: "Viewer",
    icon: ShieldAlert,
    color: "text-muted-foreground bg-muted",
    description: "Can only view content and analytics",
  },
}

export function TeamSettings({ members, onUpdate }: TeamSettingsProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("editor")
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const activeMembers = members.filter((m) => m.status === "active")
  const pendingMembers = members.filter((m) => m.status === "pending")

  const handleInvite = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: "",
      role: inviteRole,
      status: "pending",
      joinedAt: new Date(),
    }
    onUpdate([...members, newMember])
    setInviteEmail("")
    setInviteRole("editor")
    setIsInviteDialogOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    onUpdate(members.filter((m) => m.id !== memberId))
  }

  const handleUpdateRole = (memberId: string, role: TeamMember["role"]) => {
    onUpdate(members.map((m) => (m.id === memberId ? { ...m, role } : m)))
    setEditingMember(null)
  }

  const handleResendInvite = (memberId: string) => {
    // Mock resend invite functionality
    console.log("Resending invite to", memberId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Team</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your team members and their permissions
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
              <p className="text-xs text-muted-foreground">Total Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeMembers.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingMembers.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {members.filter((m) => m.role === "admin" || m.role === "owner").length}
              </p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Member */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Team Members
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add people to your workspace to collaborate
            </p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamMember["role"])}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig)
                        .filter(([key]) => key !== "owner")
                        .map(([key, config]) => {
                          const Icon = config.icon
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className={cn("w-4 h-4", config.color.split(" ")[0])} />
                                {config.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {roleConfig[inviteRole].description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail.trim()} className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Invite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Invite */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter email address..."
              className="pl-10 rounded-xl"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamMember["role"])}>
            <SelectTrigger className="w-32 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleConfig)
                .filter(([key]) => key !== "owner")
                .map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleInvite} disabled={!inviteEmail.trim()} className="rounded-xl">
            Invite
          </Button>
        </div>
      </Card>

      {/* Pending Invites */}
      {pendingMembers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Invitations ({pendingMembers.length})
          </h3>
          <div className="space-y-3">
            {pendingMembers.map((member) => {
              const config = roleConfig[member.role]
              const RoleIcon = config.icon
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-muted">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className={cn("text-[10px]", config.color)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        <span>Invited {formatDistanceToNow(member.joinedAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-2"
                      onClick={() => handleResendInvite(member.id)}
                    >
                      <Send className="w-3 h-3" />
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Active Members */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Members ({activeMembers.length})
        </h3>
        <div className="space-y-3">
          {activeMembers.map((member) => {
            const config = roleConfig[member.role]
            const RoleIcon = config.icon
            const isOwner = member.role === "owner"

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-background">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      {isOwner && (
                        <Crown className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={cn("gap-1", config.color)}>
                    <RoleIcon className="w-3 h-3" />
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Joined {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
                  </span>

                  {!isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingMember(member)}>
                          <UserCog className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Role Edit Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update the role for {editingMember?.name}
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={editingMember.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {editingMember.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{editingMember.name}</p>
                  <p className="text-xs text-muted-foreground">{editingMember.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(roleConfig)
                  .filter(([key]) => key !== "owner")
                  .map(([key, config]) => {
                    const Icon = config.icon
                    const isSelected = editingMember.role === key
                    return (
                      <button
                        key={key}
                        className={cn(
                          "w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleUpdateRole(editingMember.id, key as TeamMember["role"])}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{config.label}</p>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Roles & Permissions */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Roles & Permissions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permission</th>
                {Object.entries(roleConfig).map(([key, config]) => (
                  <th key={key} className="text-center py-3 px-4 font-medium text-muted-foreground">
                    {config.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "View Analytics", permissions: { owner: true, admin: true, editor: true, viewer: true } },
                { name: "Create Content", permissions: { owner: true, admin: true, editor: true, viewer: false } },
                { name: "Schedule Posts", permissions: { owner: true, admin: true, editor: true, viewer: false } },
                { name: "Manage Channels", permissions: { owner: true, admin: true, editor: false, viewer: false } },
                { name: "Team Management", permissions: { owner: true, admin: true, editor: false, viewer: false } },
                { name: "Billing & Plans", permissions: { owner: true, admin: false, editor: false, viewer: false } },
                { name: "Delete Workspace", permissions: { owner: true, admin: false, editor: false, viewer: false } },
              ].map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 text-foreground">{row.name}</td>
                  {Object.keys(roleConfig).map((role) => (
                    <td key={role} className="text-center py-3 px-4">
                      {row.permissions[role as keyof typeof row.permissions] ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
