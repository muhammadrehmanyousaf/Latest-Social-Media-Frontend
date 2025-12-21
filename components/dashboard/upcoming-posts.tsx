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
  Clock,
  Image,
  Video,
  Layers,
  FileText,
  Film,
  ArrowRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Calendar,
  Zap,
  AtSign,
  CircleDot,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import type { ScheduledPost, Platform } from "@/app/page"
import Link from "next/link"

interface UpcomingPostsProps {
  posts: ScheduledPost[]
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
  image: Image,
  video: Video,
  carousel: Layers,
  text: FileText,
  reel: Film,
  story: Film,
}

export function UpcomingPosts({ posts }: UpcomingPostsProps) {
  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled")
    .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())
    .slice(0, 4)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Upcoming Posts
          </h3>
          <p className="text-xs text-muted-foreground">
            {posts.filter((p) => p.status === "scheduled").length} scheduled
          </p>
        </div>
        <Link href="/schedule">
          <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {upcomingPosts.map((post, index) => {
          const MediaIcon = mediaTypeIcons[post.mediaType] || FileText
          const isNext = index === 0

          return (
            <div
              key={post.id}
              className={cn(
                "relative p-3 rounded-xl transition-all group",
                isNext
                  ? "bg-primary/5 border border-primary/20"
                  : "bg-muted/40 hover:bg-muted/60"
              )}
            >
              {isNext && (
                <Badge className="absolute -top-2 left-3 bg-primary text-[10px]">
                  Next Up
                </Badge>
              )}

              <div className="flex items-start gap-3">
                {/* Thumbnail or Media Type Icon */}
                <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                  {post.thumbnail ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <MediaIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MediaIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground line-clamp-2 mb-2">
                    {post.content}
                  </p>

                  {/* Platforms */}
                  <div className="flex items-center gap-1 mb-2">
                    {post.platforms.map((platform) => {
                      const Icon = platformIcons[platform]
                      return (
                        <div
                          key={platform}
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center",
                            platformColors[platform]
                          )}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                      )
                    })}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {format(post.scheduledFor, "MMM d")} at{" "}
                      {format(post.scheduledFor, "h:mm a")}
                    </span>
                    <span className="text-primary font-medium">
                      ({formatDistanceToNow(post.scheduledFor, { addSuffix: true })})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}

        {upcomingPosts.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-1">No upcoming posts</p>
            <p className="text-xs text-muted-foreground">
              Schedule your first post to get started
            </p>
          </div>
        )}
      </div>

      {/* Quick Schedule Button */}
      <Link href="/create-post">
        <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl gap-2">
          <Calendar className="w-4 h-4" />
          Schedule New Post
        </Button>
      </Link>
    </Card>
  )
}
