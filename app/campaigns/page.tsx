"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Target,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  BarChart3,
  PieChart,
  Zap,
  Play,
  Pause,
  Archive,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Rocket,
  Flag,
  Layers,
  Link2,
  Settings,
  Download,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, differenceInDays, addDays } from "date-fns"

// Types
interface Campaign {
  id: string
  name: string
  description: string
  status: "draft" | "active" | "paused" | "completed" | "scheduled"
  type: "awareness" | "engagement" | "conversion" | "traffic"
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  platforms: string[]
  posts: number
  published: number
  goals: CampaignGoal[]
  metrics: CampaignMetrics
  team: TeamMember[]
  tags: string[]
  color: string
  createdAt: Date
  updatedAt: Date
}

interface CampaignGoal {
  id: string
  type: "impressions" | "engagement" | "clicks" | "conversions" | "reach" | "followers"
  target: number
  current: number
}

interface CampaignMetrics {
  impressions: number
  reach: number
  engagement: number
  engagementRate: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
  roi: number
  costPerClick: number
  costPerConversion: number
}

interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: string
}

interface CampaignPost {
  id: string
  content: string
  platform: string
  status: "draft" | "scheduled" | "published"
  scheduledFor?: Date
  publishedAt?: Date
  metrics?: {
    impressions: number
    engagement: number
    clicks: number
  }
}

// Mock Data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q4 Product Launch",
    description: "Major product launch campaign across all social channels with influencer partnerships",
    status: "active",
    type: "awareness",
    startDate: new Date(Date.now() - 86400000 * 14),
    endDate: new Date(Date.now() + 86400000 * 16),
    budget: 15000,
    spent: 8500,
    platforms: ["twitter", "instagram", "linkedin", "facebook"],
    posts: 24,
    published: 18,
    goals: [
      { id: "g1", type: "impressions", target: 500000, current: 425000 },
      { id: "g2", type: "engagement", target: 25000, current: 21500 },
      { id: "g3", type: "clicks", target: 10000, current: 8200 },
    ],
    metrics: {
      impressions: 425000,
      reach: 285000,
      engagement: 21500,
      engagementRate: 5.05,
      clicks: 8200,
      ctr: 1.93,
      conversions: 450,
      conversionRate: 5.49,
      roi: 245,
      costPerClick: 1.04,
      costPerConversion: 18.89,
    },
    team: [
      { id: "t1", name: "Sarah Johnson", avatar: "/woman-portrait.png", role: "Campaign Manager" },
      { id: "t2", name: "Mike Chen", role: "Content Creator" },
      { id: "t3", name: "Emily Davis", role: "Designer" },
    ],
    tags: ["product-launch", "q4", "priority"],
    color: "#6366f1",
    createdAt: new Date(Date.now() - 86400000 * 20),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    name: "Holiday Season 2024",
    description: "End of year holiday promotional campaign with special offers and giveaways",
    status: "scheduled",
    type: "conversion",
    startDate: new Date(Date.now() + 86400000 * 7),
    endDate: new Date(Date.now() + 86400000 * 37),
    budget: 25000,
    spent: 0,
    platforms: ["instagram", "facebook", "tiktok"],
    posts: 32,
    published: 0,
    goals: [
      { id: "g4", type: "conversions", target: 2000, current: 0 },
      { id: "g5", type: "reach", target: 1000000, current: 0 },
    ],
    metrics: {
      impressions: 0,
      reach: 0,
      engagement: 0,
      engagementRate: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      roi: 0,
      costPerClick: 0,
      costPerConversion: 0,
    },
    team: [
      { id: "t1", name: "Sarah Johnson", avatar: "/woman-portrait.png", role: "Campaign Manager" },
    ],
    tags: ["holiday", "promo", "sales"],
    color: "#ec4899",
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "3",
    name: "Brand Awareness Q3",
    description: "Ongoing brand awareness campaign focused on thought leadership content",
    status: "completed",
    type: "awareness",
    startDate: new Date(Date.now() - 86400000 * 90),
    endDate: new Date(Date.now() - 86400000 * 5),
    budget: 10000,
    spent: 9850,
    platforms: ["linkedin", "twitter"],
    posts: 45,
    published: 45,
    goals: [
      { id: "g6", type: "impressions", target: 750000, current: 892000 },
      { id: "g7", type: "followers", target: 5000, current: 6200 },
    ],
    metrics: {
      impressions: 892000,
      reach: 540000,
      engagement: 45600,
      engagementRate: 5.11,
      clicks: 18500,
      ctr: 2.07,
      conversions: 890,
      conversionRate: 4.81,
      roi: 312,
      costPerClick: 0.53,
      costPerConversion: 11.07,
    },
    team: [
      { id: "t2", name: "Mike Chen", role: "Content Lead" },
    ],
    tags: ["brand", "thought-leadership"],
    color: "#10b981",
    createdAt: new Date(Date.now() - 86400000 * 95),
    updatedAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "4",
    name: "Customer Stories Series",
    description: "Monthly customer success story highlights across social media",
    status: "active",
    type: "engagement",
    startDate: new Date(Date.now() - 86400000 * 30),
    endDate: new Date(Date.now() + 86400000 * 60),
    budget: 5000,
    spent: 1800,
    platforms: ["linkedin", "twitter", "instagram"],
    posts: 12,
    published: 4,
    goals: [
      { id: "g8", type: "engagement", target: 15000, current: 5200 },
    ],
    metrics: {
      impressions: 125000,
      reach: 82000,
      engagement: 5200,
      engagementRate: 4.16,
      clicks: 3100,
      ctr: 2.48,
      conversions: 120,
      conversionRate: 3.87,
      roi: 156,
      costPerClick: 0.58,
      costPerConversion: 15.00,
    },
    team: [
      { id: "t1", name: "Sarah Johnson", avatar: "/woman-portrait.png", role: "Campaign Manager" },
      { id: "t3", name: "Emily Davis", role: "Video Producer" },
    ],
    tags: ["customer-stories", "testimonials"],
    color: "#f59e0b",
    createdAt: new Date(Date.now() - 86400000 * 35),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "5",
    name: "Webinar Promotion",
    description: "Campaign to drive registrations for upcoming product webinar",
    status: "paused",
    type: "traffic",
    startDate: new Date(Date.now() - 86400000 * 7),
    endDate: new Date(Date.now() + 86400000 * 3),
    budget: 3000,
    spent: 1200,
    platforms: ["linkedin", "twitter"],
    posts: 8,
    published: 5,
    goals: [
      { id: "g9", type: "clicks", target: 5000, current: 2100 },
    ],
    metrics: {
      impressions: 85000,
      reach: 52000,
      engagement: 3200,
      engagementRate: 3.76,
      clicks: 2100,
      ctr: 2.47,
      conversions: 280,
      conversionRate: 13.33,
      roi: 89,
      costPerClick: 0.57,
      costPerConversion: 4.29,
    },
    team: [
      { id: "t2", name: "Mike Chen", role: "Content Creator" },
    ],
    tags: ["webinar", "lead-gen"],
    color: "#8b5cf6",
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
]

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-500", icon: Edit3 },
  active: { label: "Active", color: "bg-green-500", icon: Play },
  paused: { label: "Paused", color: "bg-amber-500", icon: Pause },
  completed: { label: "Completed", color: "bg-blue-500", icon: CheckCircle2 },
  scheduled: { label: "Scheduled", color: "bg-purple-500", icon: Clock },
}

const typeConfig = {
  awareness: { label: "Awareness", color: "bg-blue-500/10 text-blue-600" },
  engagement: { label: "Engagement", color: "bg-pink-500/10 text-pink-600" },
  conversion: { label: "Conversion", color: "bg-green-500/10 text-green-600" },
  traffic: { label: "Traffic", color: "bg-amber-500/10 text-amber-600" },
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

export default function CampaignsPage() {
  usePageHeader({
    title: "Campaigns",
    icon: Target,
    subtitle: "Track and manage your marketing campaigns",
  })

  const [campaigns] = useState(mockCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesType = typeFilter === "all" || campaign.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const avgROI = campaigns.filter((c) => c.metrics.roi > 0).reduce((acc, c) => acc + c.metrics.roi, 0) / campaigns.filter((c) => c.metrics.roi > 0).length || 0

  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Stats Overview */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Campaigns</span>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
              <p className="text-xs text-muted-foreground mt-1">
                of {campaigns.length} total
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(totalSpent)} spent ({((totalSpent / totalBudget) * 100).toFixed(0)}%)
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Impressions</span>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {formatNumber(campaigns.reduce((acc, c) => acc + c.metrics.impressions, 0))}
              </p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3" />
                +18.5% from last month
              </div>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average ROI</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-green-600">{avgROI.toFixed(0)}%</p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                Above industry avg
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Campaign List */}
        <ScrollArea className="flex-1">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign) => {
              const status = statusConfig[campaign.status]
              const StatusIcon = status.icon
              const daysRemaining = differenceInDays(campaign.endDate, new Date())
              const budgetProgress = (campaign.spent / campaign.budget) * 100
              const postProgress = (campaign.published / campaign.posts) * 100

              return (
                <div
                  key={campaign.id}
                  className="p-5 rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: campaign.color + "20", color: campaign.color }}
                      >
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{campaign.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-[10px]", statusConfig[campaign.status].color, "text-white")}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[10px]", typeConfig[campaign.type].color)}>
                            {typeConfig[campaign.type].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {campaign.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                          </DropdownMenuItem>
                        ) : campaign.status === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume Campaign
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {campaign.description}
                  </p>

                  {/* Platforms & Timeline */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex -space-x-1">
                      {campaign.platforms.map((p) => (
                        <span
                          key={p}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background"
                        >
                          {getPlatformIcon(p)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      {campaign.status === "completed" ? (
                        "Ended " + format(campaign.endDate, "MMM d")
                      ) : daysRemaining > 0 ? (
                        `${daysRemaining} days left`
                      ) : daysRemaining === 0 ? (
                        "Ends today"
                      ) : (
                        `Starts ${format(campaign.startDate, "MMM d")}`
                      )}
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">
                          {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                        </span>
                      </div>
                      <Progress value={budgetProgress} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Posts</span>
                        <span className="font-medium">
                          {campaign.published} / {campaign.posts} published
                        </span>
                      </div>
                      <Progress value={postProgress} className="h-1.5" />
                    </div>
                  </div>

                  {/* Goals Progress */}
                  {campaign.goals.length > 0 && (
                    <div className="p-3 rounded-xl bg-muted/50 mb-4">
                      <p className="text-xs font-medium mb-2">Campaign Goals</p>
                      <div className="space-y-2">
                        {campaign.goals.slice(0, 2).map((goal) => {
                          const progress = (goal.current / goal.target) * 100
                          return (
                            <div key={goal.id} className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-0.5">
                                  <span className="capitalize text-muted-foreground">{goal.type}</span>
                                  <span className={cn(
                                    "font-medium",
                                    progress >= 100 ? "text-green-600" : progress >= 75 ? "text-amber-600" : "text-foreground"
                                  )}>
                                    {formatNumber(goal.current)} / {formatNumber(goal.target)}
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min(progress, 100)}
                                  className={cn("h-1", progress >= 100 && "[&>div]:bg-green-500")}
                                />
                              </div>
                              {progress >= 100 && (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{formatNumber(campaign.metrics.impressions)}</p>
                      <p className="text-[10px] text-muted-foreground">Impressions</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{campaign.metrics.engagementRate.toFixed(1)}%</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className={cn("text-lg font-bold", campaign.metrics.roi > 0 ? "text-green-600" : "text-muted-foreground")}>
                        {campaign.metrics.roi > 0 ? `+${campaign.metrics.roi}%` : "-"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">ROI</p>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex -space-x-2">
                      {campaign.team.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="w-7 h-7 border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {campaign.team.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                          +{campaign.team.length - 3}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </main>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Create New Campaign
            </DialogTitle>
            <DialogDescription>
              Set up a new marketing campaign to track your social media efforts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="e.g., Summer Product Launch 2024" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe your campaign objectives and strategy..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="10,000" className="pl-9" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {["twitter", "instagram", "facebook", "linkedin", "tiktok"].map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Rocket className="w-4 h-4" />
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Detail Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
          {selectedCampaign && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: selectedCampaign.color + "20", color: selectedCampaign.color }}
                    >
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <DialogTitle>{selectedCampaign.name}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn("text-xs", statusConfig[selectedCampaign.status].color, "text-white")}>
                          {statusConfig[selectedCampaign.status].label}
                        </Badge>
                        <Badge variant="outline" className={typeConfig[selectedCampaign.type].color}>
                          {typeConfig[selectedCampaign.type].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Full Report
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <div className="p-6 space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Total Reach</p>
                      <p className="text-2xl font-bold">{formatNumber(selectedCampaign.metrics.reach)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                      <p className="text-2xl font-bold">{selectedCampaign.metrics.engagementRate.toFixed(2)}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                      <p className="text-2xl font-bold">{formatNumber(selectedCampaign.metrics.conversions)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10">
                      <p className="text-sm text-muted-foreground mb-1">ROI</p>
                      <p className="text-2xl font-bold text-green-600">+{selectedCampaign.metrics.roi}%</p>
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Campaign Goals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCampaign.goals.map((goal) => {
                        const progress = (goal.current / goal.target) * 100
                        return (
                          <div key={goal.id} className="p-4 rounded-xl border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{goal.type}</span>
                              {progress >= 100 ? (
                                <Badge className="bg-green-500 text-white gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Achieved
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {progress.toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-2 mb-2" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Current: {formatNumber(goal.current)}</span>
                              <span>Target: {formatNumber(goal.target)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{formatNumber(selectedCampaign.metrics.impressions)}</p>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{formatNumber(selectedCampaign.metrics.clicks)}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{selectedCampaign.metrics.ctr.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">CTR</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">${selectedCampaign.metrics.costPerClick.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">CPC</p>
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Campaign Team
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedCampaign.team.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
