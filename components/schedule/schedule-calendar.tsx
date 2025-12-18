"use client"

import { useId, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Plus,
  MoreHorizontal,
  Clock,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CalendarView, Platform, PostStatus, ScheduledPost } from "@/app/schedule/page"

interface ScheduleCalendarProps {
  view: CalendarView
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedPlatforms: Platform[]
  selectedStatuses: PostStatus[]
}

// Mock data for demonstration
const mockPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Exciting news! Our new product launch is just around the corner.",
    platform: "instagram",
    scheduledDate: new Date(2024, 11, 18),
    scheduledTime: "9:00 AM",
    status: "scheduled",
    image: "/product-launch-social-media-post.png",
  },
  {
    id: "2",
    content: "5 tips to boost your productivity this week. Thread incoming!",
    platform: "twitter",
    scheduledDate: new Date(2024, 11, 18),
    scheduledTime: "2:00 PM",
    status: "scheduled",
  },
  {
    id: "3",
    content: "Join us for our upcoming webinar on digital marketing trends.",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 19),
    scheduledTime: "10:00 AM",
    status: "draft",
    image: "/webinar-announcement-professional.jpg",
  },
  {
    id: "4",
    content: "Happy Monday! What are your goals for this week?",
    platform: "facebook",
    scheduledDate: new Date(2024, 11, 20),
    scheduledTime: "9:00 AM",
    status: "scheduled",
  },
  {
    id: "5",
    content: "Behind the scenes look at our creative process.",
    platform: "instagram",
    scheduledDate: new Date(2024, 11, 21),
    scheduledTime: "12:00 PM",
    status: "scheduled",
    image: "/behind-the-scenes-creative-studio.jpg",
  },
  {
    id: "6",
    content: "New blog post: The future of AI in marketing",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 22),
    scheduledTime: "3:00 PM",
    status: "scheduled",
  },
  {
    id: "7",
    content: "Weekend vibes! How are you spending your Saturday?",
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

const statusColors: Record<PostStatus, string> = {
  scheduled: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  published: "bg-green-500/15 text-green-600 border-green-500/30",
  draft: "bg-gray-500/15 text-gray-600 border-gray-500/30",
  failed: "bg-red-500/15 text-red-600 border-red-500/30",
}

export function ScheduleCalendar({
  view,
  currentDate,
  onDateChange,
  selectedPlatforms,
  selectedStatuses,
}: ScheduleCalendarProps) {
  const id = useId()

  const filteredPosts = useMemo(() => {
    return mockPosts.filter((post) => {
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(post.platform)) {
        return false
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(post.status)) {
        return false
      }
      return true
    })
  }, [selectedPlatforms, selectedStatuses])

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter(
      (post) =>
        post.scheduledDate.getDate() === date.getDate() &&
        post.scheduledDate.getMonth() === date.getMonth() &&
        post.scheduledDate.getFullYear() === date.getFullYear()
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty days for the start of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (view === "month") {
    const days = getDaysInMonth(currentDate)

    return (
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const posts = day ? getPostsForDate(day) : []
            const isCurrentDay = day && isToday(day)

            return (
              <div
                key={`${id}-day-${index}`}
                className={cn(
                  "min-h-[120px] lg:min-h-[140px] border-b border-r border-border p-2 transition-colors",
                  day ? "hover:bg-muted/30 cursor-pointer" : "bg-muted/10",
                  index % 7 === 6 && "border-r-0"
                )}
                onClick={() => day && onDateChange(day)}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCurrentDay
                            ? "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            : "text-foreground"
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {posts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {posts.slice(0, 3).map((post) => {
                        const Icon = platformIcons[post.platform]
                        return (
                          <div
                            key={post.id}
                            className={cn(
                              "flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] lg:text-xs transition-all hover:scale-[1.02]",
                              statusColors[post.status]
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 lg:w-5 lg:h-5 rounded flex items-center justify-center shrink-0",
                                platformColors[post.platform]
                              )}
                            >
                              <Icon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                            </div>
                            <span className="truncate font-medium hidden lg:block">{post.scheduledTime}</span>
                            <span className="truncate flex-1 hidden xl:block">{post.content.slice(0, 20)}...</span>
                          </div>
                        )
                      })}
                      {posts.length > 3 && (
                        <div className="text-[10px] text-muted-foreground font-medium pl-1">
                          +{posts.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  if (view === "week") {
    const weekDays = getWeekDays(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/30">
          <div className="p-3" />
          {weekDays.map((day) => {
            const isCurrentDay = isToday(day)
            const posts = getPostsForDate(day)
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 text-center border-l border-border",
                  isCurrentDay && "bg-primary/5"
                )}
              >
                <p className="text-xs text-muted-foreground font-medium">
                  {weekDayNames[day.getDay()]}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-0.5",
                    isCurrentDay
                      ? "w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto"
                      : "text-foreground"
                  )}
                >
                  {day.getDate()}
                </p>
                {posts.length > 0 && (
                  <p className="text-[10px] text-primary font-semibold mt-1">
                    {posts.length} post{posts.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Time grid */}
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {hours.slice(6, 22).map((hour) => (
              <div key={hour} className="contents">
                <div className="p-2 text-xs text-muted-foreground font-medium text-right pr-3 border-b border-border">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                {weekDays.map((day) => {
                  const posts = getPostsForDate(day).filter((post) => {
                    const postHour = parseInt(post.scheduledTime.split(":")[0])
                    const isPM = post.scheduledTime.includes("PM")
                    const postHour24 = isPM && postHour !== 12 ? postHour + 12 : !isPM && postHour === 12 ? 0 : postHour
                    return postHour24 === hour
                  })

                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={cn(
                        "min-h-[50px] border-l border-b border-border p-1 hover:bg-muted/30 transition-colors",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {posts.map((post) => {
                        const Icon = platformIcons[post.platform]
                        return (
                          <div
                            key={post.id}
                            className={cn(
                              "flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] mb-1",
                              statusColors[post.status]
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded flex items-center justify-center shrink-0",
                                platformColors[post.platform]
                              )}
                            >
                              <Icon className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="truncate font-medium">{post.scheduledTime}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  // Day view
  const dayPosts = getPostsForDate(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
      {/* Time slots */}
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {hours.slice(6, 22).map((hour) => {
            const posts = dayPosts.filter((post) => {
              const postHour = parseInt(post.scheduledTime.split(":")[0])
              const isPM = post.scheduledTime.includes("PM")
              const postHour24 = isPM && postHour !== 12 ? postHour + 12 : !isPM && postHour === 12 ? 0 : postHour
              return postHour24 === hour
            })

            return (
              <div key={hour} className="flex border-b border-border last:border-0">
                <div className="w-16 p-3 text-xs text-muted-foreground font-medium text-right shrink-0 border-r border-border">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                <div className="flex-1 min-h-[60px] p-2 hover:bg-muted/30 transition-colors">
                  {posts.map((post) => {
                    const Icon = platformIcons[post.platform]
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-xl mb-2",
                          statusColors[post.status]
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            platformColors[post.platform]
                          )}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-foreground">{post.scheduledTime}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                        </div>
                        {post.image && (
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                            <ImageIcon className="w-6 h-6 m-3 text-muted-foreground" />
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Day summary */}
      <div className="space-y-5">
        <Card className="bg-card border-border shadow-sm p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Today&apos;s Summary</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Posts</span>
              <span className="text-sm font-semibold text-foreground">{dayPosts.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Scheduled</span>
              <span className="text-sm font-semibold text-orange-600">
                {dayPosts.filter((p) => p.status === "scheduled").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Drafts</span>
              <span className="text-sm font-semibold text-gray-600">
                {dayPosts.filter((p) => p.status === "draft").length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border shadow-sm p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Platforms</h4>
          <div className="space-y-2">
            {Object.entries(
              dayPosts.reduce((acc, post) => {
                acc[post.platform] = (acc[post.platform] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([platform, count]) => {
              const Icon = platformIcons[platform as Platform]
              return (
                <div key={platform} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      platformColors[platform as Platform]
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-foreground capitalize flex-1">{platform}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Button className="w-full gap-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" />
          Add Post
        </Button>
      </div>
    </div>
  )
}
