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
  UserPlus,
  AtSign,
  Mail,
  CheckCircle2,
  Trophy,
  Bell,
  ArrowRight,
  Filter,
  Zap,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { ActivityItem, Platform } from "@/app/page"

interface ActivityFeedProps {
  activities: ActivityItem[]
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
  instagram: "text-pink-500",
  facebook: "text-blue-600",
  twitter: "text-foreground",
  linkedin: "text-blue-700",
  tiktok: "text-foreground",
  youtube: "text-red-500",
  threads: "text-foreground",
  pinterest: "text-red-600",
}

const activityConfig = {
  like: { icon: Heart, color: "text-pink-500", bgColor: "bg-pink-500/10", label: "liked your post" },
  comment: { icon: MessageCircle, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "commented" },
  share: { icon: Share2, color: "text-green-500", bgColor: "bg-green-500/10", label: "shared your post" },
  follow: { icon: UserPlus, color: "text-purple-500", bgColor: "bg-purple-500/10", label: "followed you" },
  mention: { icon: AtSign, color: "text-orange-500", bgColor: "bg-orange-500/10", label: "mentioned you" },
  dm: { icon: Mail, color: "text-indigo-500", bgColor: "bg-indigo-500/10", label: "sent a message" },
  post_published: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10", label: "Post published" },
  milestone: { icon: Trophy, color: "text-amber-500", bgColor: "bg-amber-500/10", label: "Milestone reached" },
}

type ActivityType = keyof typeof activityConfig

const activityTypes = [
  { id: "all", label: "All" },
  { id: "engagement", label: "Engagement" },
  { id: "followers", label: "Followers" },
  { id: "mentions", label: "Mentions" },
  { id: "system", label: "System" },
]

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [filter, setFilter] = useState("all")

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    if (filter === "engagement") return ["like", "comment", "share"].includes(activity.type)
    if (filter === "followers") return activity.type === "follow"
    if (filter === "mentions") return activity.type === "mention"
    if (filter === "system") return ["post_published", "milestone"].includes(activity.type)
    return true
  })

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
            <p className="text-[10px] text-muted-foreground">
              Recent activity across all platforms
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all",
                filter === type.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredActivities.map((activity) => {
          const config = activityConfig[activity.type as ActivityType]
          const Icon = config.icon
          const PlatformIcon = platformIcons[activity.platform]

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors group"
            >
              {/* Avatar or Icon */}
              {activity.user ? (
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background",
                    config.bgColor
                  )}>
                    <Icon className={cn("w-2.5 h-2.5", config.color)} />
                  </div>
                </div>
              ) : (
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bgColor)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {activity.user ? (
                  <>
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">{activity.user.name}</span>{" "}
                      <span className="text-muted-foreground">{config.label}</span>
                    </p>
                    {activity.type === "comment" || activity.type === "mention" ? (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                        "{activity.content}"
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-xs text-foreground">{activity.content}</p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <PlatformIcon className={cn("w-3.5 h-3.5", platformColors[activity.platform])} />
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Action */}
              {activity.user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No activity to show</p>
        </div>
      )}

      {/* View All */}
      <Button variant="link" size="sm" className="w-full mt-4 text-xs">
        View All Activity
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </Card>
  )
}
