"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Rss,
  Plus,
  Search,
  MoreHorizontal,
  Zap,
  Clock,
  ExternalLink,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Globe,
  FileText,
  Image as ImageIcon,
  Link2,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Filter,
  Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

interface RSSFeed {
  id: string
  name: string
  url: string
  status: "active" | "paused" | "error"
  platforms: string[]
  lastFetch?: Date
  postCount: number
  autoPost: boolean
  template: string
  includeImage: boolean
  addHashtags: boolean
  defaultHashtags: string[]
  schedule: "immediate" | "queue" | "custom"
  fetchInterval: number // minutes
  errorMessage?: string
}

interface FeedItem {
  id: string
  feedId: string
  title: string
  description: string
  link: string
  image?: string
  publishedAt: Date
  status: "pending" | "posted" | "skipped"
  postedAt?: Date
}

const mockFeeds: RSSFeed[] = [
  {
    id: "1",
    name: "Company Blog",
    url: "https://blog.socialflow.io/rss",
    status: "active",
    platforms: ["twitter", "linkedin", "facebook"],
    lastFetch: new Date(Date.now() - 1800000),
    postCount: 45,
    autoPost: true,
    template: "📝 New on our blog: {title}\n\n{description}\n\nRead more: {link}",
    includeImage: true,
    addHashtags: true,
    defaultHashtags: ["blog", "socialmedia", "marketing"],
    schedule: "queue",
    fetchInterval: 30,
  },
  {
    id: "2",
    name: "Industry News - TechCrunch",
    url: "https://techcrunch.com/feed/",
    status: "active",
    platforms: ["twitter"],
    lastFetch: new Date(Date.now() - 3600000),
    postCount: 128,
    autoPost: false,
    template: "🔥 {title}\n\n{link}",
    includeImage: true,
    addHashtags: true,
    defaultHashtags: ["tech", "news", "startup"],
    schedule: "immediate",
    fetchInterval: 15,
  },
  {
    id: "3",
    name: "Product Updates",
    url: "https://updates.socialflow.io/rss",
    status: "paused",
    platforms: ["twitter", "linkedin"],
    lastFetch: new Date(Date.now() - 86400000),
    postCount: 23,
    autoPost: true,
    template: "🚀 Product Update: {title}\n\n{description}\n\nLearn more: {link}",
    includeImage: true,
    addHashtags: true,
    defaultHashtags: ["productupdate", "newfeature"],
    schedule: "queue",
    fetchInterval: 60,
  },
  {
    id: "4",
    name: "Partner Content",
    url: "https://partner.example.com/rss",
    status: "error",
    platforms: ["facebook"],
    lastFetch: new Date(Date.now() - 172800000),
    postCount: 12,
    autoPost: false,
    template: "{title}\n\n{link}",
    includeImage: false,
    addHashtags: false,
    defaultHashtags: [],
    schedule: "custom",
    fetchInterval: 120,
    errorMessage: "Feed URL not responding (404)",
  },
]

const mockFeedItems: FeedItem[] = [
  {
    id: "i1",
    feedId: "1",
    title: "10 Social Media Trends You Can't Ignore in 2024",
    description: "Stay ahead of the curve with these emerging social media trends that are reshaping how brands connect with their audiences.",
    link: "https://blog.socialflow.io/social-media-trends-2024",
    image: "/blog-image-1.jpg",
    publishedAt: new Date(Date.now() - 3600000),
    status: "pending",
  },
  {
    id: "i2",
    feedId: "1",
    title: "How AI is Revolutionizing Content Creation",
    description: "Discover how artificial intelligence is transforming the way marketers create and distribute content.",
    link: "https://blog.socialflow.io/ai-content-creation",
    image: "/blog-image-2.jpg",
    publishedAt: new Date(Date.now() - 86400000),
    status: "posted",
    postedAt: new Date(Date.now() - 82800000),
  },
  {
    id: "i3",
    feedId: "2",
    title: "Startup Raises $50M to Build AI-Powered Social Tools",
    description: "A new player enters the social media management space with significant funding.",
    link: "https://techcrunch.com/startup-ai-social",
    image: "/news-image-1.jpg",
    publishedAt: new Date(Date.now() - 7200000),
    status: "pending",
  },
  {
    id: "i4",
    feedId: "1",
    title: "The Ultimate Guide to LinkedIn Marketing",
    description: "Everything you need to know about growing your B2B presence on LinkedIn.",
    link: "https://blog.socialflow.io/linkedin-marketing-guide",
    publishedAt: new Date(Date.now() - 172800000),
    status: "skipped",
  },
]

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", icon: Play },
  paused: { label: "Paused", color: "bg-amber-500", icon: Pause },
  error: { label: "Error", color: "bg-red-500", icon: AlertCircle },
}

const itemStatusConfig = {
  pending: { label: "Pending", color: "bg-amber-500" },
  posted: { label: "Posted", color: "bg-green-500" },
  skipped: { label: "Skipped", color: "bg-gray-500" },
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "twitter": return "𝕏"
    case "instagram": return "📸"
    case "facebook": return "f"
    case "linkedin": return "in"
    default: return "•"
  }
}

export default function RSSFeedsPage() {
  usePageHeader({
    title: "RSS Feeds",
    subtitle: "Auto-share content from RSS feeds",
    icon: Rss,
  })

  const [feeds, setFeeds] = useState(mockFeeds)
  const [feedItems] = useState(mockFeedItems)
  const [selectedFeed, setSelectedFeed] = useState<RSSFeed | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredFeeds = feeds.filter((feed) => {
    const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || feed.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeFeeds = feeds.filter((f) => f.status === "active").length
  const totalPosts = feeds.reduce((acc, f) => acc + f.postCount, 0)
  const pendingItems = feedItems.filter((i) => i.status === "pending").length

  const toggleFeed = (feedId: string) => {
    setFeeds((prev) =>
      prev.map((f) =>
        f.id === feedId
          ? { ...f, status: f.status === "active" ? "paused" : "active" as const }
          : f
      )
    )
  }

  return (
    <>
        {/* Stats */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Feeds</span>
                <Rss className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{activeFeeds}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Posts</span>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending Items</span>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{pendingItems}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">This Week</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-green-600">+24</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Feed List */}
          <div className="w-[400px] border-r border-border flex flex-col">
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search feeds..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {filteredFeeds.map((feed) => {
                  const status = statusConfig[feed.status]
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={feed.id}
                      onClick={() => setSelectedFeed(feed)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all",
                        selectedFeed?.id === feed.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Rss className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{feed.name}</h3>
                            <Badge className={cn("text-[10px] mt-1", status.color, "text-white")}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={feed.status === "active"}
                          onCheckedChange={() => toggleFeed(feed.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">{feed.url}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-1">
                          {feed.platforms.map((p) => (
                            <span key={p} className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px]">
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                        </div>
                        <span>{feed.postCount} posts</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Feed Detail / Items */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedFeed ? (
              <>
                {/* Feed Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedFeed.name}</h2>
                      <a href={selectedFeed.url} target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                        {selectedFeed.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Fetch Now
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Last fetch: {selectedFeed.lastFetch ? formatDistanceToNow(selectedFeed.lastFetch, { addSuffix: true }) : "Never"}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <RefreshCw className="w-4 h-4" />
                      Every {selectedFeed.fetchInterval} min
                    </span>
                    {selectedFeed.autoPost && (
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="w-3 h-3" />
                        Auto-post
                      </Badge>
                    )}
                  </div>
                  {selectedFeed.errorMessage && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {selectedFeed.errorMessage}
                    </div>
                  )}
                </div>

                {/* Feed Items */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Items</h3>
                    {feedItems.filter((i) => i.feedId === selectedFeed.id).map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border hover:border-primary/50 transition-colors">
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium line-clamp-1">{item.title}</h4>
                              <Badge className={cn("text-[10px] shrink-0 ml-2", itemStatusConfig[item.status].color, "text-white")}>
                                {itemStatusConfig[item.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
                              </span>
                              {item.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button size="sm" className="h-7 text-xs gap-1">
                                    <Play className="w-3 h-3" />
                                    Post Now
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Skip
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Rss className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-1">Select a Feed</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a feed to view items and settings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Add Feed Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rss className="w-5 h-5 text-primary" />
              Add RSS Feed
            </DialogTitle>
            <DialogDescription>
              Connect an RSS feed to automatically share content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Feed Name</Label>
              <Input placeholder="e.g., Company Blog" />
            </div>
            <div className="space-y-2">
              <Label>RSS Feed URL</Label>
              <Input placeholder="https://example.com/feed.xml" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fetch Interval</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                    <SelectItem value="120">Every 2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Post Schedule</Label>
                <Select defaultValue="queue">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Post Immediately</SelectItem>
                    <SelectItem value="queue">Add to Queue</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((p) => (
                  <Badge key={p} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Post Template</Label>
              <Textarea
                placeholder="📝 {title}&#10;&#10;{description}&#10;&#10;Read more: {link}"
                className="min-h-[80px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Variables: {"{title}"}, {"{description}"}, {"{link}"}, {"{author}"}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Auto-post new items</p>
                <p className="text-xs text-muted-foreground">Automatically create posts for new feed items</p>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Feed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
