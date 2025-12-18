"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Youtube,
  CircleDot,
  X,
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
  Heart,
  MessageCircle,
  Share,
  Calendar,
  Globe,
  BarChart3,
  Activity,
  Target,
  Zap as Lightning,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import type { Platform, Channel, ConnectionStatus } from "@/app/channels/page"

interface ChannelDetailsProps {
  channel: Channel
  onClose: () => void
  onReconnect: () => void
  onDisconnect: () => void
  onSync: () => void
  onSettings: () => void
  onRemove: () => void
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

export function ChannelDetails({
  channel,
  onClose,
  onReconnect,
  onDisconnect,
  onSync,
  onSettings,
  onRemove,
}: ChannelDetailsProps) {
  const platform = platformConfig[channel.platform]
  const status = statusConfig[channel.connectionStatus]
  const PlatformIcon = platform.icon
  const StatusIcon = status.icon
  const needsAttention = ["expired", "error", "disconnected"].includes(channel.connectionStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div
          className="h-24 relative"
          style={{
            background: `linear-gradient(135deg, ${platform.color}30 0%, ${platform.color}60 100%)`,
          }}
        >
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
        <div className="flex-1 overflow-auto px-6 pb-6 -mt-12">
          {/* Profile Header */}
          <div className="flex items-end gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={channel.profileImage} />
                <AvatarFallback className={cn("text-white font-bold text-2xl", platform.bgColor)}>
                  {channel.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-background",
                  platform.bgColor
                )}
              >
                <PlatformIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">{channel.displayName}</h2>
                {channel.isVerified && (
                  <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{channel.username}</p>
              <Badge className="mt-2 capitalize text-xs">{channel.accountType}</Badge>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold shrink-0",
                status.bgColor,
                status.color,
                "border-transparent"
              )}
            >
              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
              {status.label}
            </Badge>
          </div>

          {/* Warning Banner */}
          {needsAttention && (
            <Card className="p-4 mb-6 bg-amber-500/10 border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-600 mb-1">
                    {channel.connectionStatus === "expired"
                      ? "Token Expired"
                      : channel.connectionStatus === "error"
                      ? "Connection Error"
                      : "Channel Disconnected"}
                  </p>
                  <p className="text-xs text-amber-600/80">
                    {channel.connectionStatus === "expired"
                      ? "Your access token has expired. Please reconnect to continue posting."
                      : channel.connectionStatus === "error"
                      ? "There was an error connecting to this account. Try reconnecting."
                      : "This channel is disconnected. Reconnect to resume posting."}
                  </p>
                </div>
                <Button size="sm" className="shrink-0" onClick={onReconnect}>
                  <Link2 className="w-4 h-4 mr-1.5" />
                  Reconnect
                </Button>
              </div>
            </Card>
          )}

          {/* Bio */}
          {channel.bio && (
            <div className="mb-6">
              <p className="text-sm text-foreground">{channel.bio}</p>
              {channel.website && (
                <a
                  href={channel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary mt-2 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {channel.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(channel.stats.followers)}</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{channel.stats.engagement}%</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Reach</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(channel.stats.reach)}</p>
            </Card>
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-2 mb-2">
                {channel.stats.growth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs text-muted-foreground">Growth</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                channel.stats.growth >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {channel.stats.growth > 0 ? "+" : ""}{channel.stats.growth}%
              </p>
            </Card>
          </div>

          {/* Engagement Stats */}
          <Card className="p-4 mb-6 bg-muted/40 border-0">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Average Post Performance
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatNumber(channel.stats.avgLikes)}</p>
                  <p className="text-xs text-muted-foreground">Avg. Likes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatNumber(channel.stats.avgComments)}</p>
                  <p className="text-xs text-muted-foreground">Avg. Comments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatNumber(channel.stats.impressions)}</p>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Connection Info */}
          <Card className="p-4 bg-muted/40 border-0">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightning className="w-4 h-4" />
              Connection Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connected</span>
                <span className="text-sm text-foreground">{format(channel.connectedAt, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Synced</span>
                <span className="text-sm text-foreground">
                  {formatDistanceToNow(channel.lastSyncedAt, { addSuffix: true })}
                </span>
              </div>
              {channel.tokenExpiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token Expires</span>
                  <span className={cn(
                    "text-sm",
                    channel.tokenExpiresAt < new Date() ? "text-red-600" : "text-foreground"
                  )}>
                    {format(channel.tokenExpiresAt, "MMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Scheduled Posts</span>
                <span className="text-sm text-foreground">{channel.scheduledPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Posts</span>
                <span className="text-sm text-foreground">{channel.stats.posts}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onSync}>
              <RefreshCw className="w-4 h-4" />
              Sync
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onSettings}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {channel.connectionStatus === "connected" ? (
              <Button variant="outline" size="sm" className="gap-2" onClick={onDisconnect}>
                <Link2Off className="w-4 h-4" />
                Disconnect
              </Button>
            ) : (
              <Button size="sm" className="gap-2" onClick={onReconnect}>
                <Link2 className="w-4 h-4" />
                Reconnect
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
