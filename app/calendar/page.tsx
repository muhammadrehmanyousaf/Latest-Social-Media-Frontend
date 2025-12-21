"use client"

import { useState, useMemo } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Grid,
  List,
  Clock,
  MoreHorizontal,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Eye,
  Edit,
  Trash2,
  Copy,
  Send,
  GripVertical,
  Check,
  X,
  Image as ImageIcon,
  Video,
  Sparkles,
  TrendingUp,
  Users,
  Settings,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format, addDays, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"

type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok"
type PostStatus = "scheduled" | "published" | "draft" | "pending_approval" | "failed"
type CalendarView = "month" | "week" | "day"

interface ScheduledPost {
  id: string
  content: string
  platform: Platform
  scheduledDate: Date
  scheduledTime: string
  status: PostStatus
  image?: string
  author: string
  approver?: string
}

// Mock posts
const mockPosts: ScheduledPost[] = [
  { id: "1", content: "Exciting news! Our new product launch is just around the corner. 🚀", platform: "instagram", scheduledDate: new Date(), scheduledTime: "9:00 AM", status: "scheduled", image: "/product.jpg", author: "Alex Johnson" },
  { id: "2", content: "5 tips to boost your productivity this week. Thread incoming! 📈", platform: "twitter", scheduledDate: new Date(), scheduledTime: "2:00 PM", status: "pending_approval", author: "Sarah Chen", approver: "Alex Johnson" },
  { id: "3", content: "Join us for our upcoming webinar on digital marketing trends.", platform: "linkedin", scheduledDate: addDays(new Date(), 1), scheduledTime: "10:00 AM", status: "draft", author: "Mike Wilson" },
  { id: "4", content: "Happy Monday! What are your goals for this week? 💪", platform: "facebook", scheduledDate: addDays(new Date(), 2), scheduledTime: "9:00 AM", status: "scheduled", author: "Alex Johnson" },
  { id: "5", content: "Behind the scenes look at our creative process. ✨", platform: "instagram", scheduledDate: addDays(new Date(), 3), scheduledTime: "12:00 PM", status: "scheduled", image: "/bts.jpg", author: "Emma Davis" },
  { id: "6", content: "New blog post: The future of AI in marketing 🤖", platform: "linkedin", scheduledDate: addDays(new Date(), 4), scheduledTime: "3:00 PM", status: "scheduled", author: "Alex Johnson" },
  { id: "7", content: "Weekend vibes! How are you spending your Saturday? 🌴", platform: "threads", scheduledDate: addDays(new Date(), 5), scheduledTime: "10:00 AM", status: "scheduled", author: "Sarah Chen" },
  { id: "8", content: "Check out our latest TikTok challenge! 🎵", platform: "tiktok", scheduledDate: addDays(new Date(), -1), scheduledTime: "4:00 PM", status: "published", author: "Alex Johnson" },
  { id: "9", content: "Thank you for 10K followers! 🎉", platform: "instagram", scheduledDate: addDays(new Date(), -2), scheduledTime: "11:00 AM", status: "published", author: "Alex Johnson" },
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
  threads: "bg-black dark:bg-white dark:text-black",
  tiktok: "bg-black dark:bg-white dark:text-black",
}

const statusColors: Record<PostStatus, string> = {
  scheduled: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  published: "bg-green-500/10 text-green-600 border-green-500/20",
  draft: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pending_approval: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
}

const statusLabels: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  published: "Published",
  draft: "Draft",
  pending_approval: "Pending Approval",
  failed: "Failed",
}

export default function ContentCalendarPage() {
  usePageHeader({
    title: "Calendar",
    icon: CalendarIcon,
    subtitle: "Plan and schedule your content",
  })

  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [posts, setPosts] = useState<ScheduledPost[]>(mockPosts)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<PostStatus[]>([])
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null)

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    // Add padding days from previous month
    const startDay = start.getDay()
    const paddingBefore = Array.from({ length: startDay }, (_, i) => addDays(start, -(startDay - i)))

    // Add padding days for next month to complete the grid
    const totalDays = paddingBefore.length + days.length
    const paddingAfter = Array.from({ length: 42 - totalDays }, (_, i) => addDays(end, i + 1))

    return [...paddingBefore, ...days, ...paddingAfter]
  }, [currentDate])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(post.platform)) return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(post.status)) return false
      return true
    })
  }, [posts, selectedPlatforms, selectedStatuses])

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter((post) => isSameDay(post.scheduledDate, date))
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleDragStart = (post: ScheduledPost) => {
    setDraggedPost(post)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (date: Date) => {
    if (draggedPost) {
      setPosts(posts.map((p) =>
        p.id === draggedPost.id ? { ...p, scheduledDate: date } : p
      ))
      setDraggedPost(null)
    }
  }

  const handlePostClick = (post: ScheduledPost) => {
    setSelectedPost(post)
    setShowPostModal(true)
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Stats
  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    pending: posts.filter((p) => p.status === "pending_approval").length,
  }

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Filters */}
          <aside className="w-64 border-r bg-card p-4 hidden lg:block overflow-y-auto">
            {/* Stats */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold mb-3">Overview</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <p className="text-2xl font-bold text-orange-600">{stats.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-500/10">
                  <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>

            {/* Platform Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Platforms</h3>
              <div className="space-y-2">
                {(Object.keys(platformIcons) as Platform[]).map((platform) => {
                  const Icon = platformIcons[platform]
                  const isSelected = selectedPlatforms.includes(platform)
                  return (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-lg transition-colors",
                        isSelected ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded flex items-center justify-center", platformColors[platform])}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm capitalize flex-1 text-left">{platform}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Status</h3>
              <div className="space-y-2">
                {(Object.keys(statusLabels) as PostStatus[]).map((status) => {
                  const isSelected = selectedStatuses.includes(status)
                  return (
                    <button
                      key={status}
                      onClick={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                        )
                      }
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-lg transition-colors",
                        isSelected ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
                      <span className="flex-1" />
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/bulk-schedule">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Bulk Schedule
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Calendar */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold ml-2">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Select value={view} onValueChange={(v) => setView(v as CalendarView)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-0">
                {/* Week headers */}
                <div className="grid grid-cols-7 border-b">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const dayPosts = getPostsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isTodayDate = isToday(day)

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[120px] border-b border-r p-2 transition-colors",
                          !isCurrentMonth && "bg-muted/30",
                          isTodayDate && "bg-primary/5",
                          "hover:bg-muted/50"
                        )}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(day)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              !isCurrentMonth && "text-muted-foreground",
                              isTodayDate &&
                                "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            )}
                          >
                            {format(day, "d")}
                          </span>
                          {dayPosts.length > 0 && (
                            <Link href="/create-post">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Plus className="w-3 h-3" />
                              </Button>
                            </Link>
                          )}
                        </div>

                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map((post) => {
                            const Icon = platformIcons[post.platform]
                            return (
                              <div
                                key={post.id}
                                draggable
                                onDragStart={() => handleDragStart(post)}
                                onClick={() => handlePostClick(post)}
                                className={cn(
                                  "flex items-center gap-1.5 p-1.5 rounded-lg text-xs cursor-pointer transition-all hover:scale-[1.02]",
                                  statusColors[post.status],
                                  "border"
                                )}
                              >
                                <GripVertical className="w-3 h-3 opacity-50 cursor-grab" />
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded flex items-center justify-center shrink-0",
                                    platformColors[post.platform]
                                  )}
                                >
                                  <Icon className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="font-medium truncate hidden lg:block">
                                  {post.scheduledTime}
                                </span>
                              </div>
                            )
                          })}
                          {dayPosts.length > 3 && (
                            <p className="text-xs text-muted-foreground font-medium pl-1">
                              +{dayPosts.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Best Time to Post */}
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Best Time to Post</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your audience, the best times to post this week are{" "}
                      <strong>9:00 AM</strong> and <strong>6:00 PM</strong>
                    </p>
                  </div>
                  <Link href="/analytics">
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Post Detail Modal */}
        <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Post Details</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      platformColors[selectedPost.platform]
                    )}
                  >
                    {(() => {
                      const Icon = platformIcons[selectedPost.platform]
                      return <Icon className="w-5 h-5 text-white" />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{selectedPost.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedPost.scheduledDate, "MMM d, yyyy")} at {selectedPost.scheduledTime}
                    </p>
                  </div>
                  <Badge className={cn("ml-auto", statusColors[selectedPost.status])}>
                    {statusLabels[selectedPost.status]}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">{selectedPost.content}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Created by {selectedPost.author}</span>
                </div>

                {selectedPost.status === "pending_approval" && selectedPost.approver && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm">
                      Waiting for approval from <strong>{selectedPost.approver}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowPostModal(false)}>
                Close
              </Button>
              <Link href="/create-post">
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  )
}
