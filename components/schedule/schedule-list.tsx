"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Copy,
  Trash2,
  Send,
  Calendar,
  Eye,
  ArrowUpDown,
  Search,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, PostStatus, ScheduledPost } from "@/app/schedule/page"

interface ScheduleListProps {
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
    status: "scheduled",
    image: "/product-launch-social-media-post.png",
  },
  {
    id: "2",
    content: "5 tips to boost your productivity this week. Thread incoming! 🧵",
    platform: "twitter",
    scheduledDate: new Date(2024, 11, 18),
    scheduledTime: "2:00 PM",
    status: "scheduled",
  },
  {
    id: "3",
    content: "Join us for our upcoming webinar on digital marketing trends for 2025. Register now!",
    platform: "linkedin",
    scheduledDate: new Date(2024, 11, 19),
    scheduledTime: "10:00 AM",
    status: "draft",
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
    status: "scheduled",
  },
  {
    id: "7",
    content: "Weekend vibes! How are you spending your Saturday? Drop a comment below 👇",
    platform: "threads",
    scheduledDate: new Date(2024, 11, 23),
    scheduledTime: "10:00 AM",
    status: "scheduled",
  },
  {
    id: "8",
    content: "Check out our latest video! Full tutorial on our YouTube channel.",
    platform: "tiktok",
    scheduledDate: new Date(2024, 11, 24),
    scheduledTime: "6:00 PM",
    status: "draft",
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

const statusStyles: Record<PostStatus, string> = {
  scheduled: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  published: "bg-green-500/10 text-green-600 border-green-500/20",
  draft: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function ScheduleList({
  currentDate,
  selectedPlatforms,
  selectedStatuses,
}: ScheduleListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "platform" | "status">("date")

  const filteredPosts = useMemo(() => {
    let posts = mockPosts.filter((post) => {
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(post.platform)) {
        return false
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(post.status)) {
        return false
      }
      if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })

    // Sort posts
    posts.sort((a, b) => {
      if (sortBy === "date") {
        return a.scheduledDate.getTime() - b.scheduledDate.getTime()
      }
      if (sortBy === "platform") {
        return a.platform.localeCompare(b.platform)
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status)
      }
      return 0
    })

    return posts
  }, [selectedPlatforms, selectedStatuses, searchQuery, sortBy])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id))
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
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
    <div className="space-y-5">
      {/* Search and Actions Bar */}
      <Card className="bg-card border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/60 border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent rounded-lg">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("platform")}>
                  <Instagram className="w-4 h-4 mr-2" />
                  Platform
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>
                  <Clock className="w-4 h-4 mr-2" />
                  Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs bg-transparent">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Posts List */}
      {Object.entries(groupedPosts).map(([dateKey, posts]) => (
        <div key={dateKey}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              {formatDate(new Date(dateKey))}
            </h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <Card className="bg-card border-border shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-[40px_1fr_140px_140px_100px_80px] gap-4 items-center py-3 px-4 bg-muted/40 border-b border-border">
              <Checkbox
                checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                onCheckedChange={toggleSelectAll}
                className="rounded"
              />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Content
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Platform
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Scheduled
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide text-right">
                Actions
              </span>
            </div>

            {/* Posts */}
            <div className="divide-y divide-border">
              {posts.map((post) => {
                const Icon = platformIcons[post.platform]
                const isSelected = selectedIds.includes(post.id)

                return (
                  <div
                    key={post.id}
                    className={cn(
                      "group flex flex-col lg:grid lg:grid-cols-[40px_1fr_140px_140px_100px_80px] gap-3 lg:gap-4 items-start lg:items-center p-4 transition-colors hover:bg-muted/30",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    {/* Checkbox */}
                    <div className="hidden lg:block">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(post.id)}
                        className="rounded"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-3 w-full lg:w-auto">
                      <div className="lg:hidden">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(post.id)}
                          className="rounded mt-1"
                        />
                      </div>
                      {post.image && (
                        <Avatar className="w-12 h-12 rounded-lg border border-border shrink-0">
                          <AvatarImage src={post.image} className="object-cover" />
                          <AvatarFallback className="rounded-lg bg-muted">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <p className="text-sm text-foreground line-clamp-2 flex-1">
                        {post.content}
                      </p>
                    </div>

                    {/* Platform */}
                    <div className="flex items-center gap-2 ml-7 lg:ml-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                          platformColors[post.platform]
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground capitalize lg:hidden">
                        {post.platform}
                      </span>
                    </div>

                    {/* Scheduled */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-7 lg:ml-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.scheduledTime}</span>
                    </div>

                    {/* Status */}
                    <div className="ml-7 lg:ml-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold capitalize rounded-md px-2.5 py-0.5",
                          statusStyles[post.status]
                        )}
                      >
                        {post.status}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0 lg:justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Publish Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      ))}

      {filteredPosts.length === 0 && (
        <Card className="bg-card border-border shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start scheduling your content to see it here"}
            </p>
            <Button className="gap-2 rounded-xl shadow-sm">
              <Calendar className="w-4 h-4" />
              Schedule a Post
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
