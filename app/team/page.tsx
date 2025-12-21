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
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Check,
  X,
  Clock,
  MessageSquare,
  Activity,
  Eye,
  Edit3,
  Trash2,
  Send,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  Bell,
  Settings,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  AtSign,
  ThumbsUp,
  Reply,
  MoreVertical,
  Sparkles,
  Link2,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

// Types
interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "editor" | "viewer"
  status: "active" | "pending" | "inactive"
  lastActive?: Date
  joinedAt: Date
}

interface ApprovalRequest {
  id: string
  type: "post" | "story" | "reel"
  title: string
  content: string
  author: TeamMember
  platform: string[]
  status: "pending" | "approved" | "rejected" | "changes_requested"
  createdAt: Date
  scheduledFor?: Date
  reviewedBy?: TeamMember
  reviewedAt?: Date
  comments: Comment[]
  media?: { type: "image" | "video"; url: string }[]
}

interface Comment {
  id: string
  author: TeamMember
  content: string
  createdAt: Date
  mentions?: string[]
  reactions?: { emoji: string; users: string[] }[]
  replies?: Comment[]
}

interface ActivityItem {
  id: string
  type: "post_created" | "post_approved" | "post_rejected" | "comment_added" | "member_joined" | "member_role_changed" | "post_published" | "post_scheduled"
  actor: TeamMember
  target?: string
  targetUser?: TeamMember
  description: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Mock data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Ali Smith",
    email: "ali@socialflow.io",
    avatar: "/professional-man-portrait.png",
    role: "owner",
    status: "active",
    lastActive: new Date(),
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@socialflow.io",
    avatar: "/woman-portrait.png",
    role: "admin",
    status: "active",
    lastActive: new Date(Date.now() - 3600000),
    joinedAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@socialflow.io",
    role: "editor",
    status: "active",
    lastActive: new Date(Date.now() - 86400000),
    joinedAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@socialflow.io",
    role: "editor",
    status: "active",
    lastActive: new Date(Date.now() - 172800000),
    joinedAt: new Date("2024-04-05"),
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james@company.com",
    role: "viewer",
    status: "pending",
    joinedAt: new Date(),
  },
]

const approvalRequests: ApprovalRequest[] = [
  {
    id: "1",
    type: "post",
    title: "Product Launch Announcement",
    content: "🚀 Exciting news! We're thrilled to announce the launch of our new AI-powered analytics dashboard. Get deeper insights into your social media performance with just one click! #ProductLaunch #AI #Analytics",
    author: teamMembers[2],
    platform: ["twitter", "linkedin", "facebook"],
    status: "pending",
    createdAt: new Date(Date.now() - 3600000),
    scheduledFor: new Date(Date.now() + 86400000 * 2),
    comments: [
      {
        id: "c1",
        author: teamMembers[1],
        content: "Looks great! Maybe we should add more emojis?",
        createdAt: new Date(Date.now() - 1800000),
        reactions: [{ emoji: "👍", users: ["3"] }],
      },
    ],
    media: [{ type: "image", url: "/product-launch.png" }],
  },
  {
    id: "2",
    type: "reel",
    title: "Behind the Scenes: Team Culture",
    content: "Take a peek behind the scenes at SocialFlow! 🎬 Our team culture is all about creativity, collaboration, and coffee ☕ #TeamCulture #BehindTheScenes",
    author: teamMembers[3],
    platform: ["instagram", "tiktok"],
    status: "changes_requested",
    createdAt: new Date(Date.now() - 86400000),
    reviewedBy: teamMembers[1],
    reviewedAt: new Date(Date.now() - 43200000),
    comments: [
      {
        id: "c2",
        author: teamMembers[1],
        content: "Love the concept! Can we add subtitles for accessibility?",
        createdAt: new Date(Date.now() - 43200000),
      },
      {
        id: "c3",
        author: teamMembers[3],
        content: "Good point! I'll add captions and resubmit.",
        createdAt: new Date(Date.now() - 36000000),
      },
    ],
    media: [{ type: "video", url: "/team-video.mp4" }],
  },
  {
    id: "3",
    type: "post",
    title: "Weekly Tips: Engagement Strategies",
    content: "📊 This week's tip: Consistency is key! Posts published between 9-11 AM see 23% higher engagement. What's your best posting time? Drop it in the comments! 👇",
    author: teamMembers[2],
    platform: ["twitter", "linkedin"],
    status: "approved",
    createdAt: new Date(Date.now() - 172800000),
    scheduledFor: new Date(Date.now() + 86400000),
    reviewedBy: teamMembers[0],
    reviewedAt: new Date(Date.now() - 86400000),
    comments: [],
  },
]

const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    type: "post_created",
    actor: teamMembers[2],
    target: "Product Launch Announcement",
    description: "created a new post",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "a2",
    type: "comment_added",
    actor: teamMembers[1],
    target: "Product Launch Announcement",
    description: "commented on",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "a3",
    type: "post_approved",
    actor: teamMembers[0],
    target: "Weekly Tips: Engagement Strategies",
    description: "approved",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "a4",
    type: "member_joined",
    actor: teamMembers[4],
    description: "was invited to the team",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: "a5",
    type: "post_scheduled",
    actor: teamMembers[3],
    target: "Behind the Scenes: Team Culture",
    description: "scheduled",
    timestamp: new Date(Date.now() - 259200000),
  },
]

const roleConfig = {
  owner: { label: "Owner", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10" },
  admin: { label: "Admin", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  editor: { label: "Editor", icon: Edit3, color: "text-green-500", bg: "bg-green-500/10" },
  viewer: { label: "Viewer", icon: Eye, color: "text-gray-500", bg: "bg-gray-500/10" },
}

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-500", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
  changes_requested: { label: "Changes Requested", color: "bg-orange-500", icon: AlertCircle },
}

export default function TeamPage() {
  usePageHeader({
    title: "Team",
    subtitle: "Collaborate with your team",
    icon: Users,
  })

  const [activeTab, setActiveTab] = useState("approvals")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<string>("editor")
  const [newComment, setNewComment] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRequests = approvalRequests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingCount = approvalRequests.filter((r) => r.status === "pending").length

  const handleApprove = (requestId: string) => {
    console.log("Approving request:", requestId)
  }

  const handleReject = (requestId: string) => {
    console.log("Rejecting request:", requestId)
  }

  const handleRequestChanges = (requestId: string) => {
    console.log("Requesting changes for:", requestId)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRequest) return
    console.log("Adding comment:", newComment)
    setNewComment("")
  }

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "post_created":
        return <FileText className="w-4 h-4" />
      case "post_approved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "post_rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "comment_added":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "member_joined":
        return <UserPlus className="w-4 h-4 text-purple-500" />
      case "member_role_changed":
        return <Shield className="w-4 h-4 text-amber-500" />
      case "post_published":
        return <Globe className="w-4 h-4 text-green-500" />
      case "post_scheduled":
        return <Calendar className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "𝕏"
      case "instagram":
        return "📸"
      case "facebook":
        return "f"
      case "linkedin":
        return "in"
      case "tiktok":
        return "♪"
      default:
        return "•"
    }
  }

  return (
    <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-border px-6">
              <TabsList className="h-12 bg-transparent p-0 gap-6">
                <TabsTrigger
                  value="approvals"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approval Queue
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team Members
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {teamMembers.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Feed
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Approval Queue Tab */}
            <TabsContent value="approvals" className="flex-1 overflow-hidden m-0">
              <div className="flex h-full">
                {/* Request List */}
                <div className="w-[400px] border-r border-border flex flex-col">
                  <div className="p-4 border-b border-border space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="flex-1 h-9">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="changes_requested">Changes Requested</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredRequests.map((request) => {
                        const status = statusConfig[request.status]
                        return (
                          <button
                            key={request.id}
                            onClick={() => setSelectedRequest(request)}
                            className={cn(
                              "w-full p-4 rounded-xl text-left transition-all mb-2",
                              selectedRequest?.id === request.id
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted/60 border border-transparent"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10 shrink-0">
                                <AvatarImage src={request.author.avatar} />
                                <AvatarFallback>{request.author.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm truncate">{request.title}</span>
                                  <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                                    {request.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {request.content}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {request.platform.map((p) => (
                                      <span
                                        key={p}
                                        className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px]"
                                      >
                                        {getPlatformIcon(p)}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {request.comments.length > 0 && (
                                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MessageSquare className="w-3 h-3" />
                                        {request.comments.length}
                                      </span>
                                    )}
                                    <Badge
                                      className={cn(
                                        "text-[10px] gap-1",
                                        status.color,
                                        "text-white"
                                      )}
                                    >
                                      <status.icon className="w-3 h-3" />
                                      {status.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Request Detail */}
                <div className="flex-1 flex flex-col">
                  {selectedRequest ? (
                    <>
                      <div className="p-6 border-b border-border">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-lg font-semibold">{selectedRequest.title}</h2>
                              <Badge variant="outline">{selectedRequest.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={selectedRequest.author.avatar} />
                                  <AvatarFallback className="text-[10px]">
                                    {selectedRequest.author.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {selectedRequest.author.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDistanceToNow(selectedRequest.createdAt, { addSuffix: true })}
                              </span>
                              {selectedRequest.scheduledFor && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Scheduled: {format(selectedRequest.scheduledFor, "MMM d, h:mm a")}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className={cn(statusConfig[selectedRequest.status].color, "text-white gap-1")}>
                            {(() => {
                              const StatusIcon = statusConfig[selectedRequest.status].icon
                              return <StatusIcon className="w-3 h-3" />
                            })()}
                            {statusConfig[selectedRequest.status].label}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        {selectedRequest.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="gap-2 bg-green-500 hover:bg-green-600"
                              onClick={() => handleApprove(selectedRequest.id)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                              onClick={() => handleRequestChanges(selectedRequest.id)}
                            >
                              <AlertCircle className="w-4 h-4" />
                              Request Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                              onClick={() => handleReject(selectedRequest.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>

                      <ScrollArea className="flex-1 p-6">
                        {/* Content Preview */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-3">Content Preview</h3>
                          <div className="p-4 rounded-xl bg-muted/50 border border-border">
                            <p className="text-sm whitespace-pre-wrap">{selectedRequest.content}</p>
                            {selectedRequest.media && selectedRequest.media.length > 0 && (
                              <div className="mt-4 flex gap-2">
                                {selectedRequest.media.map((media, index) => (
                                  <div
                                    key={index}
                                    className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center"
                                  >
                                    {media.type === "image" ? (
                                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    ) : (
                                      <Video className="w-8 h-8 text-muted-foreground" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Platforms */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-3">Target Platforms</h3>
                          <div className="flex gap-2">
                            {selectedRequest.platform.map((platform) => (
                              <Badge key={platform} variant="secondary" className="capitalize">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Comments ({selectedRequest.comments.length})
                          </h3>
                          <div className="space-y-4">
                            {selectedRequest.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="w-8 h-8 shrink-0">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {comment.author.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{comment.author.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                      <ThumbsUp className="w-3 h-3" />
                                      {comment.reactions?.reduce((acc, r) => acc + r.users.length, 0) || 0}
                                    </button>
                                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                      <Reply className="w-3 h-3" />
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                              <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src="/professional-man-portrait.png" />
                                <AvatarFallback>AS</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Add a comment..."
                                  className="min-h-[80px] resize-none"
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <AtSign className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Sparkles className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <Button size="sm" className="gap-2" onClick={handleAddComment}>
                                    <Send className="w-4 h-4" />
                                    Comment
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">Select a request</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a request from the list to view details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Team Members Tab */}
            <TabsContent value="members" className="flex-1 overflow-hidden m-0 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  {filteredMembers.map((member) => {
                    const role = roleConfig[member.role]
                    const RoleIcon = role.icon
                    return (
                      <div
                        key={member.id}
                        className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-sm">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              {member.status === "pending" && (
                                <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className={cn("flex items-center gap-1.5 text-sm font-medium", role.color)}>
                                <RoleIcon className="w-4 h-4" />
                                {role.label}
                              </div>
                              {member.lastActive && (
                                <p className="text-xs text-muted-foreground">
                                  Active {formatDistanceToNow(member.lastActive, { addSuffix: true })}
                                </p>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Role Legend */}
                <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
                  <h3 className="font-medium mb-4">Role Permissions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(roleConfig).map(([key, config]) => {
                      const Icon = config.icon
                      return (
                        <div key={key} className="flex items-start gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
                            <Icon className={cn("w-4 h-4", config.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{config.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {key === "owner" && "Full access, billing, team management"}
                              {key === "admin" && "Manage team, approve posts, analytics"}
                              {key === "editor" && "Create and edit posts, view analytics"}
                              {key === "viewer" && "View-only access to posts and analytics"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Feed Tab */}
            <TabsContent value="activity" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="max-w-3xl mx-auto p-6">
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-6">
                      {activityFeed.map((activity) => (
                        <div key={activity.id} className="relative flex gap-4 pl-12">
                          <div className="absolute left-0 w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={activity.actor.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {activity.actor.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{activity.actor.name}</span>
                              <span className="text-sm text-muted-foreground">{activity.description}</span>
                              {activity.target && (
                                <span className="text-sm font-medium text-primary">{activity.target}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They'll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-green-500" />
                      Editor
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      Viewer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
