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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  MoreVertical,
  Share2,
  Trophy,
  TrendingUp,
  Star,
  Gift,
  Target,
  Eye,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Crown,
  Medal,
  Award,
  Zap,
  Calendar,
  Building,
  Mail,
  Link2,
  Copy,
  Check,
  Users,
  Send,
  Heart,
  BarChart3,
  Megaphone,
  UserPlus,
  Settings,
  Download,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
  connectedAccounts: {
    platform: string;
    username: string;
    followers: number;
  }[];
  stats: {
    totalShares: number;
    totalReach: number;
    totalEngagement: number;
    points: number;
  };
  rank: number;
  joinedAt: Date;
  status: "active" | "pending" | "inactive";
  lastActivity: Date;
}

interface AdvocacyContent {
  id: string;
  title: string;
  description: string;
  content: string;
  suggestedCaption: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "link";
  category: string;
  platforms: string[];
  points: number;
  expiresAt?: Date;
  createdAt: Date;
  stats: {
    totalShares: number;
    totalReach: number;
    engagement: number;
  };
  status: "active" | "scheduled" | "expired";
  priority: "high" | "medium" | "low";
  sharedBy: string[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "gift_card" | "swag" | "experience" | "donation";
  image: string;
  available: number;
  claimed: number;
}

interface LeaderboardEntry {
  rank: number;
  employee: Employee;
  points: number;
  shares: number;
  reach: number;
  trend: "up" | "down" | "same";
  trendValue: number;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    avatar: "SJ",
    connectedAccounts: [
      { platform: "linkedin", username: "sarahjohnson", followers: 5420 },
      { platform: "twitter", username: "sarahj_marketing", followers: 3200 },
    ],
    stats: {
      totalShares: 156,
      totalReach: 245000,
      totalEngagement: 12400,
      points: 4850,
    },
    rank: 1,
    joinedAt: new Date("2024-01-15"),
    status: "active",
    lastActivity: new Date(),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Sales",
    role: "Senior Sales Rep",
    avatar: "MC",
    connectedAccounts: [
      { platform: "linkedin", username: "michaelchen", followers: 8900 },
      { platform: "twitter", username: "mike_sells", followers: 1500 },
      { platform: "facebook", username: "michael.chen.sales", followers: 2100 },
    ],
    stats: {
      totalShares: 142,
      totalReach: 312000,
      totalEngagement: 15600,
      points: 4520,
    },
    rank: 2,
    joinedAt: new Date("2024-01-20"),
    status: "active",
    lastActivity: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Product",
    role: "Product Manager",
    avatar: "ED",
    connectedAccounts: [
      { platform: "linkedin", username: "emilydavis", followers: 4200 },
      { platform: "twitter", username: "emily_pm", followers: 2800 },
    ],
    stats: {
      totalShares: 98,
      totalReach: 156000,
      totalEngagement: 8900,
      points: 3200,
    },
    rank: 3,
    joinedAt: new Date("2024-02-01"),
    status: "active",
    lastActivity: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@company.com",
    department: "Engineering",
    role: "Tech Lead",
    avatar: "JW",
    connectedAccounts: [
      { platform: "linkedin", username: "jameswilson", followers: 6500 },
      { platform: "twitter", username: "james_codes", followers: 4100 },
    ],
    stats: {
      totalShares: 87,
      totalReach: 198000,
      totalEngagement: 9200,
      points: 2900,
    },
    rank: 4,
    joinedAt: new Date("2024-02-15"),
    status: "active",
    lastActivity: new Date(Date.now() - 172800000),
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    department: "HR",
    role: "HR Director",
    avatar: "LT",
    connectedAccounts: [
      { platform: "linkedin", username: "lisathompson", followers: 3800 },
    ],
    stats: {
      totalShares: 65,
      totalReach: 89000,
      totalEngagement: 4500,
      points: 2100,
    },
    rank: 5,
    joinedAt: new Date("2024-03-01"),
    status: "active",
    lastActivity: new Date(Date.now() - 259200000),
  },
];

const mockContent: AdvocacyContent[] = [
  {
    id: "1",
    title: "Q4 Product Launch Announcement",
    description: "Share our exciting new product launch with your network!",
    content: "We're thrilled to announce the launch of our revolutionary new product that will transform how teams collaborate. Check out the full details and be among the first to experience the future of work.",
    suggestedCaption: "Excited to share that @OurCompany just launched something incredible! 🚀 This is going to change everything about how we work together. Check it out! #Innovation #FutureOfWork #ProductLaunch",
    mediaUrl: "/api/placeholder/800/400",
    mediaType: "image",
    category: "Product News",
    platforms: ["linkedin", "twitter", "facebook"],
    points: 50,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    stats: {
      totalShares: 45,
      totalReach: 125000,
      engagement: 6800,
    },
    status: "active",
    priority: "high",
    sharedBy: ["1", "2", "3"],
  },
  {
    id: "2",
    title: "Company Culture Blog Post",
    description: "Share insights about our amazing workplace culture",
    content: "Our latest blog post explores what makes our company culture unique and why we've been named one of the best places to work for three years running.",
    suggestedCaption: "Proud to work at a company that truly values its people! Here's a peek into what makes our culture so special. #CompanyCulture #BestPlaceToWork #TeamWork",
    mediaUrl: "/api/placeholder/800/400",
    mediaType: "image",
    category: "Culture",
    platforms: ["linkedin", "facebook", "instagram"],
    points: 30,
    createdAt: new Date(Date.now() - 86400000),
    stats: {
      totalShares: 32,
      totalReach: 78000,
      engagement: 4200,
    },
    status: "active",
    priority: "medium",
    sharedBy: ["1", "4"],
  },
  {
    id: "3",
    title: "Industry Report 2024",
    description: "Share our comprehensive industry insights",
    content: "Our research team has compiled the most comprehensive industry report of 2024. Get exclusive insights and trends that will shape the future.",
    suggestedCaption: "Just read through our team's 2024 Industry Report and the insights are incredible! 📊 If you want to stay ahead of the curve, this is a must-read. #IndustryInsights #Research #ThoughtLeadership",
    mediaUrl: "/api/placeholder/800/400",
    mediaType: "link",
    category: "Thought Leadership",
    platforms: ["linkedin", "twitter"],
    points: 40,
    createdAt: new Date(Date.now() - 172800000),
    stats: {
      totalShares: 28,
      totalReach: 92000,
      engagement: 5100,
    },
    status: "active",
    priority: "medium",
    sharedBy: ["2", "3", "5"],
  },
  {
    id: "4",
    title: "We're Hiring! Join Our Team",
    description: "Help us find great talent by sharing our open positions",
    content: "We're growing and looking for talented individuals to join our team. Multiple positions open across departments.",
    suggestedCaption: "My team is growing! 🎉 We're looking for amazing people to join us. If you're passionate about making an impact, check out our open roles! #Hiring #CareerOpportunity #JoinUs",
    category: "Recruiting",
    platforms: ["linkedin", "twitter", "facebook"],
    points: 35,
    createdAt: new Date(Date.now() - 259200000),
    stats: {
      totalShares: 56,
      totalReach: 145000,
      engagement: 3800,
    },
    status: "active",
    priority: "high",
    sharedBy: ["1", "2", "4", "5"],
  },
];

const mockRewards: Reward[] = [
  {
    id: "1",
    name: "$50 Amazon Gift Card",
    description: "Redeem your points for an Amazon gift card",
    pointsCost: 2500,
    category: "gift_card",
    image: "/api/placeholder/200/200",
    available: 50,
    claimed: 23,
  },
  {
    id: "2",
    name: "Company Swag Box",
    description: "Premium branded merchandise including hoodie, water bottle, and more",
    pointsCost: 1500,
    category: "swag",
    image: "/api/placeholder/200/200",
    available: 100,
    claimed: 45,
  },
  {
    id: "3",
    name: "Extra PTO Day",
    description: "Earn an additional paid time off day",
    pointsCost: 5000,
    category: "experience",
    image: "/api/placeholder/200/200",
    available: 20,
    claimed: 8,
  },
  {
    id: "4",
    name: "Charity Donation",
    description: "Donate your points to a charity of your choice",
    pointsCost: 1000,
    category: "donation",
    image: "/api/placeholder/200/200",
    available: 999,
    claimed: 67,
  },
];

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <FaTwitter className="h-4 w-4 text-sky-500" />,
  linkedin: <FaLinkedin className="h-4 w-4 text-blue-600" />,
  facebook: <FaFacebook className="h-4 w-4 text-blue-500" />,
  instagram: <FaInstagram className="h-4 w-4 text-pink-500" />,
};

const priorityConfig = {
  high: { label: "High Priority", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  low: { label: "Low", color: "bg-green-500/10 text-green-500 border-green-500/20" },
};

const categoryIcons: Record<string, React.ReactNode> = {
  gift_card: <Gift className="h-5 w-5" />,
  swag: <Star className="h-5 w-5" />,
  experience: <Zap className="h-5 w-5" />,
  donation: <Heart className="h-5 w-5" />,
};

export default function EmployeeAdvocacyPage() {
  usePageHeader({
    title: "Employee Advocacy",
    subtitle: "Empower your team",
    icon: Users,
  });

  const [activeTab, setActiveTab] = useState<"content" | "leaderboard" | "employees" | "rewards" | "settings">("content");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<AdvocacyContent | null>(null);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [showInviteEmployee, setShowInviteEmployee] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [timeRange, setTimeRange] = useState("this_month");

  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(e => e.status === "active").length;
  const totalShares = mockEmployees.reduce((sum, e) => sum + e.stats.totalShares, 0);
  const totalReach = mockEmployees.reduce((sum, e) => sum + e.stats.totalReach, 0);
  const avgEngagement = (mockEmployees.reduce((sum, e) => sum + e.stats.totalEngagement, 0) / totalEmployees).toFixed(0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleCopyLink = (contentId: string) => {
    navigator.clipboard.writeText(`https://advocacy.company.com/share/${contentId}`);
    setCopiedId(contentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const leaderboardData: LeaderboardEntry[] = mockEmployees
    .sort((a, b) => b.stats.points - a.stats.points)
    .map((employee, index) => ({
      rank: index + 1,
      employee,
      points: employee.stats.points,
      shares: employee.stats.totalShares,
      reach: employee.stats.totalReach,
      trend: index % 3 === 0 ? "up" : index % 3 === 1 ? "same" : "down",
      trendValue: Math.floor(Math.random() * 5) + 1,
    }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowInviteEmployee(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Employees
              </Button>
              <Button onClick={() => setShowCreateContent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 p-4 pt-0">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {activeEmployees} active
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <div className="text-xs text-muted-foreground">Total Advocates</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Share2 className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{totalShares}</div>
                <div className="text-xs text-muted-foreground">Total Shares</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Eye className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +28%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(totalReach)}</div>
                <div className="text-xs text-muted-foreground">Total Reach</div>
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
                <div className="text-2xl font-bold">{formatNumber(parseInt(avgEngagement))}</div>
                <div className="text-xs text-muted-foreground">Avg Engagement</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <Badge variant="outline" className="text-xs">
                  This month
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(mockEmployees.reduce((sum, e) => sum + e.stats.points, 0))}</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {[
              { id: "content", label: "Content Library", icon: Megaphone },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "employees", label: "Employees", icon: Users },
              { id: "rewards", label: "Rewards", icon: Gift },
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
            {/* Content Library Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content..."
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
                      <DropdownMenuItem onClick={() => setFilterCategory("product")}>Product News</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("culture")}>Culture</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("thought")}>Thought Leadership</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("recruiting")}>Recruiting</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Priority
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterPriority("all")}>All Priorities</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("high")}>High Priority</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("medium")}>Medium</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("low")}>Low</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockContent.map((content) => (
                    <div
                      key={content.id}
                      className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedContent(content)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={priorityConfig[content.priority].color}>
                            {priorityConfig[content.priority].label}
                          </Badge>
                          <Badge variant="outline">{content.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Star className="h-3 w-3 mr-1" />
                            {content.points} pts
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLink(content.id);
                              }}>
                                <Link2 className="h-4 w-4 mr-2" />
                                Copy Share Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2">{content.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {content.description}
                      </p>

                      {content.mediaUrl && (
                        <div className="bg-muted rounded-lg h-32 mb-4 flex items-center justify-center">
                          <div className="text-muted-foreground text-sm">Preview Image</div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {content.stats.totalShares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {formatNumber(content.stats.totalReach)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {formatNumber(content.stats.engagement)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {content.platforms.map((platform) => (
                            <span key={platform}>{platformIcons[platform]}</span>
                          ))}
                        </div>
                      </div>

                      {content.expiresAt && (
                        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Expires {formatDistanceToNow(content.expiresAt, { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Advocates
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {timeRange === "this_month" ? "This Month" : timeRange === "this_quarter" ? "This Quarter" : "All Time"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTimeRange("this_month")}>This Month</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("this_quarter")}>This Quarter</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("all_time")}>All Time</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {leaderboardData.slice(0, 3).map((entry, index) => (
                    <div
                      key={entry.employee.id}
                      className={cn(
                        "relative bg-card border rounded-lg p-6 text-center",
                        index === 0 && "ring-2 ring-yellow-500/50 bg-yellow-500/5",
                        index === 1 && "ring-2 ring-gray-400/50 bg-gray-400/5",
                        index === 2 && "ring-2 ring-amber-600/50 bg-amber-600/5"
                      )}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        {entry.employee.avatar}
                      </div>
                      <h3 className="font-semibold">{entry.employee.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{entry.employee.department}</p>
                      <div className="text-2xl font-bold text-primary">{formatNumber(entry.points)}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-xs">
                        <div>
                          <div className="font-medium">{entry.shares}</div>
                          <div className="text-muted-foreground">Shares</div>
                        </div>
                        <div>
                          <div className="font-medium">{formatNumber(entry.reach)}</div>
                          <div className="text-muted-foreground">Reach</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Leaderboard */}
                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div>Rank</div>
                    <div className="col-span-2">Employee</div>
                    <div className="text-right">Points</div>
                    <div className="text-right">Shares</div>
                    <div className="text-right">Reach</div>
                  </div>
                  {leaderboardData.map((entry) => (
                    <div
                      key={entry.employee.id}
                      className="grid grid-cols-6 gap-4 p-4 border-t items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        {entry.trend === "up" && (
                          <span className="text-xs text-green-500">▲{entry.trendValue}</span>
                        )}
                        {entry.trend === "down" && (
                          <span className="text-xs text-red-500">▼{entry.trendValue}</span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {entry.employee.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{entry.employee.name}</div>
                          <div className="text-xs text-muted-foreground">{entry.employee.department}</div>
                        </div>
                      </div>
                      <div className="text-right font-semibold">{formatNumber(entry.points)}</div>
                      <div className="text-right text-muted-foreground">{entry.shares}</div>
                      <div className="text-right text-muted-foreground">{formatNumber(entry.reach)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === "employees" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" onClick={() => setShowInviteEmployee(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {mockEmployees.map((employee) => (
                    <div key={employee.id} className="bg-card border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                            {employee.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            employee.status === "active" && "bg-green-500/10 text-green-500 border-green-500/20",
                            employee.status === "pending" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                            employee.status === "inactive" && "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          )}
                        >
                          {employee.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{employee.department}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {employee.connectedAccounts.map((account) => (
                          <div
                            key={account.platform}
                            className="flex items-center gap-1 bg-muted rounded-full px-2 py-1 text-xs"
                          >
                            {platformIcons[account.platform]}
                            <span>{formatNumber(account.followers)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-4 border-t text-center">
                        <div>
                          <div className="text-lg font-semibold">{employee.stats.totalShares}</div>
                          <div className="text-xs text-muted-foreground">Shares</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{formatNumber(employee.stats.totalReach)}</div>
                          <div className="text-xs text-muted-foreground">Reach</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{formatNumber(employee.stats.totalEngagement)}</div>
                          <div className="text-xs text-muted-foreground">Engage</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-primary">{formatNumber(employee.stats.points)}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last active {formatDistanceToNow(employee.lastActivity, { addSuffix: true })}</span>
                        <span>Rank #{employee.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === "rewards" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-500" />
                    Rewards Catalog
                  </h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reward
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockRewards.map((reward) => (
                    <div key={reward.id} className="bg-card border rounded-lg overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                          {categoryIcons[reward.category]}
                        </div>
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs capitalize">
                          {reward.category.replace("_", " ")}
                        </Badge>
                        <h3 className="font-semibold mb-1">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {reward.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <Star className="h-4 w-4" />
                            {formatNumber(reward.pointsCost)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {reward.available - reward.claimed} left
                          </span>
                        </div>
                        <Progress
                          value={(reward.claimed / reward.available) * 100}
                          className="mt-2 h-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Program Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-approve Content Shares</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically approve shares without manual review
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Send email when new content is available
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Slack Integration</div>
                        <div className="text-sm text-muted-foreground">
                          Post new content to Slack channel
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Leaderboard Visibility</div>
                        <div className="text-sm text-muted-foreground">
                          Show leaderboard to all employees
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Points Configuration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Points per Share</label>
                        <Input type="number" defaultValue="10" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bonus for High Engagement</label>
                        <Input type="number" defaultValue="25" className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Weekly Streak Bonus</label>
                        <Input type="number" defaultValue="50" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">First Share of Day Bonus</label>
                        <Input type="number" defaultValue="5" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Branding</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Program Name</label>
                      <Input defaultValue="Brand Champions" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Welcome Message</label>
                      <Textarea
                        defaultValue="Welcome to our employee advocacy program! Share company content and earn points for amazing rewards."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </div>
            )}
          </div>
        </ScrollArea>

      {/* Content Detail Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={priorityConfig[selectedContent.priority].color}>
                    {priorityConfig[selectedContent.priority].label}
                  </Badge>
                  <Badge variant="outline">{selectedContent.category}</Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Star className="h-3 w-3 mr-1" />
                    {selectedContent.points} pts
                  </Badge>
                </div>

                <p className="text-muted-foreground">{selectedContent.description}</p>

                {selectedContent.mediaUrl && (
                  <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                    <div className="text-muted-foreground">Preview Image</div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Suggested Caption</label>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                    {selectedContent.suggestedCaption}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Share on:</span>
                  {selectedContent.platforms.map((platform) => (
                    <span key={platform}>{platformIcons[platform]}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedContent.stats.totalShares}</div>
                    <div className="text-xs text-muted-foreground">Total Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedContent.stats.totalReach)}</div>
                    <div className="text-xs text-muted-foreground">Total Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedContent.stats.engagement)}</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleCopyLink(selectedContent.id)}>
                    {copiedId === selectedContent.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Share Link
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Employee Dialog */}
      <Dialog open={showInviteEmployee} onOpenChange={setShowInviteEmployee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Employees</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Addresses</label>
              <Textarea
                placeholder="Enter email addresses, one per line..."
                className="mt-2"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can also paste a comma-separated list of emails
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input placeholder="e.g., Marketing, Sales, Engineering" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Personal Message (Optional)</label>
              <Textarea
                placeholder="Add a personal message to the invitation..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
              <Button variant="outline" onClick={() => setShowInviteEmployee(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={showCreateContent} onOpenChange={setShowCreateContent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Advocacy Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter content title..." className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Brief description for employees..."
                className="mt-2"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Suggested Caption</label>
              <Textarea
                placeholder="Write a suggested social media caption..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="e.g., Product News" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Points</label>
                <Input type="number" placeholder="10" className="mt-2" />
              </div>
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
            <div>
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Low</Button>
                <Button variant="outline" size="sm">Medium</Button>
                <Button variant="secondary" size="sm">High</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Create Content</Button>
              <Button variant="outline" onClick={() => setShowCreateContent(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
