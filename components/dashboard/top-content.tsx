"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Crown,
  ArrowRight,
  Flame,
  Zap,
  AtSign,
  CircleDot,
  ImageIcon,
  Video,
  LayoutGrid,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { TopPost, Platform } from "@/app/page"
import Link from "next/link"

interface TopContentProps {
  posts: TopPost[]
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
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  twitter: "bg-foreground",
  linkedin: "bg-blue-700",
  tiktok: "bg-foreground",
  youtube: "bg-red-500",
  threads: "bg-foreground",
  pinterest: "bg-red-600",
}

const mediaTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  video: Video,
  carousel: LayoutGrid,
  text: MessageCircle,
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function TopContent({ posts }: TopContentProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week")

  // Sort by engagement
  const sortedPosts = [...posts].sort((a, b) => {
    const aTotal = a.engagement.likes + a.engagement.comments + a.engagement.shares
    const bTotal = b.engagement.likes + b.engagement.comments + b.engagement.shares
    return bTotal - aTotal
  })

  const topPost = sortedPosts[0]
  const runnerUps = sortedPosts.slice(1, 4)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top Performing Content</h3>
            <p className="text-[10px] text-muted-foreground">
              Your best posts by engagement
            </p>
          </div>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["week", "month", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-colors capitalize",
                timeRange === range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range === "all" ? "All Time" : `This ${range}`}
            </button>
          ))}
        </div>
      </div>

      {topPost && (
        <>
          {/* Featured Top Post */}
          <div className="relative mb-4 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
            {/* Crown Badge */}
            <div className="absolute -top-2 -left-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
                {topPost.thumbnail ? (
                  <img
                    src={topPost.thumbnail}
                    alt={topPost.content}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {(() => {
                      const MediaIcon = mediaTypeIcons[topPost.mediaType]
                      return <MediaIcon className="w-8 h-8 text-muted-foreground" />
                    })()}
                  </div>
                )}

                {/* Platform Badge */}
                <div className={cn(
                  "absolute bottom-1 right-1 w-5 h-5 rounded-md flex items-center justify-center",
                  platformColors[topPost.platform]
                )}>
                  {(() => {
                    const PlatformIcon = platformIcons[topPost.platform]
                    return <PlatformIcon className="w-3 h-3 text-white" />
                  })()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] gap-1">
                    <Flame className="w-3 h-3" />
                    #1 Top Post
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {topPost.mediaType}
                  </Badge>
                </div>

                <p className="text-sm text-foreground line-clamp-2 mb-2">
                  {topPost.content}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  Posted {format(topPost.publishedAt, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-500/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-pink-500 mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{formatNumber(topPost.engagement.likes)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Likes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{formatNumber(topPost.engagement.comments)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Comments</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{formatNumber(topPost.engagement.shares)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Shares</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{formatNumber(topPost.engagement.reach)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Reach</p>
              </div>
            </div>
          </div>

          {/* Runner Up Posts */}
          <div className="space-y-2">
            {runnerUps.map((post, index) => {
              const PlatformIcon = platformIcons[post.platform]
              const MediaIcon = mediaTypeIcons[post.mediaType]
              const totalEngagement = post.engagement.likes + post.engagement.comments + post.engagement.shares

              return (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  {/* Rank */}
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    #{index + 2}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.content}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MediaIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground line-clamp-1 mb-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-4 h-4 rounded flex items-center justify-center",
                        platformColors[post.platform]
                      )}>
                        <PlatformIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {format(post.publishedAt, "MMM d")}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(post.engagement.likes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {formatNumber(post.engagement.comments)}
                    </div>
                  </div>

                  {/* Engagement Badge */}
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {formatNumber(totalEngagement)} eng
                  </Badge>
                </div>
              )
            })}
          </div>
        </>
      )}

      {posts.length === 0 && (
        <div className="text-center py-8">
          <Crown className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No published posts yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start posting to see your top content
          </p>
        </div>
      )}

      {/* View All Link */}
      <Link href="/analytics">
        <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl gap-1 text-xs">
          View All Analytics
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </Card>
  )
}
