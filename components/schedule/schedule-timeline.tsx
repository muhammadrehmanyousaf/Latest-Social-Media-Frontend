"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  MoreHorizontal,
  Clock,
  Edit2,
  Eye,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, PostStatus, ScheduledPost } from "@/app/schedule/page"

interface ScheduleTimelineProps {
  currentDate: Date
  selectedPlatforms: Platform[]
  selectedStatuses: PostStatus[]
}

// Mock data
const mockPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Exciting news! Our new product launch is just around the corner. Stay tuned for updates!",
    platform: "instagram",
    scheduledDate: new Date(2024, 11, 18),
    scheduledTime: "9:00 AM",
    status: "published",
    image: "/product-launch-social-media-post.png",
    engagement: { likes: 1234, comments: 89, shares: 45 },
  },
  {
    id: "2",
    content: "5 tips to boost your productivity this week. Thread incoming! 🧵",
    platform: "twitter",
    scheduledDate: new Date(2024, 11, 18),
    scheduledTime: "2:00 PM",
    status: "published",
    engagement: { likes: 567, comments: 23, shares: 78 },
  },
  {
    id: "3",
    content: "Join us for our upcoming webinar on digital marketing trends for 2025. Register now!",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 19),
    scheduledTime: "10:00 AM",
    status: "scheduled",
    image: "/webinar-announcement-professional.jpg",
  },
  {
    id: "4",
    content: "Happy Monday! What are your goals for this week? Let us know in the comments! 🎯",
    platform: "facebook",
    scheduledDate: new Date(2024, 11, 20),
    scheduledTime: "9:00 AM",
    status: "scheduled",
  },
  {
    id: "5",
    content: "Behind the scenes look at our creative process. Swipe to see more! ✨",
    platform: "instagram",
    scheduledDate: new Date(2024, 11, 21),
    scheduledTime: "12:00 PM",
    status: "scheduled",
    image: "/behind-the-scenes-creative-studio.jpg",
  },
  {
    id: "6",
    content: "New blog post: The future of AI in marketing. Link in bio!",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 22),
    scheduledTime: "3:00 PM",
    status: "draft",
  },
  {
    id: "7",
    content: "Weekend vibes! How are you spending your Saturday? Drop a comment below 👇",
    platform: "threads",
    scheduledDate: new Date(2024, 11, 23),
    scheduledTime: "10:00 AM",
    status: "scheduled",
  },
]

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
  twitter: "bg-[#1DA1F2]",
  facebook: "bg-[#1877F2]",
  linkedin: "bg-[#0A66C2]",
  threads: "bg-black",
  tiktok: "bg-black",
}

const platformBorderColors: Record<Platform, string> = {
  instagram: "border-pink-500",
  twitter: "border-[#1DA1F2]",
  facebook: "border-[#1877F2]",
  linkedin: "border-[#0A66C2]",
  threads: "border-black",
  tiktok: "border-black",
}

export function ScheduleTimeline({
  currentDate,
  selectedPlatforms,
  selectedStatuses,
}: ScheduleTimelineProps) {
  const filteredPosts = useMemo(() => {
    return mockPosts
      .filter((post) => {
        if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(post.platform)) {
          return false
        }
        if (selectedStatuses.length > 0 && !selectedStatuses.includes(post.status)) {
          return false
        }
        return true
      })
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
  }, [selectedPlatforms, selectedStatuses])

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const isDatePast = (date: Date, time: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const [hours, minutesPart] = time.split(":")
    const minutes = parseInt(minutesPart)
    const isPM = time.includes("PM")
    let hour = parseInt(hours)
    if (isPM && hour !== 12) hour += 12
    if (!isPM && hour === 12) hour = 0
    postDate.setHours(hour, minutes)
    return postDate < now
  }

  // Group posts by date
  const groupedPosts = useMemo(() => {
    const groups: Record<string, typeof filteredPosts> = {}
    filteredPosts.forEach((post) => {
      const dateKey = post.scheduledDate.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(post)
    })
    return groups
  }, [filteredPosts])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">{filteredPosts.length}</p>
          <p className="text-xs text-muted-foreground">Total Posts</p>
        </Card>
        <Card className="p-4 bg-card border-border shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {filteredPosts.filter((p) => p.status === "published").length}
          </p>
          <p className="text-xs text-muted-foreground">Published</p>
        </Card>
        <Card className="p-4 bg-card border-border shadow-sm">
          <p className="text-2xl font-bold text-orange-600">
            {filteredPosts.filter((p) => p.status === "scheduled").length}
          </p>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </Card>
        <Card className="p-4 bg-card border-border shadow-sm">
          <p className="text-2xl font-bold text-gray-600">
            {filteredPosts.filter((p) => p.status === "draft").length}
          </p>
          <p className="text-xs text-muted-foreground">Drafts</p>
        </Card>
      </div>

      {/* Timeline */}
      <div className="relative">
        {Object.entries(groupedPosts).map(([dateKey, posts], groupIndex) => {
          const date = new Date(dateKey)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div key={dateKey} className="relative pb-8 last:pb-0">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  )}
                >
                  <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                  <span className="text-[10px] font-medium uppercase">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{formatDate(date)}</h3>
                  <p className="text-xs text-muted-foreground">
                    {posts.length} post{posts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Posts */}
              <div className="ml-7 pl-10 border-l-2 border-border space-y-4">
                {posts.map((post, postIndex) => {
                  const Icon = platformIcons[post.platform]
                  const isPast = isDatePast(post.scheduledDate, post.scheduledTime)
                  const isPublished = post.status === "published"

                  return (
                    <div key={post.id} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          "absolute -left-[45px] w-4 h-4 rounded-full border-2 bg-background",
                          isPublished
                            ? "border-green-500"
                            : isPast
                            ? "border-orange-500"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isPublished && (
                          <CheckCircle2 className="w-3 h-3 text-green-500 absolute -top-0.5 -left-0.5" />
                        )}
                      </div>

                      {/* Post Card */}
                      <Card
                        className={cn(
                          "bg-card border-border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
                          "border-l-4",
                          platformBorderColors[post.platform]
                        )}
                      >
                        <div className="p-4">
                          {/* Time and Platform */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm",
                                  platformColors[post.platform]
                                )}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground capitalize">
                                  {post.platform}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{post.scheduledTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold capitalize rounded-md",
                                  post.status === "published"
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : post.status === "scheduled"
                                    ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                    : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                )}
                              >
                                {post.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground line-clamp-2 mb-2">
                                {post.content}
                              </p>

                              {/* Engagement Stats (for published posts) */}
                              {post.engagement && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>{post.engagement.likes.toLocaleString()} likes</span>
                                  <span>{post.engagement.comments} comments</span>
                                  <span>{post.engagement.shares} shares</span>
                                </div>
                              )}
                            </div>

                            {post.image && (
                              <Avatar className="w-16 h-16 rounded-xl border border-border shrink-0">
                                <AvatarImage src={post.image} className="object-cover" />
                                <AvatarFallback className="rounded-xl bg-muted">
                                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs ml-auto">
                              View Details
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredPosts.length === 0 && (
          <Card className="bg-card border-border shadow-sm p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts in timeline</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust your filters or schedule new content
              </p>
              <Button className="gap-2 rounded-xl shadow-sm">
                <Clock className="w-4 h-4" />
                Schedule a Post
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
