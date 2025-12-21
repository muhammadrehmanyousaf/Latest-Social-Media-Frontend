"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  Zap,
  AtSign,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
} from "date-fns"
import type { ScheduledPost, Platform } from "@/app/page"
import Link from "next/link"

interface CalendarPreviewProps {
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

export function CalendarPreview({ posts }: CalendarPreviewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getPostsForDay = (date: Date) => {
    return posts.filter((post) => isSameDay(post.scheduledFor, date))
  }

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Content Calendar</h3>
            <p className="text-[10px] text-muted-foreground">
              {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg" onClick={prevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg" onClick={nextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-center pb-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              {format(day, "EEE")}
            </p>
            <p
              className={cn(
                "text-sm font-medium w-7 h-7 rounded-full flex items-center justify-center mx-auto",
                isToday(day)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              {format(day, "d")}
            </p>
          </div>
        ))}

        {/* Day Content */}
        {weekDays.map((day) => {
          const dayPosts = getPostsForDay(day)
          const hasMore = dayPosts.length > 2

          return (
            <div
              key={`content-${day.toISOString()}`}
              className={cn(
                "min-h-20 p-1 rounded-lg transition-colors",
                isToday(day) ? "bg-primary/5" : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              {dayPosts.slice(0, 2).map((post, idx) => (
                <div
                  key={post.id}
                  className="mb-1 p-1.5 rounded-md bg-background shadow-sm text-[10px] cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-1">
                    {post.platforms.slice(0, 2).map((platform) => {
                      const Icon = platformIcons[platform]
                      return (
                        <div
                          key={platform}
                          className={cn("w-3.5 h-3.5 rounded flex items-center justify-center", platformColors[platform])}
                        >
                          <Icon className="w-2 h-2 text-white" />
                        </div>
                      )
                    })}
                    {post.platforms.length > 2 && (
                      <span className="text-[8px] text-muted-foreground">
                        +{post.platforms.length - 2}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-muted-foreground">
                    {format(post.scheduledFor, "h:mm a")}
                  </p>
                </div>
              ))}

              {hasMore && (
                <p className="text-[10px] text-center text-muted-foreground">
                  +{dayPosts.length - 2} more
                </p>
              )}

              {dayPosts.length === 0 && (
                <button className="w-full h-full min-h-14 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {posts.filter((p) => p.status === "scheduled").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Scheduled</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-green-500">
              {posts.filter((p) => p.status === "published").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Published</p>
          </div>
        </div>

        <Link href="/schedule">
          <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs">
            Full Calendar
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
