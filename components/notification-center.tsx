"use client"

import * as React from "react"
import { useState } from "react"
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Settings,
  Trash2,
  MessageCircle,
  Heart,
  UserPlus,
  Send,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  Bot,
  AtSign,
  Share2,
  Clock,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Filter,
  Sparkles,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

type NotificationType =
  | "post_published"
  | "comment"
  | "mention"
  | "like"
  | "follower"
  | "scheduled"
  | "team"
  | "alert"
  | "ai"
  | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
  avatar?: string
  platform?: string
  metadata?: Record<string, unknown>
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "post_published",
    title: "Post Published Successfully",
    message: "Your Instagram post \"Summer vibes 🌴\" is now live!",
    timestamp: new Date(Date.now() - 300000),
    isRead: false,
    actionUrl: "/analytics",
    actionLabel: "View Analytics",
    platform: "instagram",
  },
  {
    id: "n2",
    type: "comment",
    title: "New Comment",
    message: "@marketing_pro commented on your post: \"Love this content! 🔥\"",
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
    actionUrl: "/inbox",
    actionLabel: "Reply",
    platform: "instagram",
  },
  {
    id: "n3",
    type: "mention",
    title: "You were mentioned",
    message: "@techinfluencer mentioned you in a tweet about social media tools",
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    actionUrl: "/listening",
    actionLabel: "View Mention",
    platform: "twitter",
  },
  {
    id: "n4",
    type: "scheduled",
    title: "Post Scheduled",
    message: "Your LinkedIn post is scheduled for tomorrow at 9:00 AM",
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    actionUrl: "/schedule",
    actionLabel: "View Schedule",
    platform: "linkedin",
  },
  {
    id: "n5",
    type: "team",
    title: "Team Activity",
    message: "Sarah Chen submitted a post for approval",
    timestamp: new Date(Date.now() - 10800000),
    isRead: true,
    actionUrl: "/workspaces",
    actionLabel: "Review",
    avatar: "S",
  },
  {
    id: "n6",
    type: "ai",
    title: "AI Insight",
    message: "Your engagement rate increased by 23% this week. View the AI analysis.",
    timestamp: new Date(Date.now() - 14400000),
    isRead: true,
    actionUrl: "/ai-assistant",
    actionLabel: "View Insights",
  },
  {
    id: "n7",
    type: "alert",
    title: "Competitor Alert",
    message: "Buffer just posted content that's trending in your industry",
    timestamp: new Date(Date.now() - 18000000),
    isRead: true,
    actionUrl: "/competitors",
    actionLabel: "Analyze",
  },
  {
    id: "n8",
    type: "follower",
    title: "Follower Milestone",
    message: "Congratulations! You've reached 10,000 followers on Instagram 🎉",
    timestamp: new Date(Date.now() - 86400000),
    isRead: true,
    actionUrl: "/analytics",
    platform: "instagram",
  },
  {
    id: "n9",
    type: "system",
    title: "New Feature Available",
    message: "Try our new AI-powered hashtag generator for better reach!",
    timestamp: new Date(Date.now() - 172800000),
    isRead: true,
    actionUrl: "/ai-assistant",
    actionLabel: "Try Now",
  },
  {
    id: "n10",
    type: "like",
    title: "Post Performance",
    message: "Your post received 500+ likes in the first hour!",
    timestamp: new Date(Date.now() - 259200000),
    isRead: true,
    actionUrl: "/analytics",
    platform: "instagram",
  },
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "post_published":
      return <Send className="h-4 w-4 text-green-500" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "mention":
      return <AtSign className="h-4 w-4 text-purple-500" />
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "follower":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "scheduled":
      return <Calendar className="h-4 w-4 text-orange-500" />
    case "team":
      return <Users className="h-4 w-4 text-blue-500" />
    case "alert":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case "ai":
      return <Sparkles className="h-4 w-4 text-purple-500" />
    case "system":
      return <Bell className="h-4 w-4 text-gray-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case "post_published":
      return "Published"
    case "comment":
      return "Comment"
    case "mention":
      return "Mention"
    case "like":
      return "Engagement"
    case "follower":
      return "Milestone"
    case "scheduled":
      return "Schedule"
    case "team":
      return "Team"
    case "alert":
      return "Alert"
    case "ai":
      return "AI"
    case "system":
      return "System"
    default:
      return "Notification"
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.isRead
    if (activeTab === "mentions") return n.type === "mention" || n.type === "comment"
    if (activeTab === "team") return n.type === "team"
    return true
  })

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Notification settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid grid-cols-4 w-full h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="mentions" className="text-xs">Mentions</TabsTrigger>
              <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon or Avatar */}
                        <div className="shrink-0">
                          {notification.avatar ? (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                              {notification.avatar}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-medium truncate">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                })}
                              </span>
                              {notification.platform && (
                                <>
                                  <span>·</span>
                                  <span className="capitalize">{notification.platform}</span>
                                </>
                              )}
                            </div>
                            {notification.actionUrl && (
                              <Link href={notification.actionUrl}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(false)
                                  }}
                                >
                                  {notification.actionLabel || "View"}
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t p-3 flex items-center justify-center">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsOpen(false)}>
              <Settings className="h-3 w-3 mr-2" />
              Manage notification preferences
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
