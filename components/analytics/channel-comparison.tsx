"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  Zap,
  CircleDot,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  FileText,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { ChannelMetrics, DateRange, Platform } from "@/app/analytics/page"

interface ChannelComparisonProps {
  channels: ChannelMetrics[]
  dateRange: DateRange
}

const platformConfig: Record<Platform, {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "bg-[#1877F2]" },
  twitter: { name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "bg-black" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", bgColor: "bg-[#0A66C2]" },
  tiktok: { name: "TikTok", icon: Zap, color: "#ff0050", bgColor: "bg-black" },
  youtube: { name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "bg-[#FF0000]" },
  threads: { name: "Threads", icon: AtSign, color: "#000000", bgColor: "bg-black" },
  pinterest: { name: "Pinterest", icon: CircleDot, color: "#E60023", bgColor: "bg-[#E60023]" },
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function ChannelComparison({ channels, dateRange }: ChannelComparisonProps) {
  const [viewMode, setViewMode] = useState<"table" | "charts">("table")
  const [selectedMetric, setSelectedMetric] = useState<"followers" | "engagement" | "reach">("followers")

  // Calculate totals
  const totals = {
    followers: channels.reduce((sum, c) => sum + c.followers, 0),
    reach: channels.reduce((sum, c) => sum + c.reach, 0),
    impressions: channels.reduce((sum, c) => sum + c.impressions, 0),
    posts: channels.reduce((sum, c) => sum + c.posts, 0),
    clicks: channels.reduce((sum, c) => sum + c.clicks, 0),
  }

  // Prepare chart data
  const barChartData = channels.map((channel) => ({
    platform: platformConfig[channel.platform].name,
    followers: channel.followers,
    reach: channel.reach,
    engagement: channel.engagement,
    color: platformConfig[channel.platform].color,
  }))

  const pieChartData = channels.map((channel) => ({
    name: platformConfig[channel.platform].name,
    value: channel[selectedMetric === "engagement" ? "followers" : selectedMetric],
    color: platformConfig[channel.platform].color,
  }))

  const radarData = [
    { metric: "Followers", ...channels.reduce((acc, c) => ({ ...acc, [platformConfig[c.platform].name]: (c.followers / Math.max(...channels.map(ch => ch.followers))) * 100 }), {}) },
    { metric: "Engagement", ...channels.reduce((acc, c) => ({ ...acc, [platformConfig[c.platform].name]: (c.engagement / Math.max(...channels.map(ch => ch.engagement))) * 100 }), {}) },
    { metric: "Reach", ...channels.reduce((acc, c) => ({ ...acc, [platformConfig[c.platform].name]: (c.reach / Math.max(...channels.map(ch => ch.reach))) * 100 }), {}) },
    { metric: "Posts", ...channels.reduce((acc, c) => ({ ...acc, [platformConfig[c.platform].name]: (c.posts / Math.max(...channels.map(ch => ch.posts))) * 100 }), {}) },
    { metric: "Clicks", ...channels.reduce((acc, c) => ({ ...acc, [platformConfig[c.platform].name]: (c.clicks / Math.max(...channels.map(ch => ch.clicks))) * 100 }), {}) },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatNumber(totals.followers)}</p>
              <p className="text-xs text-muted-foreground">Total Followers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatNumber(totals.reach)}</p>
              <p className="text-xs text-muted-foreground">Total Reach</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatNumber(totals.impressions)}</p>
              <p className="text-xs text-muted-foreground">Impressions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{totals.posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatNumber(totals.clicks)}</p>
              <p className="text-xs text-muted-foreground">Link Clicks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Channel Performance</h3>
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("charts")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "charts"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PieChartIcon className="w-4 h-4" />
            Charts
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        /* Channel Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {channels.map((channel) => {
            const config = platformConfig[channel.platform]
            const Icon = config.icon

            return (
              <Card key={channel.platform} className="overflow-hidden">
                {/* Header */}
                <div
                  className="h-16 relative flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: config.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">{config.name}</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        channel.followersChange >= 0
                          ? "bg-green-500/10 text-green-600 border-transparent"
                          : "bg-red-500/10 text-red-600 border-transparent"
                      )}
                    >
                      {channel.followersChange >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(channel.followersChange)}%
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Followers</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatNumber(channel.followers)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Engagement</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-foreground">
                          {channel.engagement}%
                        </span>
                        <span className={cn(
                          "text-xs",
                          channel.engagementChange >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          ({channel.engagementChange >= 0 ? "+" : ""}{channel.engagementChange}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Reach</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-foreground">
                          {formatNumber(channel.reach)}
                        </span>
                        <span className={cn(
                          "text-xs",
                          channel.reachChange >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          ({channel.reachChange >= 0 ? "+" : ""}{channel.reachChange}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Posts</span>
                      <span className="text-sm font-semibold text-foreground">{channel.posts}</span>
                    </div>
                  </div>

                  {/* Distribution Bar */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Share of Total Reach</span>
                      <span className="text-xs font-medium text-foreground">
                        {((channel.reach / totals.reach) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(channel.reach / totals.reach) * 100}
                      className="h-2"
                      style={{ "--progress-color": config.color } as React.CSSProperties}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Charts View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-foreground mb-4">Followers by Platform</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis
                    dataKey="platform"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={formatNumber}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatNumber(value as number), "Followers"]}
                  />
                  <Bar dataKey="followers" radius={[4, 4, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">Distribution</h4>
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg">
                {(["followers", "reach"] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all capitalize",
                      selectedMetric === metric
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatNumber(value as number), selectedMetric]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="p-6 lg:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">Performance Comparison</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  {channels.slice(0, 4).map((channel) => (
                    <Radar
                      key={channel.platform}
                      name={platformConfig[channel.platform].name}
                      dataKey={platformConfig[channel.platform].name}
                      stroke={platformConfig[channel.platform].color}
                      fill={platformConfig[channel.platform].color}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
