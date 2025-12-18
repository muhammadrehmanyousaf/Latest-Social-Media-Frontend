"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  Eye,
  TrendingUp,
  Image,
  Video,
  Film,
  FileText,
  Layers,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  Zap,
  CircleDot,
  BarChart3,
  ArrowUpRight,
  ExternalLink,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { PostPerformance, DateRange, Platform } from "@/app/analytics/page"

interface ContentPerformanceProps {
  topPosts: PostPerformance[]
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
  tiktok: "#000000",
  youtube: "#FF0000",
  threads: "#000000",
  pinterest: "#E60023",
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  image: Image,
  video: Video,
  carousel: Layers,
  story: Film,
  reel: Film,
  text: FileText,
}

const typeColors = ["#8b5cf6", "#f97316", "#22c55e", "#3b82f6", "#ec4899", "#f59e0b"]

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function ContentPerformance({ topPosts, dateRange }: ContentPerformanceProps) {
  const [sortBy, setSortBy] = useState<"engagement" | "reach" | "impressions" | "recent">("engagement")
  const [filterType, setFilterType] = useState<string>("all")

  // Sort posts
  const sortedPosts = [...topPosts].sort((a, b) => {
    switch (sortBy) {
      case "engagement":
        return b.engagementRate - a.engagementRate
      case "reach":
        return b.engagement.reach - a.engagement.reach
      case "impressions":
        return b.engagement.impressions - a.engagement.impressions
      case "recent":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      default:
        return 0
    }
  })

  // Filter posts
  const filteredPosts = filterType === "all"
    ? sortedPosts
    : sortedPosts.filter((p) => p.type === filterType)

  // Calculate content type distribution
  const typeDistribution = topPosts.reduce((acc, post) => {
    acc[post.type] = (acc[post.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(typeDistribution).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: typeColors[index % typeColors.length],
  }))

  // Calculate engagement by type
  const engagementByType = topPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = { total: 0, count: 0 }
    }
    acc[post.type].total += post.engagementRate
    acc[post.type].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const barData = Object.entries(engagementByType).map(([type, data], index) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    engagement: (data.total / data.count).toFixed(2),
    color: typeColors[index % typeColors.length],
  }))

  return (
    <div className="space-y-6">
      {/* Content Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Distribution */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Content Type Distribution
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement by Content Type */}
        <Card className="p-6 lg:col-span-2">
          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Average Engagement by Content Type
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}%`, "Engagement"]}
                />
                <Bar dataKey="engagement" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Top Performing Posts</h3>
            <p className="text-sm text-muted-foreground">Your best content this period</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[130px] rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="carousel">Carousels</SelectItem>
                <SelectItem value="reel">Reels</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement Rate</SelectItem>
                <SelectItem value="reach">Reach</SelectItem>
                <SelectItem value="impressions">Impressions</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            const PlatformIcon = platformIcons[post.platform]
            const TypeIcon = typeIcons[post.type] || FileText
            const platformColor = platformColors[post.platform]

            return (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background font-bold text-sm text-muted-foreground">
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: platformColor }}
                  >
                    <PlatformIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {post.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 mb-3">
                    {post.caption}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3.5 h-3.5 text-pink-500" />
                      {formatNumber(post.engagement.likes)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                      {formatNumber(post.engagement.comments)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Share2 className="w-3.5 h-3.5 text-green-500" />
                      {formatNumber(post.engagement.shares)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      {formatNumber(post.engagement.saves)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3.5 h-3.5 text-purple-500" />
                      {formatNumber(post.engagement.reach)}
                    </div>
                  </div>
                </div>

                {/* Engagement Rate */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {post.engagementRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>

                {/* View Button */}
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No posts found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
