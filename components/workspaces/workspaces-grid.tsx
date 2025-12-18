"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Settings,
  Archive,
  ArchiveRestore,
  ExternalLink,
  Users,
  Share2,
  FileText,
  Calendar,
  TrendingUp,
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Workspace, ViewMode, WorkspaceStatus } from "@/app/workspaces/page"

interface WorkspacesGridProps {
  workspaces: Workspace[]
  viewMode: ViewMode
  onSelectWorkspace: (workspace: Workspace) => void
  onSettingsClick: (workspace: Workspace) => void
  onArchiveClick: (workspaceId: string) => void
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

const statusConfig: Record<WorkspaceStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-600", bgColor: "bg-green-500/10" },
  archived: { label: "Archived", color: "text-gray-500", bgColor: "bg-gray-500/10" },
  suspended: { label: "Suspended", color: "text-red-600", bgColor: "bg-red-500/10" },
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function WorkspacesGrid({
  workspaces,
  viewMode,
  onSelectWorkspace,
  onSettingsClick,
  onArchiveClick,
}: WorkspacesGridProps) {
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No workspaces found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Create your first workspace to start managing your social media presence.
        </p>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onSelect={() => onSelectWorkspace(workspace)}
            onSettings={() => onSettingsClick(workspace)}
            onArchive={() => onArchiveClick(workspace.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {workspaces.map((workspace) => (
        <WorkspaceRow
          key={workspace.id}
          workspace={workspace}
          onSelect={() => onSelectWorkspace(workspace)}
          onSettings={() => onSettingsClick(workspace)}
          onArchive={() => onArchiveClick(workspace.id)}
        />
      ))}
    </div>
  )
}

interface WorkspaceItemProps {
  workspace: Workspace
  onSelect: () => void
  onSettings: () => void
  onArchive: () => void
}

function WorkspaceCard({ workspace, onSelect, onSettings, onArchive }: WorkspaceItemProps) {
  const Icon = iconMap[workspace.icon] || Building2
  const status = statusConfig[workspace.status]

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
        workspace.status === "archived" && "opacity-60"
      )}
      onClick={onSelect}
    >
      {/* Header with color */}
      <div
        className="h-20 relative"
        style={{
          background: `linear-gradient(135deg, ${workspace.color}40 0%, ${workspace.color}80 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

        {/* Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(); }}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSettings(); }}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                {workspace.status === "archived" ? (
                  <>
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                    Restore
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-8">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-background mb-3"
          style={{ backgroundColor: workspace.color }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">{workspace.name}</h3>
            {workspace.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {workspace.description}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] shrink-0", status.bgColor, status.color, "border-transparent")}
          >
            {status.label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-border">
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{workspace.members.length}</p>
            <p className="text-[10px] text-muted-foreground">Members</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{workspace.channels.length}</p>
            <p className="text-[10px] text-muted-foreground">Channels</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{workspace.stats.scheduledPosts}</p>
            <p className="text-[10px] text-muted-foreground">Scheduled</p>
          </div>
        </div>

        {/* Members Avatars */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex -space-x-2">
            {workspace.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="w-7 h-7 border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-[10px] bg-muted">
                  {member.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-[10px] font-medium text-muted-foreground">
                  +{workspace.members.length - 4}
                </span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Updated {formatDistanceToNow(workspace.updatedAt, { addSuffix: true })}
          </span>
        </div>
      </div>
    </Card>
  )
}

function WorkspaceRow({ workspace, onSelect, onSettings, onArchive }: WorkspaceItemProps) {
  const Icon = iconMap[workspace.icon] || Building2
  const status = statusConfig[workspace.status]

  return (
    <Card
      className={cn(
        "group p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
        workspace.status === "archived" && "opacity-60"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: workspace.color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{workspace.name}</h3>
            <Badge
              variant="outline"
              className={cn("text-[10px]", status.bgColor, status.color, "border-transparent")}
            >
              {status.label}
            </Badge>
          </div>
          {workspace.description && (
            <p className="text-xs text-muted-foreground truncate">{workspace.description}</p>
          )}
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{workspace.members.length}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{workspace.channels.length}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{workspace.stats.scheduledPosts}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{workspace.stats.engagement}%</span>
          </div>
        </div>

        {/* Members */}
        <div className="hidden lg:flex -space-x-2">
          {workspace.members.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-xs bg-muted">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {workspace.members.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{workspace.members.length - 3}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(); }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSettings(); }}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
              {workspace.status === "archived" ? (
                <>
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
