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
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Youtube,
  CircleDot,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Trash2,
  ExternalLink,
  Link2,
  Link2Off,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  BadgeCheck,
  Eye,
  Calendar,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Platform, Channel, ChannelGroup, ViewMode, ConnectionStatus } from "@/app/channels/page"

interface ChannelsGridProps {
  channels: Channel[]
  viewMode: ViewMode
  groups: ChannelGroup[]
  onSelectChannel: (channel: Channel) => void
  onReconnect: (id: string) => void
  onDisconnect: (id: string) => void
  onSync: (id: string) => void
  onSettings: (channel: Channel) => void
  onRemove: (id: string) => void
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "bg-[#1877F2]" },
  twitter: { name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "bg-black" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", bgColor: "bg-[#0A66C2]" },
  threads: { name: "Threads", icon: AtSign, color: "#000000", bgColor: "bg-black" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000", bgColor: "bg-black" },
  youtube: { name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "bg-[#FF0000]" },
  pinterest: { name: "Pinterest", icon: CircleDot, color: "#E60023", bgColor: "bg-[#E60023]" },
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  connected: { label: "Connected", color: "text-green-600", bgColor: "bg-green-500/10", icon: CheckCircle2 },
  disconnected: { label: "Disconnected", color: "text-gray-500", bgColor: "bg-gray-500/10", icon: Link2Off },
  expired: { label: "Token Expired", color: "text-amber-600", bgColor: "bg-amber-500/10", icon: AlertTriangle },
  error: { label: "Connection Error", color: "text-red-600", bgColor: "bg-red-500/10", icon: XCircle },
  pending: { label: "Pending", color: "text-blue-600", bgColor: "bg-blue-500/10", icon: Clock },
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function ChannelsGrid({
  channels,
  viewMode,
  groups,
  onSelectChannel,
  onReconnect,
  onDisconnect,
  onSync,
  onSettings,
  onRemove,
}: ChannelsGridProps) {
  if (channels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="p-12 bg-card border-border shadow-sm max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No channels found</h3>
            <p className="text-sm text-muted-foreground">
              Connect your social media accounts to start managing your content.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-3">
          {channels.map((channel) => {
            const platform = platformConfig[channel.platform]
            const status = statusConfig[channel.connectionStatus]
            const PlatformIcon = platform.icon
            const StatusIcon = status.icon

            return (
              <Card
                key={channel.id}
                className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectChannel(channel)}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Platform Icon & Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="w-14 h-14 border-2 border-border">
                      <AvatarImage src={channel.profileImage} />
                      <AvatarFallback className={cn("text-white font-semibold", platform.bgColor)}>
                        {channel.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-background",
                        platform.bgColor
                      )}
                    >
                      <PlatformIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {channel.displayName}
                      </h3>
                      {channel.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-semibold ml-auto", status.bgColor, status.color, "border-transparent")}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">@{channel.username}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{formatNumber(channel.stats.followers)}</p>
                      <p className="text-[10px] text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{channel.stats.engagement}%</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        {channel.stats.growth >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        )}
                        <p className={cn(
                          "text-sm font-semibold",
                          channel.stats.growth >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {channel.stats.growth > 0 ? "+" : ""}{channel.stats.growth}%
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Growth</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectChannel(channel); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSync(channel.id); }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Now
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSettings(channel); }}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {channel.connectionStatus === "connected" ? (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDisconnect(channel.id); }}>
                          <Link2Off className="w-4 h-4 mr-2" />
                          Disconnect
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReconnect(channel.id); }}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Reconnect
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onRemove(channel.id); }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {channels.map((channel) => {
          const platform = platformConfig[channel.platform]
          const status = statusConfig[channel.connectionStatus]
          const PlatformIcon = platform.icon
          const StatusIcon = status.icon
          const needsAttention = ["expired", "error", "disconnected"].includes(channel.connectionStatus)

          return (
            <Card
              key={channel.id}
              className={cn(
                "bg-card border-border shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
                needsAttention && "border-amber-500/50"
              )}
              onClick={() => onSelectChannel(channel)}
            >
              {/* Header Gradient */}
              <div
                className="h-16 relative"
                style={{
                  background: `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}40 100%)`,
                }}
              >
                <div
                  className={cn(
                    "absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center",
                    platform.bgColor
                  )}
                >
                  <PlatformIcon className="w-4 h-4 text-white" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectChannel(channel); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSync(channel.id); }}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSettings(channel); }}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {channel.connectionStatus === "connected" ? (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDisconnect(channel.id); }}>
                        <Link2Off className="w-4 h-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReconnect(channel.id); }}>
                        <Link2 className="w-4 h-4 mr-2" />
                        Reconnect
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => { e.stopPropagation(); onRemove(channel.id); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content */}
              <div className="p-4 -mt-8">
                {/* Avatar */}
                <div className="relative w-fit mb-3">
                  <Avatar className="w-16 h-16 border-4 border-background shadow-md">
                    <AvatarImage src={channel.profileImage} />
                    <AvatarFallback className={cn("text-white font-semibold text-lg", platform.bgColor)}>
                      {channel.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {channel.isVerified && (
                    <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-background rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {channel.displayName}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">@{channel.username}</p>
                </div>

                {/* Status */}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold mb-3",
                    status.bgColor,
                    status.color,
                    "border-transparent"
                  )}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <p className="text-sm font-bold text-foreground">{formatNumber(channel.stats.followers)}</p>
                    <p className="text-[9px] text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <p className="text-sm font-bold text-foreground">{channel.stats.engagement}%</p>
                    <p className="text-[9px] text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <div className="flex items-center justify-center gap-0.5">
                      {channel.stats.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <p className={cn(
                        "text-sm font-bold",
                        channel.stats.growth >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {Math.abs(channel.stats.growth)}%
                      </p>
                    </div>
                    <p className="text-[9px] text-muted-foreground">Growth</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {channel.scheduledPosts} scheduled
                  </span>
                  <span>
                    Synced {formatDistanceToNow(channel.lastSyncedAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
