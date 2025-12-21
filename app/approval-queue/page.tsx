"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Check,
  X,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronRight,
  ArrowUpRight,
  Users,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Zap,
  LayoutGrid,
  List,
  RefreshCw,
  Bell,
  Settings,
  Crown,
  History,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

interface ApprovalPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  platforms: string[]
  status: "pending" | "approved" | "rejected" | "changes_requested" | "draft"
  priority: "high" | "medium" | "low"
  type: "post" | "story" | "reel" | "carousel"
  createdAt: Date
  scheduledFor?: Date
  media?: { type: "image" | "video"; url: string; thumbnail?: string }[]
  comments: {
    id: string
    author: string
    avatar?: string
    content: string
    createdAt: Date
  }[]
  reviewHistory: {
    action: string
    by: string
    at: Date
    note?: string
  }[]
  campaign?: string
  tags?: string[]
}

const mockPosts: ApprovalPost[] = [
  {
    id: "1",
    title: "Product Launch Announcement",
    content: "🚀 Exciting news! We're thrilled to announce the launch of our new AI-powered analytics dashboard. Get deeper insights into your social media performance with just one click!\n\n#ProductLaunch #AI #Analytics #SocialMedia",
    author: {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@socialflow.io",
      avatar: "/woman-portrait.png",
      role: "Content Manager",
    },
    platforms: ["twitter", "linkedin", "facebook"],
    status: "pending",
    priority: "high",
    type: "post",
    createdAt: new Date(Date.now() - 3600000),
    scheduledFor: new Date(Date.now() + 86400000 * 2),
    media: [{ type: "image", url: "/product-launch.png" }],
    comments: [
      {
        id: "c1",
        author: "Mike Chen",
        content: "Looks great! Should we add a link to the demo?",
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    reviewHistory: [],
    campaign: "Q4 Product Launch",
    tags: ["product", "announcement", "ai"],
  },
  {
    id: "2",
    title: "Customer Success Story",
    content: "💼 See how @TechStartup increased their engagement by 300% using SocialFlow!\n\n\"SocialFlow transformed how we approach social media. The AI suggestions alone saved us 10 hours per week.\" - Jane Doe, Marketing Director\n\n#CustomerSuccess #CaseStudy",
    author: {
      id: "3",
      name: "Mike Chen",
      email: "mike@socialflow.io",
      role: "Social Media Specialist",
    },
    platforms: ["linkedin", "twitter"],
    status: "changes_requested",
    priority: "medium",
    type: "carousel",
    createdAt: new Date(Date.now() - 86400000),
    scheduledFor: new Date(Date.now() + 86400000 * 3),
    media: [
      { type: "image", url: "/case-study-1.png" },
      { type: "image", url: "/case-study-2.png" },
      { type: "image", url: "/case-study-3.png" },
    ],
    comments: [
      {
        id: "c2",
        author: "Ali Smith",
        avatar: "/professional-man-portrait.png",
        content: "Can we get a quote approval from the customer first?",
        createdAt: new Date(Date.now() - 43200000),
      },
      {
        id: "c3",
        author: "Mike Chen",
        content: "Good point! I'll reach out to them today.",
        createdAt: new Date(Date.now() - 36000000),
      },
    ],
    reviewHistory: [
      {
        action: "Changes Requested",
        by: "Ali Smith",
        at: new Date(Date.now() - 43200000),
        note: "Need customer approval for the quote",
      },
    ],
    campaign: "Customer Stories",
    tags: ["testimonial", "case-study"],
  },
  {
    id: "3",
    title: "Weekly Tips: Content Calendar",
    content: "📅 Pro Tip: Plan your content at least 2 weeks in advance!\n\nHere's why a content calendar is your secret weapon:\n✅ Consistent posting\n✅ Better content quality\n✅ Less stress\n✅ Strategic alignment\n\nWhat's your planning process? 👇",
    author: {
      id: "4",
      name: "Emily Davis",
      email: "emily@socialflow.io",
      role: "Content Creator",
    },
    platforms: ["instagram", "twitter", "linkedin"],
    status: "approved",
    priority: "low",
    type: "post",
    createdAt: new Date(Date.now() - 172800000),
    scheduledFor: new Date(Date.now() + 86400000),
    comments: [],
    reviewHistory: [
      {
        action: "Approved",
        by: "Sarah Johnson",
        at: new Date(Date.now() - 86400000),
      },
    ],
    campaign: "Educational Content",
    tags: ["tips", "educational"],
  },
  {
    id: "4",
    title: "Behind the Scenes: Team Retreat",
    content: "🎉 Our team just wrapped up an amazing retreat! From brainstorming sessions to team building, here's a glimpse into the SocialFlow culture.\n\nWe believe great products come from great teams! 💪\n\n#TeamCulture #BehindTheScenes #StartupLife",
    author: {
      id: "4",
      name: "Emily Davis",
      email: "emily@socialflow.io",
      role: "Content Creator",
    },
    platforms: ["instagram", "tiktok"],
    status: "pending",
    priority: "low",
    type: "reel",
    createdAt: new Date(Date.now() - 7200000),
    media: [{ type: "video", url: "/team-video.mp4", thumbnail: "/team-thumb.png" }],
    comments: [],
    reviewHistory: [],
    tags: ["culture", "team"],
  },
  {
    id: "5",
    title: "Flash Sale Promotion",
    content: "⚡ 48-HOUR FLASH SALE ⚡\n\nGet 40% off all Pro plans!\n\nUse code: FLASH40\n\n🔥 Limited time only!\n🔥 Unlock all premium features\n🔥 Priority support included\n\nLink in bio! 👆",
    author: {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@socialflow.io",
      avatar: "/woman-portrait.png",
      role: "Content Manager",
    },
    platforms: ["instagram", "twitter", "facebook"],
    status: "rejected",
    priority: "high",
    type: "story",
    createdAt: new Date(Date.now() - 259200000),
    comments: [],
    reviewHistory: [
      {
        action: "Rejected",
        by: "Ali Smith",
        at: new Date(Date.now() - 172800000),
        note: "We can't run a flash sale during the product launch week. Let's reschedule.",
      },
    ],
    campaign: "Promotions",
    tags: ["sale", "promotion"],
  },
]

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-500", textColor: "text-amber-600", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500", textColor: "text-green-600", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500", textColor: "text-red-600", icon: XCircle },
  changes_requested: { label: "Changes Requested", color: "bg-orange-500", textColor: "text-orange-600", icon: AlertCircle },
  draft: { label: "Draft", color: "bg-gray-500", textColor: "text-gray-600", icon: FileText },
}

const priorityConfig = {
  high: { label: "High", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  medium: { label: "Medium", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  low: { label: "Low", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "twitter": return "𝕏"
    case "instagram": return "📸"
    case "facebook": return "f"
    case "linkedin": return "in"
    case "tiktok": return "♪"
    default: return "•"
  }
}

export default function ApprovalQueuePage() {
  usePageHeader({
    title: "Approval Queue",
    subtitle: "Review pending content",
    icon: CheckCircle,
  });

  const [posts, setPosts] = useState(mockPosts)
  const [selectedPost, setSelectedPost] = useState<ApprovalPost | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [showChangesDialog, setShowChangesDialog] = useState(false)
  const [changesNote, setChangesNote] = useState("")

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesPriority = priorityFilter === "all" || post.priority === priorityFilter
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const pendingCount = posts.filter((p) => p.status === "pending").length
  const changesCount = posts.filter((p) => p.status === "changes_requested").length

  const handleApprove = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: "approved" as const,
              reviewHistory: [
                ...p.reviewHistory,
                { action: "Approved", by: "Ali Smith", at: new Date() },
              ],
            }
          : p
      )
    )
    setSelectedPost(null)
  }

  const handleReject = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: "rejected" as const,
              reviewHistory: [
                ...p.reviewHistory,
                { action: "Rejected", by: "Ali Smith", at: new Date(), note: rejectNote },
              ],
            }
          : p
      )
    )
    setShowRejectDialog(false)
    setRejectNote("")
    setSelectedPost(null)
  }

  const handleRequestChanges = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: "changes_requested" as const,
              reviewHistory: [
                ...p.reviewHistory,
                { action: "Changes Requested", by: "Ali Smith", at: new Date(), note: changesNote },
              ],
            }
          : p
      )
    )
    setShowChangesDialog(false)
    setChangesNote("")
    setSelectedPost(null)
  }

  const handleBulkApprove = () => {
    setPosts((prev) =>
      prev.map((p) =>
        selectedPosts.includes(p.id)
          ? {
              ...p,
              status: "approved" as const,
              reviewHistory: [
                ...p.reviewHistory,
                { action: "Approved", by: "Ali Smith", at: new Date() },
              ],
            }
          : p
      )
    )
    setSelectedPosts([])
  }

  const toggleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map((p) => p.id))
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, authors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="changes_requested">Changes Requested</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selectedPosts.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-muted-foreground">
                  {selectedPosts.length} selected
                </span>
                <Button size="sm" className="gap-2 bg-green-500 hover:bg-green-600" onClick={handleBulkApprove}>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve All
                </Button>
              </div>
            )}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Post List */}
          <div className={cn(
            "border-r border-border flex flex-col",
            selectedPost ? "w-[450px]" : "flex-1"
          )}>
            {/* Select All */}
            <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-3">
              <Checkbox
                checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <ScrollArea className="flex-1">
              {viewMode === "list" ? (
                <div className="divide-y divide-border">
                  {filteredPosts.map((post) => {
                    const status = statusConfig[post.status]
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          selectedPost?.id === post.id && "bg-muted/50"
                        )}
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={() => toggleSelectPost(post.id)}
                          />
                          <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>
                              {post.author.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">{post.title}</span>
                              <Badge variant="outline" className={cn("shrink-0 text-[10px]", priorityConfig[post.priority].color)}>
                                {post.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {post.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  {post.platforms.map((p) => (
                                    <span
                                      key={p}
                                      className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background"
                                    >
                                      {getPlatformIcon(p)}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {post.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                </span>
                              </div>
                              <Badge className={cn("text-[10px] gap-1 text-white", status.color)}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 gap-4">
                  {filteredPosts.map((post) => {
                    const status = statusConfig[post.status]
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          "p-4 rounded-xl border hover:border-primary/30 transition-all cursor-pointer",
                          selectedPost?.id === post.id && "border-primary/50 bg-primary/5"
                        )}
                        onClick={() => setSelectedPost(post)}
                      >
                        {post.media && post.media.length > 0 && (
                          <div className="aspect-video rounded-lg bg-muted mb-3 flex items-center justify-center overflow-hidden">
                            {post.media[0].type === "image" ? (
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            ) : (
                              <Video className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-[10px] gap-1 text-white", status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[10px]", priorityConfig[post.priority].color)}>
                            {post.priority}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{post.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {post.author.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{post.author.name}</span>
                          </div>
                          <div className="flex -space-x-1">
                            {post.platforms.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background"
                              >
                                {getPlatformIcon(p)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Post Detail */}
          {selectedPost && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Detail Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-background">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="font-semibold">{selectedPost.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{selectedPost.author.name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(selectedPost.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                {selectedPost.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="gap-2 bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(selectedPost.id)}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                      onClick={() => setShowChangesDialog(true)}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Request Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className={cn("gap-1 text-white", statusConfig[selectedPost.status].color)}>
                      {(() => {
                        const StatusIcon = statusConfig[selectedPost.status].icon
                        return <StatusIcon className="w-3 h-3" />
                      })()}
                      {statusConfig[selectedPost.status].label}
                    </Badge>
                    <Badge variant="outline" className={priorityConfig[selectedPost.priority].color}>
                      {selectedPost.priority} priority
                    </Badge>
                    <Badge variant="outline" className="capitalize">{selectedPost.type}</Badge>
                    {selectedPost.campaign && (
                      <Badge variant="secondary">{selectedPost.campaign}</Badge>
                    )}
                  </div>

                  {/* Content Preview */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Content</h3>
                    <div className="p-4 rounded-xl bg-muted/50 border">
                      <p className="text-sm whitespace-pre-wrap">{selectedPost.content}</p>
                    </div>
                  </div>

                  {/* Media */}
                  {selectedPost.media && selectedPost.media.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Media ({selectedPost.media.length})</h3>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedPost.media.map((media, index) => (
                          <div
                            key={index}
                            className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center shrink-0"
                          >
                            {media.type === "image" ? (
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            ) : (
                              <Video className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platforms & Schedule */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Target Platforms</h3>
                      <div className="flex gap-2">
                        {selectedPost.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="capitalize">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedPost.scheduledFor && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">Scheduled For</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {format(selectedPost.scheduledFor, "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review History */}
                  {selectedPost.reviewHistory.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Review History
                      </h3>
                      <div className="space-y-3">
                        {selectedPost.reviewHistory.map((review, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              review.action === "Approved" && "bg-green-500/10 text-green-500",
                              review.action === "Rejected" && "bg-red-500/10 text-red-500",
                              review.action === "Changes Requested" && "bg-orange-500/10 text-orange-500"
                            )}>
                              {review.action === "Approved" && <CheckCircle2 className="w-4 h-4" />}
                              {review.action === "Rejected" && <XCircle className="w-4 h-4" />}
                              {review.action === "Changes Requested" && <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{review.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {review.by} • {format(review.at, "MMM d, h:mm a")}
                              </p>
                              {review.note && (
                                <p className="text-sm text-muted-foreground mt-1">{review.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comments ({selectedPost.comments.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback className="text-xs">
                              {comment.author.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-3 pt-3 border-t">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src="/professional-man-portrait.png" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input placeholder="Add a comment..." className="flex-1" />
                          <Button size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this post. The author will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedPost && handleReject(selectedPost.id)}
              disabled={!rejectNote.trim()}
            >
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Describe what changes are needed before this post can be approved.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Describe required changes..."
            value={changesNote}
            onChange={(e) => setChangesNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangesDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedPost && handleRequestChanges(selectedPost.id)}
              disabled={!changesNote.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Request Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
