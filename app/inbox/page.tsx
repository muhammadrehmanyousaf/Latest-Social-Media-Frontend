"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Inbox,
  MessageCircle,
  Heart,
  AtSign,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Star,
  StarOff,
  Archive,
  Trash2,
  CheckCheck,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Bot,
  Zap,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import Link from "next/link"

type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "threads"
type MessageType = "dm" | "comment" | "mention" | "review"
type MessageStatus = "unread" | "read" | "replied" | "archived"

interface Message {
  id: string
  platform: Platform
  type: MessageType
  user: {
    name: string
    username: string
    avatar: string
    followers?: number
    isVerified?: boolean
  }
  content: string
  timestamp: Date
  status: MessageStatus
  isStarred: boolean
  postId?: string
  postPreview?: string
  sentiment?: "positive" | "negative" | "neutral"
  thread?: Message[]
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Zap,
  threads: AtSign,
}

const platformColors: Record<Platform, string> = {
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  twitter: "bg-foreground",
  linkedin: "bg-blue-700",
  tiktok: "bg-foreground",
  threads: "bg-foreground",
}

const mockMessages: Message[] = [
  {
    id: "1",
    platform: "instagram",
    type: "dm",
    user: { name: "Sarah Johnson", username: "sarahj_design", avatar: "/avatars/sarah.jpg", followers: 15400, isVerified: false },
    content: "Hey! I absolutely love your content. Would you be interested in a collaboration for my upcoming project?",
    timestamp: new Date(Date.now() - 300000),
    status: "unread",
    isStarred: true,
    sentiment: "positive",
  },
  {
    id: "2",
    platform: "twitter",
    type: "mention",
    user: { name: "Tech Daily", username: "techdaily", avatar: "/avatars/tech.jpg", followers: 89000, isVerified: true },
    content: "@socialflow just launched their new AI features! This is a game changer for social media managers. Highly recommend checking it out!",
    timestamp: new Date(Date.now() - 1800000),
    status: "unread",
    isStarred: false,
    sentiment: "positive",
  },
  {
    id: "3",
    platform: "instagram",
    type: "comment",
    user: { name: "Mike Chen", username: "mikechen", avatar: "/avatars/mike.jpg", followers: 2300 },
    content: "This is exactly what I needed! How do I get started with the premium features?",
    timestamp: new Date(Date.now() - 3600000),
    status: "read",
    isStarred: false,
    postId: "post_123",
    postPreview: "10 Tips for Social Media Success",
    sentiment: "positive",
  },
  {
    id: "4",
    platform: "facebook",
    type: "dm",
    user: { name: "Emily Davis", username: "emily.davis", avatar: "/avatars/emily.jpg", followers: 890 },
    content: "Hi there! I'm having trouble connecting my Instagram account. Can you help?",
    timestamp: new Date(Date.now() - 7200000),
    status: "read",
    isStarred: false,
    sentiment: "neutral",
  },
  {
    id: "5",
    platform: "linkedin",
    type: "dm",
    user: { name: "David Wilson", username: "david-wilson-ceo", avatar: "/avatars/david.jpg", followers: 45000, isVerified: true },
    content: "We're interested in using SocialFlow for our enterprise team. Could we schedule a demo call this week?",
    timestamp: new Date(Date.now() - 10800000),
    status: "replied",
    isStarred: true,
    sentiment: "positive",
  },
  {
    id: "6",
    platform: "twitter",
    type: "comment",
    user: { name: "Alex Thompson", username: "alexthompson", avatar: "/avatars/alex.jpg", followers: 1200 },
    content: "The scheduling feature is broken again. Third time this week. Please fix this ASAP.",
    timestamp: new Date(Date.now() - 14400000),
    status: "unread",
    isStarred: false,
    postId: "post_456",
    postPreview: "New Feature Announcement",
    sentiment: "negative",
  },
]

const filterTabs = [
  { id: "all", label: "All", icon: MessageCircle, count: 24 },
  { id: "unread", label: "Unread", icon: MessageCircle, count: 12 },
  { id: "dm", label: "Messages", icon: Send, count: 8 },
  { id: "comment", label: "Comments", icon: MessageCircle, count: 10 },
  { id: "mention", label: "Mentions", icon: AtSign, count: 6 },
  { id: "starred", label: "Starred", icon: Star, count: 3 },
]

export default function InboxPage() {
  usePageHeader({
    title: "Inbox",
    subtitle: "All messages in one place",
    icon: Inbox,
  })

  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all")
  const [replyText, setReplyText] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === "starred") return msg.isStarred
    if (activeFilter === "unread") return msg.status === "unread"
    if (activeFilter !== "all" && msg.type !== activeFilter) return false
    if (platformFilter !== "all" && msg.platform !== platformFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        msg.content.toLowerCase().includes(query) ||
        msg.user.name.toLowerCase().includes(query) ||
        msg.user.username.toLowerCase().includes(query)
      )
    }
    return true
  })

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    )
  }

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" as MessageStatus } : m))
    )
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500"
      case "negative":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden">
          {/* Messages List */}
          <div className="w-[400px] border-r border-border flex flex-col shrink-0">
            {/* Search & Filters */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as Platform | "all")}>
                  <SelectTrigger className="w-[140px] rounded-xl">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                    activeFilter === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span className={cn(
                    "min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px]",
                    activeFilter === tab.id ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.map((message) => {
                const PlatformIcon = platformIcons[message.platform]
                return (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (message.status === "unread") markAsRead(message.id)
                    }}
                    className={cn(
                      "p-4 border-b border-border cursor-pointer transition-colors",
                      selectedMessage?.id === message.id
                        ? "bg-muted"
                        : "hover:bg-muted/50",
                      message.status === "unread" && "bg-primary/5"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={message.user.avatar} />
                          <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                          platformColors[message.platform]
                        )}>
                          <PlatformIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-sm truncate">{message.user.name}</span>
                            {message.user.isVerified && (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                            {message.status === "unread" && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(message.id)
                              }}
                              className="p-1 hover:bg-background rounded"
                            >
                              {message.isStarred ? (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              ) : (
                                <StarOff className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">@{message.user.username}</p>
                        <p className="text-sm text-foreground line-clamp-2 mb-2">{message.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {message.type}
                            </Badge>
                            {message.sentiment && (
                              <span className={cn("text-[10px] font-medium", getSentimentColor(message.sentiment))}>
                                {message.sentiment}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedMessage.user.avatar} />
                      <AvatarFallback>{selectedMessage.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{selectedMessage.user.name}</h3>
                        {selectedMessage.user.isVerified && <CheckCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">@{selectedMessage.user.username}</p>
                      {selectedMessage.user.followers && (
                        <p className="text-xs text-muted-foreground">
                          {selectedMessage.user.followers.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl">
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground">
                        {format(selectedMessage.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/50">
                      <p className="text-foreground leading-relaxed">{selectedMessage.content}</p>
                    </div>

                    {selectedMessage.postPreview && (
                      <div className="mt-4 p-3 rounded-xl border border-border bg-background">
                        <p className="text-xs text-muted-foreground mb-1">In reply to:</p>
                        <p className="text-sm font-medium text-foreground">{selectedMessage.postPreview}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px] rounded-xl resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Link href="/ai-assistant">
                        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-violet-600">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Suggest
                        </Button>
                      </Link>
                    </div>
                    <Button className="rounded-xl gap-2">
                      <Send className="w-4 h-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Select a message</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
  )
}
