"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Zap,
  AtSign,
  CircleDot,
  Users,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { PlatformStatus, Platform } from "@/app/page"
import Link from "next/link"

interface PlatformHealthProps {
  platforms: PlatformStatus[]
}

const platformConfig: Record<Platform, {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}> = {
  instagram: { name: "Instagram", icon: Instagram, color: "text-pink-500", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500" },
  facebook: { name: "Facebook", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-600" },
  twitter: { name: "Twitter", icon: Twitter, color: "text-foreground", bgColor: "bg-foreground" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-700" },
  tiktok: { name: "TikTok", icon: Zap, color: "text-foreground", bgColor: "bg-foreground" },
  youtube: { name: "YouTube", icon: Youtube, color: "text-red-500", bgColor: "bg-red-500" },
  threads: { name: "Threads", icon: AtSign, color: "text-foreground", bgColor: "bg-foreground" },
  pinterest: { name: "Pinterest", icon: CircleDot, color: "text-red-600", bgColor: "bg-red-600" },
}

const healthConfig = {
  excellent: { label: "Excellent", color: "text-green-500", bgColor: "bg-green-500", icon: CheckCircle2 },
  good: { label: "Good", color: "text-blue-500", bgColor: "bg-blue-500", icon: CheckCircle2 },
  warning: { label: "Warning", color: "text-amber-500", bgColor: "bg-amber-500", icon: AlertCircle },
  error: { label: "Error", color: "text-red-500", bgColor: "bg-red-500", icon: XCircle },
}

const formatFollowers = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function PlatformHealth({ platforms }: PlatformHealthProps) {
  const connectedPlatforms = platforms.filter((p) => p.connected)
  const disconnectedPlatforms = platforms.filter((p) => !p.connected)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Platform Status
          </h3>
          <p className="text-xs text-muted-foreground">
            {connectedPlatforms.length} connected
          </p>
        </div>
        <Link href="/channels">
          <Button variant="ghost" size="sm" className="rounded-xl">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {connectedPlatforms.map((platform) => {
          const config = platformConfig[platform.platform]
          const health = healthConfig[platform.health]
          const Icon = config.icon
          const HealthIcon = health.icon

          return (
            <div
              key={platform.platform}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors group"
            >
              {/* Platform Icon */}
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", config.bgColor)}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{config.name}</span>
                  <HealthIcon className={cn("w-3.5 h-3.5", health.color)} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {formatFollowers(platform.followers)}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1",
                    platform.followersChange >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    <TrendingUp className="w-3 h-3" />
                    {platform.followersChange >= 0 ? "+" : ""}{platform.followersChange}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{platform.engagement}%</p>
                <p className="text-[10px] text-muted-foreground">engagement</p>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", health.bgColor)} />
              </div>
            </div>
          )
        })}

        {/* Disconnected / Add New */}
        {disconnectedPlatforms.length > 0 && (
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide">
              Not Connected
            </p>
            {disconnectedPlatforms.map((platform) => {
              const config = platformConfig[platform.platform]
              const Icon = config.icon
              return (
                <div
                  key={platform.platform}
                  className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {config.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Connect
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add More Button */}
      <Link href="/channels">
        <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          Connect New Platform
        </Button>
      </Link>
    </Card>
  )
}
