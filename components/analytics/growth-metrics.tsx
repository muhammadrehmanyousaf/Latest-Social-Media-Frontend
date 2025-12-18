"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { ChannelMetrics, DateRange, Platform } from "@/app/analytics/page"

interface GrowthMetricsProps {
  channels: ChannelMetrics[]
  dateRange: DateRange
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Zap,
  youtube: Youtube,
  threads: AtSign,
  pinterest: CircleDot,
}

const platformColors: Record<Platform, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
  linkedin: "#0A66C2",
  tiktok: "#ff0050",
  youtube: "#FF0000",
  threads: "#000000",
  pinterest: "#E60023",
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Generate mock growth data for sparklines
const generateGrowthData = (baseFollowers: number, change: number, days: number) => {
  const data = []
  const dailyChange = (baseFollowers * (change / 100)) / days
  let currentValue = baseFollowers - (baseFollowers * (change / 100))

  for (let i = 0; i < days; i++) {
    currentValue += dailyChange + (Math.random() - 0.5) * dailyChange * 0.3
    data.push({
      day: i,
      value: Math.round(currentValue),
    })
  }
  return data
}

export function GrowthMetrics({ channels, dateRange }: GrowthMetricsProps) {
  const days = dateRange === "7d" ? 7 : dateRange === "14d" ? 14 : dateRange === "30d" ? 30 : 30

  // Sort channels by growth
  const sortedByGrowth = [...channels].sort((a, b) => b.followersChange - a.followersChange)
  const fastestGrowing = sortedByGrowth[0]
  const needsAttention = sortedByGrowth.filter((c) => c.followersChange < 0)

  // Calculate total growth
  const totalFollowers = channels.reduce((sum, c) => sum + c.followers, 0)
  const avgGrowth = channels.reduce((sum, c) => sum + c.followersChange, 0) / channels.length
  const totalNewFollowers = channels.reduce((sum, c) => sum + Math.round(c.followers * (c.followersChange / 100)), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Growth Summary */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Growth Summary
        </h4>

        <div className="space-y-4">
          {/* Total Followers */}
          <div className="p-4 rounded-xl bg-muted/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Followers</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  avgGrowth >= 0
                    ? "bg-green-500/10 text-green-600 border-transparent"
                    : "bg-red-500/10 text-red-600 border-transparent"
                )}
              >
                {avgGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(avgGrowth).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatNumber(totalFollowers)}</p>
          </div>

          {/* New Followers */}
          <div className="p-4 rounded-xl bg-muted/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">New Followers</span>
              <span className="text-xs text-muted-foreground">this period</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              totalNewFollowers >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {totalNewFollowers >= 0 ? "+" : ""}{formatNumber(totalNewFollowers)}
            </p>
          </div>

          {/* Fastest Growing */}
          {fastestGrowing && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">Fastest Growing</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = platformIcons[fastestGrowing.platform]
                    return <Icon className="w-5 h-5" style={{ color: platformColors[fastestGrowing.platform] }} />
                  })()}
                  <span className="text-sm font-medium text-foreground capitalize">
                    {fastestGrowing.platform}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  +{fastestGrowing.followersChange}%
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Channel Growth Sparklines */}
      <Card className="p-6 lg:col-span-2">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Follower Growth by Channel
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.slice(0, 6).map((channel) => {
            const Icon = platformIcons[channel.platform]
            const color = platformColors[channel.platform]
            const growthData = generateGrowthData(channel.followers, channel.followersChange, days)
            const isPositive = channel.followersChange >= 0

            return (
              <div
                key={channel.platform}
                className="p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {channel.platform}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(channel.followers)} followers
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {isPositive ? "+" : ""}{channel.followersChange}%
                  </div>
                </div>

                {/* Sparkline */}
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isPositive ? "#22c55e" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value) => [formatNumber(value as number), "Followers"]}
                        labelFormatter={() => ""}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          })}
        </div>

        {/* Needs Attention */}
        {needsAttention.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-600">Needs Attention</span>
            </div>
            <p className="text-sm text-amber-600">
              {needsAttention.map((c) => c.platform).join(", ")} {needsAttention.length === 1 ? "is" : "are"} showing
              declining follower growth. Consider reviewing your content strategy for {needsAttention.length === 1 ? "this platform" : "these platforms"}.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
