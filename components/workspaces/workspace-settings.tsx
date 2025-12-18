"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  X,
  Settings,
  Users,
  Globe,
  Palette,
  Shield,
  Trash2,
  Save,
  Clock,
  Check,
  AlertTriangle,
  Crown,
  Edit2,
  Eye,
  UserPlus,
  Mail,
  Megaphone,
  Rocket,
  Building2,
  Briefcase,
  Heart,
  Zap,
  Target,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Workspace, WorkspaceRole, WorkspaceMember } from "@/app/workspaces/page"

interface WorkspaceSettingsProps {
  workspace: Workspace
  onClose: () => void
  onUpdate: (workspace: Workspace) => void
  onDelete: (workspaceId: string) => void
}

const icons = [
  { id: "megaphone", icon: Megaphone },
  { id: "rocket", icon: Rocket },
  { id: "building", icon: Building2 },
  { id: "briefcase", icon: Briefcase },
  { id: "heart", icon: Heart },
  { id: "zap", icon: Zap },
  { id: "globe", icon: Globe },
  { id: "palette", icon: Palette },
  { id: "target", icon: Target },
  { id: "store", icon: Store },
]

const colors = [
  "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#22c55e",
  "#ef4444", "#06b6d4", "#f59e0b", "#6366f1", "#6b7280",
]

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
]

const roleConfig: Record<WorkspaceRole, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  owner: { label: "Owner", color: "text-amber-600", icon: Crown },
  admin: { label: "Admin", color: "text-purple-600", icon: Shield },
  editor: { label: "Editor", color: "text-blue-600", icon: Edit2 },
  viewer: { label: "Viewer", color: "text-gray-600", icon: Eye },
}

export function WorkspaceSettings({
  workspace,
  onClose,
  onUpdate,
  onDelete,
}: WorkspaceSettingsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "members" | "danger">("general")
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description || "")
  const [selectedIcon, setSelectedIcon] = useState(workspace.icon)
  const [selectedColor, setSelectedColor] = useState(workspace.color)
  const [timezone, setTimezone] = useState(workspace.settings.defaultTimezone)
  const [isPublic, setIsPublic] = useState(workspace.settings.isPublic)
  const [members, setMembers] = useState<WorkspaceMember[]>(workspace.members)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("editor")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      onUpdate({
        ...workspace,
        name,
        description: description || undefined,
        icon: selectedIcon,
        color: selectedColor,
        updatedAt: new Date(),
        members,
        settings: {
          ...workspace.settings,
          defaultTimezone: timezone,
          brandColor: selectedColor,
          isPublic,
        },
      })
      setIsSaving(false)
      setHasChanges(false)
    }, 1000)
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    const newMember: WorkspaceMember = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date(),
      lastActive: new Date(),
    }
    setMembers((prev) => [...prev, newMember])
    setInviteEmail("")
    setHasChanges(true)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    setHasChanges(true)
  }

  const handleRoleChange = (memberId: string, newRole: WorkspaceRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
    setHasChanges(true)
  }

  const SelectedIcon = icons.find((i) => i.id === selectedIcon)?.icon || Building2

  const tabs = [
    { id: "general" as const, label: "General", icon: Settings },
    { id: "members" as const, label: "Members", icon: Users },
    { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: selectedColor }}
            >
              <SelectedIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Workspace Settings</h2>
              <p className="text-xs text-muted-foreground">{workspace.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-muted/30 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  tab.id === "danger" && "text-red-600 hover:text-red-600"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setHasChanges(true); }}
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setHasChanges(true); }}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setSelectedIcon(item.id); setHasChanges(true); }}
                          className={cn(
                            "p-2.5 rounded-xl border-2 transition-all",
                            selectedIcon === item.id
                              ? "border-primary bg-primary/5"
                              : "border-transparent bg-muted/60 hover:bg-muted"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", selectedIcon === item.id ? "text-primary" : "text-muted-foreground")} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => { setSelectedColor(color); setHasChanges(true); }}
                        className={cn(
                          "w-9 h-9 rounded-xl transition-all",
                          selectedColor === color && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && (
                          <Check className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label>Default Timezone</Label>
                <Select value={timezone} onValueChange={(v) => { setTimezone(v); setHasChanges(true); }}>
                  <SelectTrigger className="rounded-xl">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Public Workspace</p>
                    <p className="text-xs text-muted-foreground">
                      Anyone in your organization can view this workspace
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={(v) => { setIsPublic(v); setHasChanges(true); }}
                />
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              {/* Invite Member */}
              <Card className="p-4 bg-muted/40 border-0">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Team Member
                </h4>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as WorkspaceRole)}>
                    <SelectTrigger className="w-[120px] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInviteMember} className="rounded-xl">
                    Invite
                  </Button>
                </div>
              </Card>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Members ({members.length})
                </h4>
                {members.map((member) => {
                  const role = roleConfig[member.role]
                  const RoleIcon = role.icon
                  const isOwner = member.role === "owner"

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/40"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-background">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                      {isOwner ? (
                        <Badge
                          variant="outline"
                          className={cn("text-[10px]", role.color, "border-transparent bg-background")}
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {role.label}
                        </Badge>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(v) => handleRoleChange(member.id, v as WorkspaceRole)}
                        >
                          <SelectTrigger className="w-[110px] h-8 text-xs rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {!isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <Card className="p-4 border-red-500/30 bg-red-500/5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-600">Danger Zone</h4>
                    <p className="text-xs text-red-600/80">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Delete Workspace */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background">
                    <div>
                      <p className="text-sm font-medium text-foreground">Delete Workspace</p>
                      <p className="text-xs text-muted-foreground">
                        Permanently delete this workspace and all its data
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-2 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the workspace &quot;{workspace.name}&quot; and all
                            associated data including posts, schedules, and analytics. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(workspace.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Workspace
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {hasChanges && activeTab !== "danger" && (
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-xl">
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
