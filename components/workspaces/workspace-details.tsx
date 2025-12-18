"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  X,
  Settings,
  Archive,
  ArchiveRestore,
  Users,
  Share2,
  FileText,
  Calendar,
  TrendingUp,
  Eye,
  Megaphone,
  Rocket,
  Building2,
  Briefcase,
  Heart,
  Zap,
  Globe,
  Palette,
  Target,
  Store,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Youtube,
  CircleDot,
  ExternalLink,
  Clock,
  BarChart3,
  Crown,
  Shield,
  Edit2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import type { Workspace, WorkspaceStatus, WorkspaceRole } from "@/app/workspaces/page"

interface WorkspaceDetailsProps {
  workspace: Workspace
  onClose: () => void
  onSettings: () => void
  onArchive: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  megaphone: Megaphone,
  rocket: Rocket,
  building: Building2,
  briefcase: Briefcase,
  heart: Heart,
  zap: Zap,
  globe: Globe,
  palette: Palette,
  target: Target,
  store: Store,
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  threads: AtSign,
  tiktok: Zap,
  youtube: Youtube,
  pinterest: CircleDot,
}

const statusConfig: Record<WorkspaceStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-600", bgColor: "bg-green-500/10" },
  archived: { label: "Archived", color: "text-gray-500", bgColor: "bg-gray-500/10" },
  suspended: { label: "Suspended", color: "text-red-600", bgColor: "bg-red-500/10" },
}

const roleConfig: Record<WorkspaceRole, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  owner: { label: "Owner", color: "text-amber-600", icon: Crown },
  admin: { label: "Admin", color: "text-purple-600", icon: Shield },
  editor: { label: "Editor", color: "text-blue-600", icon: Edit2 },
  viewer: { label: "Viewer", color: "text-gray-600", icon: Eye },
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function WorkspaceDetails({
  workspace,
  onClose,
  onSettings,
  onArchive,
}: WorkspaceDetailsProps) {
  const Icon = iconMap[workspace.icon] || Building2
  const status = statusConfig[workspace.status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div
          className="h-28 relative"
          style={{
            background: `linear-gradient(135deg, ${workspace.color}40 0%, ${workspace.color}80 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 pb-6 -mt-14">
          {/* Header */}
          <div className="flex items-end gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-background"
              style={{ backgroundColor: workspace.color }}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{workspace.name}</h2>
                <Badge
                  variant="outline"
                  className={cn("text-xs", status.bgColor, status.color, "border-transparent")}
                >
                  {status.label}
                </Badge>
              </div>
              {workspace.description && (
                <p className="text-sm text-muted-foreground">{workspace.description}</p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Posts</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(workspace.stats.totalPosts)}</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Scheduled</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{workspace.stats.scheduledPosts}</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{workspace.stats.engagement}%</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Reach</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(workspace.stats.reach)}</p>
            </Card>
          </div>

          {/* Connected Channels */}
          <Card className="p-4 mb-6 bg-muted/40 border-0">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Connected Channels ({workspace.channels.length})
            </h4>
            {workspace.channels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workspace.channels.map((channel) => {
                  const PlatformIcon = platformIcons[channel.platform] || Share2
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <PlatformIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          @{channel.username}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {channel.platform}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatNumber(channel.followers)}
                        </p>
                        <p className="text-xs text-muted-foreground">followers</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Share2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No channels connected</p>
              </div>
            )}
          </Card>

          {/* Team Members */}
          <Card className="p-4 bg-muted/40 border-0">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members ({workspace.members.length})
            </h4>
            <div className="space-y-3">
              {workspace.members.map((member) => {
                const role = roleConfig[member.role]
                const RoleIcon = role.icon
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-muted">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", role.color, "border-transparent bg-muted")}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {role.label}
                      </Badge>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">
                        Active {formatDistanceToNow(member.lastActive, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Workspace Info */}
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Created {format(workspace.createdAt, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {formatNumber(workspace.stats.followers)} total followers
              </span>
            </div>
            <span>
              Updated {formatDistanceToNow(workspace.updatedAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={onArchive}>
            {workspace.status === "archived" ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                Restore
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                Archive
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={onSettings}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button className="gap-2 rounded-xl">
              <ExternalLink className="w-4 h-4" />
              Open Workspace
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
