"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Calendar,
  Clock,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  ArrowUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday, isTomorrow, isThisWeek, addDays } from "date-fns"
import type { Platform, BulkPost } from "@/app/bulk-schedule/page"

interface BulkQueueProps {
  posts: BulkPost[]
  onUpdatePost: (id: string, updates: Partial<BulkPost>) => void
  onDeletePost: (id: string) => void
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  threads: AtSign,
  tiktok: Zap,
}

const platformColors: Record<Platform, string> = {
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  facebook: "bg-[#1877F2]",
  twitter: "bg-black",
  linkedin: "bg-[#0A66C2]",
  threads: "bg-black",
  tiktok: "bg-black",
}

export function BulkQueue({ posts, onUpdatePost, onDeletePost }: BulkQueueProps) {
  const groupedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      if (!a.scheduledDate || !b.scheduledDate) return 0
      return a.scheduledDate.getTime() - b.scheduledDate.getTime()
    })

    const groups: Record<string, BulkPost[]> = {}

    sorted.forEach((post) => {
      if (!post.scheduledDate) return

      let groupKey: string
      if (isToday(post.scheduledDate)) {
        groupKey = "Today"
      } else if (isTomorrow(post.scheduledDate)) {
        groupKey = "Tomorrow"
      } else if (isThisWeek(post.scheduledDate)) {
        groupKey = format(post.scheduledDate, "EEEE")
      } else {
        groupKey = format(post.scheduledDate, "MMMM d, yyyy")
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(post)
    })

    return groups
  }, [posts])

  const timelineHours = useMemo(() => {
    const hours: { hour: number; posts: BulkPost[] }[] = []
    for (let i = 6; i <= 23; i++) {
      const hourPosts = posts.filter((p) => {
        if (!p.scheduledTime) return false
        const postHour = parseInt(p.scheduledTime.split(":")[0])
        return postHour === i
      })
      hours.push({ hour: i, posts: hourPosts })
    }
    return hours
  }, [posts])

  if (posts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="p-12 bg-card border-border shadow-sm max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Queue is empty</h3>
            <p className="text-sm text-muted-foreground">
              Posts that are ready to schedule will appear here. Go to the Editor tab to create or prepare posts.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Main Queue List */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-card border-border shadow-sm">
              <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              <p className="text-xs text-muted-foreground">In Queue</p>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <p className="text-2xl font-bold text-green-600">
                {posts.filter((p) => p.status === "ready").length}
              </p>
              <p className="text-xs text-muted-foreground">Ready</p>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <p className="text-2xl font-bold text-primary">
                {posts.filter((p) => p.status === "scheduled").length}
              </p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <p className="text-2xl font-bold text-muted-foreground">
                {new Set(posts.flatMap((p) => p.platforms)).size}
              </p>
              <p className="text-xs text-muted-foreground">Platforms</p>
            </Card>
          </div>

          {/* Grouped Posts */}
          <div className="space-y-6">
            {Object.entries(groupedPosts).map(([dateKey, datePosts]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{dateKey}</h3>
                    <p className="text-xs text-muted-foreground">
                      {datePosts.length} post{datePosts.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Posts for this date */}
                <div className="space-y-3 ml-5 pl-8 border-l-2 border-border">
                  {datePosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Time */}
                          <div className="shrink-0 text-center">
                            <div className="w-14 h-14 rounded-xl bg-muted/60 flex flex-col items-center justify-center">
                              <Clock className="w-4 h-4 text-muted-foreground mb-0.5" />
                              <span className="text-sm font-semibold text-foreground">
                                {post.scheduledTime || "--:--"}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Platforms */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {post.platforms.map((platform) => {
                                const Icon = platformIcons[platform]
                                return (
                                  <div
                                    key={platform}
                                    className={cn(
                                      "w-6 h-6 rounded-md flex items-center justify-center",
                                      platformColors[platform]
                                    )}
                                  >
                                    <Icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                )
                              })}
                              <Badge
                                variant="outline"
                                className={cn(
                                  "ml-1 text-[10px] font-semibold",
                                  post.status === "scheduled"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-green-500/10 text-green-600 border-green-500/20"
                                )}
                              >
                                {post.status === "scheduled" ? "Scheduled" : "Ready"}
                              </Badge>
                            </div>

                            {/* Post Content */}
                            <p className="text-sm text-foreground line-clamp-2 mb-2">
                              {post.content || "No content"}
                            </p>

                            {/* Hashtags */}
                            {post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.hashtags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-xs text-primary">
                                    #{tag}
                                  </span>
                                ))}
                                {post.hashtags.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{post.hashtags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Media Preview */}
                          {post.media.length > 0 && (
                            <Avatar className="w-14 h-14 rounded-xl border border-border shrink-0">
                              <AvatarImage src={post.media[0].url} className="object-cover" />
                              <AvatarFallback className="rounded-xl bg-muted">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          {/* Actions */}
                          <div className="shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => onDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Sidebar */}
      <aside className="hidden xl:flex flex-col w-[280px] border-l border-border bg-card shrink-0">
        <div className="flex items-center gap-2 h-12 px-4 border-b border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Timeline View</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            {timelineHours.map(({ hour, posts: hourPosts }) => {
              const timeString = `${hour.toString().padStart(2, "0")}:00`
              const hasItems = hourPosts.length > 0

              return (
                <div key={hour} className="flex gap-3 mb-1">
                  <span
                    className={cn(
                      "text-xs font-mono w-12 shrink-0 py-2",
                      hasItems ? "text-foreground font-medium" : "text-muted-foreground/50"
                    )}
                  >
                    {timeString}
                  </span>
                  <div className="flex-1 border-l border-border pl-3 py-1 min-h-[32px]">
                    {hourPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-2 p-1.5 rounded-md bg-primary/10 mb-1"
                      >
                        <div className="flex -space-x-1">
                          {post.platforms.slice(0, 2).map((platform) => {
                            const Icon = platformIcons[platform]
                            return (
                              <div
                                key={platform}
                                className={cn(
                                  "w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-background",
                                  platformColors[platform]
                                )}
                              >
                                <Icon className="w-2.5 h-2.5 text-white" />
                              </div>
                            )
                          })}
                        </div>
                        <span className="text-[10px] text-foreground truncate flex-1">
                          {post.content.substring(0, 20)}...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </aside>
    </div>
  )
}
