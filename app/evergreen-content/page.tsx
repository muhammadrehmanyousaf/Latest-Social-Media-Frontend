"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, addDays } from "date-fns";
import {
  RefreshCw,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Eye,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Play,
  Pause,
  Settings,
  Filter,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  History,
  Timer,
  Shuffle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Leaf,
  TreeDeciduous,
  Archive,
  Star,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

interface EvergreenPost {
  id: string;
  content: string;
  variations: string[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
  platforms: string[];
  category: string;
  tags: string[];
  status: "active" | "paused" | "expired" | "draft";
  recycleSettings: {
    enabled: boolean;
    minInterval: number; // days
    maxInterval: number; // days
    maxRecycles: number;
    currentRecycles: number;
    useVariations: boolean;
    randomizeTime: boolean;
  };
  performance: {
    totalPosts: number;
    avgEngagement: number;
    avgReach: number;
    bestPerformingVariation: number;
    trend: "up" | "down" | "stable";
  };
  schedule: {
    nextPost?: Date;
    lastPosted?: Date;
    timezone: string;
    preferredTimes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface RecycleQueue {
  id: string;
  postId: string;
  post: EvergreenPost;
  scheduledFor: Date;
  variationIndex: number;
  platform: string;
  status: "scheduled" | "posted" | "failed" | "skipped";
}

interface CategoryStats {
  name: string;
  count: number;
  avgEngagement: number;
  color: string;
}

const mockPosts: EvergreenPost[] = [
  {
    id: "1",
    content: "5 productivity tips that will transform your workday! 🚀\n\n1. Start with your hardest task\n2. Use time-blocking\n3. Take regular breaks\n4. Minimize notifications\n5. Review your day\n\nWhich one resonates most with you?",
    variations: [
      "Want to 10x your productivity? Here are 5 game-changing tips:\n\n1. Tackle tough tasks first\n2. Block your calendar\n3. Break every 90 mins\n4. Silence distractions\n5. Daily review ritual\n\nDrop your favorite below! 👇",
      "Productivity secrets that actually work:\n\n✅ Eat the frog first\n✅ Time-block everything\n✅ Pomodoro technique\n✅ Digital minimalism\n✅ Evening planning\n\nSave this for later! 📌",
    ],
    mediaUrl: "/api/placeholder/800/400",
    mediaType: "image",
    platforms: ["twitter", "linkedin", "facebook"],
    category: "Tips & Advice",
    tags: ["productivity", "tips", "work", "success"],
    status: "active",
    recycleSettings: {
      enabled: true,
      minInterval: 14,
      maxInterval: 30,
      maxRecycles: 12,
      currentRecycles: 5,
      useVariations: true,
      randomizeTime: true,
    },
    performance: {
      totalPosts: 5,
      avgEngagement: 4.2,
      avgReach: 12500,
      bestPerformingVariation: 1,
      trend: "up",
    },
    schedule: {
      nextPost: addDays(new Date(), 3),
      lastPosted: new Date(Date.now() - 86400000 * 14),
      timezone: "America/New_York",
      preferredTimes: ["09:00", "12:00", "17:00"],
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "2",
    content: "The secret to building a successful brand? Consistency.\n\nNot perfection. Not going viral. Just showing up every single day.\n\nWhat's one thing you're committing to doing consistently?",
    variations: [
      "Building a brand isn't about:\n❌ Being perfect\n❌ Going viral\n❌ Having the best content\n\nIt's about:\n✅ Showing up daily\n✅ Being consistent\n✅ Adding value\n\nSimple but powerful.",
    ],
    platforms: ["twitter", "linkedin"],
    category: "Motivation",
    tags: ["branding", "motivation", "consistency", "business"],
    status: "active",
    recycleSettings: {
      enabled: true,
      minInterval: 21,
      maxInterval: 45,
      maxRecycles: 8,
      currentRecycles: 3,
      useVariations: true,
      randomizeTime: false,
    },
    performance: {
      totalPosts: 3,
      avgEngagement: 5.8,
      avgReach: 18000,
      bestPerformingVariation: 0,
      trend: "up",
    },
    schedule: {
      nextPost: addDays(new Date(), 7),
      lastPosted: new Date(Date.now() - 86400000 * 21),
      timezone: "America/New_York",
      preferredTimes: ["08:00", "18:00"],
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: "3",
    content: "Free tools every entrepreneur should know:\n\n📊 Analytics: Google Analytics\n📧 Email: Mailchimp\n📝 Notes: Notion\n🎨 Design: Canva\n📅 Scheduling: Calendly\n\nBookmark this for later! What would you add?",
    variations: [
      "My favorite free tools for entrepreneurs:\n\n1️⃣ Notion for everything\n2️⃣ Canva for design\n3️⃣ Calendly for meetings\n4️⃣ Mailchimp for emails\n5️⃣ GA4 for analytics\n\nWhat's your go-to tool?",
    ],
    mediaUrl: "/api/placeholder/800/400",
    mediaType: "image",
    platforms: ["twitter", "linkedin", "facebook", "instagram"],
    category: "Resources",
    tags: ["tools", "entrepreneur", "free", "productivity"],
    status: "active",
    recycleSettings: {
      enabled: true,
      minInterval: 30,
      maxInterval: 60,
      maxRecycles: 6,
      currentRecycles: 2,
      useVariations: true,
      randomizeTime: true,
    },
    performance: {
      totalPosts: 2,
      avgEngagement: 6.5,
      avgReach: 25000,
      bestPerformingVariation: 0,
      trend: "stable",
    },
    schedule: {
      nextPost: addDays(new Date(), 12),
      lastPosted: new Date(Date.now() - 86400000 * 30),
      timezone: "America/New_York",
      preferredTimes: ["10:00", "14:00"],
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date(),
  },
  {
    id: "4",
    content: "Reminder: Your mental health matters more than any deadline.\n\nTake breaks. Set boundaries. Ask for help.\n\nYou can't pour from an empty cup. 💙",
    variations: [],
    platforms: ["twitter", "linkedin", "instagram"],
    category: "Wellness",
    tags: ["mentalhealth", "wellness", "selfcare", "balance"],
    status: "paused",
    recycleSettings: {
      enabled: false,
      minInterval: 30,
      maxInterval: 60,
      maxRecycles: 4,
      currentRecycles: 4,
      useVariations: false,
      randomizeTime: true,
    },
    performance: {
      totalPosts: 4,
      avgEngagement: 8.2,
      avgReach: 32000,
      bestPerformingVariation: 0,
      trend: "stable",
    },
    schedule: {
      lastPosted: new Date(Date.now() - 86400000 * 60),
      timezone: "America/New_York",
      preferredTimes: ["09:00"],
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
];

const mockQueue: RecycleQueue[] = [
  {
    id: "q1",
    postId: "1",
    post: mockPosts[0],
    scheduledFor: addDays(new Date(), 3),
    variationIndex: 1,
    platform: "twitter",
    status: "scheduled",
  },
  {
    id: "q2",
    postId: "1",
    post: mockPosts[0],
    scheduledFor: addDays(new Date(), 4),
    variationIndex: 0,
    platform: "linkedin",
    status: "scheduled",
  },
  {
    id: "q3",
    postId: "2",
    post: mockPosts[1],
    scheduledFor: addDays(new Date(), 7),
    variationIndex: 0,
    platform: "twitter",
    status: "scheduled",
  },
  {
    id: "q4",
    postId: "3",
    post: mockPosts[2],
    scheduledFor: addDays(new Date(), 12),
    variationIndex: 1,
    platform: "linkedin",
    status: "scheduled",
  },
];

const categoryStats: CategoryStats[] = [
  { name: "Tips & Advice", count: 12, avgEngagement: 4.5, color: "bg-blue-500" },
  { name: "Motivation", count: 8, avgEngagement: 5.2, color: "bg-purple-500" },
  { name: "Resources", count: 6, avgEngagement: 6.1, color: "bg-green-500" },
  { name: "Wellness", count: 4, avgEngagement: 7.8, color: "bg-pink-500" },
  { name: "Industry News", count: 3, avgEngagement: 3.2, color: "bg-orange-500" },
];

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <FaTwitter className="h-4 w-4 text-sky-500" />,
  linkedin: <FaLinkedin className="h-4 w-4 text-blue-600" />,
  facebook: <FaFacebook className="h-4 w-4 text-blue-500" />,
  instagram: <FaInstagram className="h-4 w-4 text-pink-500" />,
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Play },
  paused: { label: "Paused", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Pause },
  expired: { label: "Expired", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: Archive },
  draft: { label: "Draft", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Edit3 },
};

export default function EvergreenContentPage() {
  usePageHeader({
    title: "Evergreen Content",
    subtitle: "Auto-recycle your best content",
    icon: TreeDeciduous,
  });

  const [activeTab, setActiveTab] = useState<"library" | "queue" | "analytics" | "settings">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<EvergreenPost | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const activePosts = mockPosts.filter(p => p.status === "active").length;
  const totalRecycles = mockPosts.reduce((sum, p) => sum + p.recycleSettings.currentRecycles, 0);
  const avgEngagement = (mockPosts.reduce((sum, p) => sum + p.performance.avgEngagement, 0) / mockPosts.length).toFixed(1);
  const totalReach = mockPosts.reduce((sum, p) => sum + p.performance.avgReach * p.performance.totalPosts, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle Queue
              </Button>
              <Button onClick={() => setShowCreatePost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Evergreen Post
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 p-4 pt-0">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Leaf className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className="text-xs">
                  {mockPosts.length} total
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{activePosts}</div>
                <div className="text-xs text-muted-foreground">Active Posts</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{totalRecycles}</div>
                <div className="text-xs text-muted-foreground">Total Recycles</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Calendar className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  Next 30 days
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{mockQueue.length}</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <ThumbsUp className="h-5 w-5 text-orange-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{avgEngagement}%</div>
                <div className="text-xs text-muted-foreground">Avg Engagement</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Eye className="h-5 w-5 text-cyan-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +22%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(totalReach)}</div>
                <div className="text-xs text-muted-foreground">Total Reach</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {[
              { id: "library", label: "Content Library", icon: TreeDeciduous },
              { id: "queue", label: "Recycle Queue", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Library Tab */}
            {activeTab === "library" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Category
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {categoryStats.map((cat) => (
                        <DropdownMenuItem key={cat.name} onClick={() => setFilterCategory(cat.name)}>
                          {cat.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("paused")}>Paused</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("expired")}>Expired</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPosts.map((post) => {
                    const StatusIcon = statusConfig[post.status].icon;
                    return (
                      <div
                        key={post.id}
                        className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusConfig[post.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[post.status].label}
                            </Badge>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                {post.status === "active" ? "Pause" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm mb-4 line-clamp-3">{post.content}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          {post.platforms.map((platform) => (
                            <span key={platform}>{platformIcons[platform]}</span>
                          ))}
                          {post.variations.length > 0 && (
                            <Badge variant="outline" className="text-xs ml-auto">
                              <Shuffle className="h-3 w-3 mr-1" />
                              {post.variations.length + 1} variations
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg text-center text-sm">
                          <div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                              {post.performance.totalPosts}
                              {post.performance.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                            </div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                          </div>
                          <div>
                            <div className="font-semibold">{post.performance.avgEngagement}%</div>
                            <div className="text-xs text-muted-foreground">Engage</div>
                          </div>
                          <div>
                            <div className="font-semibold">{formatNumber(post.performance.avgReach)}</div>
                            <div className="text-xs text-muted-foreground">Reach</div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {post.recycleSettings.currentRecycles}/{post.recycleSettings.maxRecycles}
                            </div>
                            <div className="text-xs text-muted-foreground">Recycles</div>
                          </div>
                        </div>

                        {post.schedule.nextPost && post.status === "active" && (
                          <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Next post: {format(post.schedule.nextPost, "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Recycle progress</span>
                            <span className="text-muted-foreground">
                              {post.recycleSettings.currentRecycles}/{post.recycleSettings.maxRecycles}
                            </span>
                          </div>
                          <Progress
                            value={(post.recycleSettings.currentRecycles / post.recycleSettings.maxRecycles) * 100}
                            className="h-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Queue Tab */}
            {activeTab === "queue" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Upcoming Recycles
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div>Scheduled</div>
                    <div className="col-span-2">Content</div>
                    <div>Platform</div>
                    <div>Variation</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {mockQueue.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-6 gap-4 p-4 border-t items-center hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <div className="font-medium">{format(item.scheduledFor, "MMM d")}</div>
                        <div className="text-xs text-muted-foreground">{format(item.scheduledFor, "h:mm a")}</div>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm line-clamp-2">{item.post.content}</p>
                      </div>
                      <div>{platformIcons[item.platform]}</div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          V{item.variationIndex + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Performance */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Category Performance
                    </h3>
                    <div className="space-y-4">
                      {categoryStats.map((cat) => (
                        <div key={cat.name}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className={cn("w-3 h-3 rounded-full", cat.color)} />
                              {cat.name}
                            </span>
                            <span className="text-muted-foreground">
                              {cat.count} posts • {cat.avgEngagement}% avg
                            </span>
                          </div>
                          <Progress value={cat.avgEngagement * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Performing Posts */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Top Performing Posts
                    </h3>
                    <div className="space-y-4">
                      {mockPosts
                        .sort((a, b) => b.performance.avgEngagement - a.performance.avgEngagement)
                        .slice(0, 4)
                        .map((post, index) => (
                          <div key={post.id} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm line-clamp-1">{post.content}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span>{post.performance.avgEngagement}% engagement</span>
                                <span>{formatNumber(post.performance.avgReach)} reach</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Recycling Stats */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-green-500" />
                      Recycling Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">{totalRecycles}</div>
                        <div className="text-sm text-muted-foreground">Total Recycles</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-500">+18%</div>
                        <div className="text-sm text-muted-foreground">vs Original Posts</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold">85%</div>
                        <div className="text-sm text-muted-foreground">Recycle Success</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold">24</div>
                        <div className="text-sm text-muted-foreground">Avg Days Between</div>
                      </div>
                    </div>
                  </div>

                  {/* Time Performance */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      Best Posting Times
                    </h3>
                    <div className="space-y-3">
                      {[
                        { time: "9:00 AM", engagement: 5.8, posts: 45 },
                        { time: "12:00 PM", engagement: 4.9, posts: 38 },
                        { time: "5:00 PM", engagement: 5.2, posts: 42 },
                        { time: "8:00 PM", engagement: 4.1, posts: 28 },
                      ].map((slot) => (
                        <div key={slot.time} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">{slot.time}</div>
                          <div className="flex-1">
                            <Progress value={slot.engagement * 15} className="h-3" />
                          </div>
                          <div className="w-24 text-right text-sm text-muted-foreground">
                            {slot.engagement}% • {slot.posts}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Default Recycling Rules</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Minimum Days Between Recycles</label>
                      <div className="mt-2 flex items-center gap-4">
                        <Slider defaultValue={[14]} max={90} min={7} step={1} className="flex-1" />
                        <span className="w-16 text-sm text-muted-foreground">14 days</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Maximum Days Between Recycles</label>
                      <div className="mt-2 flex items-center gap-4">
                        <Slider defaultValue={[45]} max={180} min={14} step={1} className="flex-1" />
                        <span className="w-16 text-sm text-muted-foreground">45 days</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Maximum Recycles per Post</label>
                      <div className="mt-2 flex items-center gap-4">
                        <Slider defaultValue={[8]} max={24} min={2} step={1} className="flex-1" />
                        <span className="w-16 text-sm text-muted-foreground">8 times</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Automation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-rotate Variations</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically use different variations each cycle
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Smart Timing</div>
                        <div className="text-sm text-muted-foreground">
                          Use AI to pick optimal posting times
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Performance-based Priority</div>
                        <div className="text-sm text-muted-foreground">
                          Prioritize high-performing content in queue
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-pause Low Performers</div>
                        <div className="text-sm text-muted-foreground">
                          Pause posts that fall below engagement threshold
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Avoid Duplicate Days</div>
                        <div className="text-sm text-muted-foreground">
                          Don't post same content on multiple platforms same day
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Expiration Rules</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-expire After Max Recycles</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically mark posts as expired when limit reached
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Engagement Threshold</div>
                        <div className="text-sm text-muted-foreground">
                          Expire posts that fall below 2% engagement rate
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </div>
            )}
          </div>
        </ScrollArea>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Evergreen Post Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusConfig[selectedPost.status].color}>
                    {statusConfig[selectedPost.status].label}
                  </Badge>
                  <Badge variant="outline">{selectedPost.category}</Badge>
                  {selectedPost.platforms.map((platform) => (
                    <span key={platform}>{platformIcons[platform]}</span>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium">Original Content</label>
                  <div className="mt-2 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
                </div>

                {selectedPost.variations.length > 0 && (
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Content Variations
                      <Badge variant="outline" className="text-xs">
                        {selectedPost.variations.length + 1} total
                      </Badge>
                    </label>
                    <div className="mt-2 space-y-3">
                      {selectedPost.variations.map((variation, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              Variation {index + 2}
                            </Badge>
                            {selectedPost.performance.bestPerformingVariation === index + 1 && (
                              <Badge className="bg-green-500/10 text-green-500 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Best Performer
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{variation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedPost.performance.totalPosts}</div>
                    <div className="text-xs text-muted-foreground">Times Posted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedPost.performance.avgEngagement}%</div>
                    <div className="text-xs text-muted-foreground">Avg Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedPost.performance.avgReach)}</div>
                    <div className="text-xs text-muted-foreground">Avg Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {selectedPost.recycleSettings.currentRecycles}/{selectedPost.recycleSettings.maxRecycles}
                    </div>
                    <div className="text-xs text-muted-foreground">Recycles</div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Recycling Settings
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recycling Enabled</span>
                      <Switch checked={selectedPost.recycleSettings.enabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Use Variations</span>
                      <Switch checked={selectedPost.recycleSettings.useVariations} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Min Interval</span>
                      <span>{selectedPost.recycleSettings.minInterval} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Max Interval</span>
                      <span>{selectedPost.recycleSettings.maxInterval} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Randomize Time</span>
                      <Switch checked={selectedPost.recycleSettings.randomizeTime} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preferred Times</span>
                      <span>{selectedPost.schedule.preferredTimes.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Post
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                  <Button variant="outline">
                    {selectedPost.status === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Evergreen Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your evergreen post content..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="e.g., Tips & Advice" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="productivity, tips, success (comma separated)" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Platforms</label>
              <div className="flex gap-2 mt-2">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <Button key={platform} variant="outline" size="sm" className="gap-2">
                    {icon}
                    <span className="capitalize">{platform}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Min Interval (days)</label>
                <Input type="number" defaultValue="14" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Max Interval (days)</label>
                <Input type="number" defaultValue="45" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Max Recycles</label>
                <Input type="number" defaultValue="8" className="mt-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Start Recycling Immediately</div>
                <div className="text-sm text-muted-foreground">Queue first post now</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add to Library
              </Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
