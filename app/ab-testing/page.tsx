"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
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
  FlaskConical,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Trophy,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Target,
  Users,
  Percent,
  Crown,
  Copy,
  Trash2,
  Edit3,
  RefreshCw,
  Settings,
  Info,
  Lightbulb,
  Scale,
  Flag,
  Split,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, differenceInHours } from "date-fns"

// Types
interface ABTest {
  id: string
  name: string
  status: "draft" | "running" | "completed" | "paused"
  platform: string
  variants: Variant[]
  winner?: string
  winningMetric: "engagement" | "clicks" | "conversions" | "reach"
  sampleSize: number
  currentSample: number
  confidenceLevel: number
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  autoSelectWinner: boolean
  minimumRunTime: number // hours
}

interface Variant {
  id: string
  name: string
  content: string
  image?: string
  hashtags?: string[]
  metrics: {
    impressions: number
    reach: number
    engagement: number
    engagementRate: number
    clicks: number
    ctr: number
    conversions: number
    shares: number
  }
  isWinner?: boolean
  confidence?: number
}

// Mock Data
const mockTests: ABTest[] = [
  {
    id: "1",
    name: "Product Launch - Caption Style",
    status: "running",
    platform: "instagram",
    variants: [
      {
        id: "v1",
        name: "Variant A - Emoji Heavy",
        content: "🚀🎉 BIG NEWS! Our new feature is HERE! 🔥💪\n\nGet ready to transform your workflow with AI-powered automation!\n\n✨ Save 10+ hours/week\n✨ Boost productivity by 300%\n✨ Works while you sleep\n\nTap the link in bio! 👆",
        metrics: {
          impressions: 45000,
          reach: 32000,
          engagement: 2850,
          engagementRate: 6.33,
          clicks: 890,
          ctr: 1.98,
          conversions: 45,
          shares: 120,
        },
        confidence: 78,
      },
      {
        id: "v2",
        name: "Variant B - Professional",
        content: "Introducing our latest innovation in workflow automation.\n\nKey benefits:\n• Save 10+ hours per week\n• Increase productivity by 300%\n• Automated background processing\n\nLearn more at the link in our bio.",
        metrics: {
          impressions: 44500,
          reach: 31000,
          engagement: 2100,
          engagementRate: 4.72,
          clicks: 1120,
          ctr: 2.52,
          conversions: 68,
          shares: 85,
        },
        isWinner: true,
        confidence: 92,
      },
    ],
    winningMetric: "conversions",
    sampleSize: 100000,
    currentSample: 89500,
    confidenceLevel: 95,
    startedAt: new Date(Date.now() - 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000 * 3),
    autoSelectWinner: true,
    minimumRunTime: 48,
  },
  {
    id: "2",
    name: "Weekly Tips - Image vs Carousel",
    status: "completed",
    platform: "instagram",
    variants: [
      {
        id: "v3",
        name: "Single Image",
        content: "💡 Pro Tip Tuesday!\n\nThe best time to post on Instagram? Between 11 AM - 1 PM on weekdays!\n\nSave this for later 📌",
        metrics: {
          impressions: 125000,
          reach: 89000,
          engagement: 8500,
          engagementRate: 6.80,
          clicks: 2100,
          ctr: 1.68,
          conversions: 180,
          shares: 450,
        },
      },
      {
        id: "v4",
        name: "5-Slide Carousel",
        content: "💡 Pro Tip Tuesday!\n\nSwipe for the BEST posting times for each platform →",
        metrics: {
          impressions: 128000,
          reach: 92000,
          engagement: 12400,
          engagementRate: 9.69,
          clicks: 3200,
          ctr: 2.50,
          conversions: 290,
          shares: 890,
        },
        isWinner: true,
        confidence: 99,
      },
    ],
    winner: "v4",
    winningMetric: "engagement",
    sampleSize: 250000,
    currentSample: 253000,
    confidenceLevel: 95,
    startedAt: new Date(Date.now() - 86400000 * 10),
    completedAt: new Date(Date.now() - 86400000 * 3),
    createdAt: new Date(Date.now() - 86400000 * 12),
    autoSelectWinner: true,
    minimumRunTime: 72,
  },
  {
    id: "3",
    name: "CTA Button Test - LinkedIn",
    status: "running",
    platform: "linkedin",
    variants: [
      {
        id: "v5",
        name: "Learn More CTA",
        content: "The future of social media management is here.\n\nOur AI-powered platform helps you:\n→ Schedule posts automatically\n→ Analyze competitor strategies\n→ Generate engaging content\n\nLearn more about how we can help your business grow.",
        metrics: {
          impressions: 28000,
          reach: 19500,
          engagement: 1450,
          engagementRate: 5.18,
          clicks: 680,
          ctr: 2.43,
          conversions: 42,
          shares: 65,
        },
        confidence: 65,
      },
      {
        id: "v6",
        name: "Start Free Trial CTA",
        content: "The future of social media management is here.\n\nOur AI-powered platform helps you:\n→ Schedule posts automatically\n→ Analyze competitor strategies\n→ Generate engaging content\n\nStart your free 14-day trial today. No credit card required.",
        metrics: {
          impressions: 27500,
          reach: 19000,
          engagement: 1380,
          engagementRate: 5.02,
          clicks: 820,
          ctr: 2.98,
          conversions: 58,
          shares: 52,
        },
        confidence: 72,
      },
    ],
    winningMetric: "clicks",
    sampleSize: 60000,
    currentSample: 55500,
    confidenceLevel: 95,
    startedAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000 * 2),
    autoSelectWinner: false,
    minimumRunTime: 48,
  },
  {
    id: "4",
    name: "Hashtag Strategy Test",
    status: "paused",
    platform: "twitter",
    variants: [
      {
        id: "v7",
        name: "3 Hashtags",
        content: "Your social media strategy needs this one thing: consistency.\n\nPost regularly. Engage authentically. Analyze results.\n\n#SocialMedia #Marketing #GrowthTips",
        metrics: {
          impressions: 15000,
          reach: 11000,
          engagement: 720,
          engagementRate: 4.80,
          clicks: 180,
          ctr: 1.20,
          conversions: 12,
          shares: 45,
        },
      },
      {
        id: "v8",
        name: "No Hashtags",
        content: "Your social media strategy needs this one thing: consistency.\n\nPost regularly. Engage authentically. Analyze results.\n\nWhat's your biggest challenge with staying consistent?",
        metrics: {
          impressions: 14500,
          reach: 10800,
          engagement: 890,
          engagementRate: 6.14,
          clicks: 145,
          ctr: 1.00,
          conversions: 8,
          shares: 62,
        },
      },
    ],
    winningMetric: "engagement",
    sampleSize: 50000,
    currentSample: 29500,
    confidenceLevel: 95,
    startedAt: new Date(Date.now() - 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 6),
    autoSelectWinner: true,
    minimumRunTime: 72,
  },
]

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-500", icon: Edit3 },
  running: { label: "Running", color: "bg-green-500", icon: Play },
  paused: { label: "Paused", color: "bg-amber-500", icon: Pause },
  completed: { label: "Completed", color: "bg-blue-500", icon: CheckCircle2 },
}

const metricLabels = {
  engagement: "Engagement",
  clicks: "Click-through Rate",
  conversions: "Conversions",
  reach: "Reach",
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

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

export default function ABTestingPage() {
  usePageHeader({
    title: "A/B Testing",
    subtitle: "Test and optimize content",
    icon: Split,
  });

  const [tests] = useState(mockTests)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    const matchesTab = activeTab === "all" || test.status === activeTab
    return matchesSearch && matchesStatus && matchesTab
  })

  const runningTests = tests.filter((t) => t.status === "running").length
  const completedTests = tests.filter((t) => t.status === "completed").length
  const avgConfidence = tests.filter((t) => t.status === "completed" && t.variants.some((v) => v.isWinner))
    .reduce((acc, t) => {
      const winner = t.variants.find((v) => v.isWinner)
      return acc + (winner?.confidence || 0)
    }, 0) / completedTests || 0

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats Overview */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Tests</span>
                <FlaskConical className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{runningTests}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Currently running
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completed Tests</span>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{completedTests}</p>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Confidence</span>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{avgConfidence.toFixed(0)}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                Above 95% target
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Insights Generated</span>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground mt-1">
                Actionable learnings
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
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
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Test List */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {filteredTests.map((test) => {
              const status = statusConfig[test.status]
              const StatusIcon = status.icon
              const progress = (test.currentSample / test.sampleSize) * 100
              const leadingVariant = [...test.variants].sort((a, b) => {
                switch (test.winningMetric) {
                  case "engagement": return b.metrics.engagementRate - a.metrics.engagementRate
                  case "clicks": return b.metrics.ctr - a.metrics.ctr
                  case "conversions": return b.metrics.conversions - a.metrics.conversions
                  case "reach": return b.metrics.reach - a.metrics.reach
                  default: return 0
                }
              })[0]

              return (
                <div
                  key={test.id}
                  className="p-5 rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTest(test)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FlaskConical className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{test.name}</h3>
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {getPlatformIcon(test.platform)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", status.color, "text-white")}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {test.variants.length} Variants
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Testing: {metricLabels[test.winningMetric]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          Edit Test
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {test.status === "running" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Test
                          </DropdownMenuItem>
                        ) : test.status === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume Test
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Sample Progress
                      </span>
                      <span className="font-medium">
                        {formatNumber(test.currentSample)} / {formatNumber(test.sampleSize)} ({progress.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Variants Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    {test.variants.map((variant, index) => {
                      const isLeading = variant.id === leadingVariant?.id && test.status !== "draft"
                      const metricValue = test.winningMetric === "engagement" ? variant.metrics.engagementRate
                        : test.winningMetric === "clicks" ? variant.metrics.ctr
                        : test.winningMetric === "conversions" ? variant.metrics.conversions
                        : variant.metrics.reach

                      return (
                        <div
                          key={variant.id}
                          className={cn(
                            "p-4 rounded-xl border relative",
                            variant.isWinner && "border-green-500 bg-green-500/5",
                            isLeading && !variant.isWinner && "border-primary/50 bg-primary/5"
                          )}
                        >
                          {/* Winner/Leading Badge */}
                          {variant.isWinner && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-green-500 text-white gap-1">
                                <Trophy className="w-3 h-3" />
                                Winner
                              </Badge>
                            </div>
                          )}
                          {isLeading && !variant.isWinner && test.status === "running" && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-primary text-white gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Leading
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                              index === 0 ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                            )}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="font-medium text-sm truncate">{variant.name}</span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {variant.content}
                          </p>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-lg font-bold">
                                {test.winningMetric === "engagement" || test.winningMetric === "clicks"
                                  ? `${metricValue.toFixed(2)}%`
                                  : formatNumber(metricValue)}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {metricLabels[test.winningMetric]}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-lg font-bold">
                                {formatNumber(variant.metrics.impressions)}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Impressions
                              </p>
                            </div>
                          </div>

                          {/* Confidence */}
                          {variant.confidence && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Confidence</span>
                                <span className={cn(
                                  "font-medium",
                                  variant.confidence >= 95 ? "text-green-600" :
                                  variant.confidence >= 80 ? "text-amber-600" : "text-muted-foreground"
                                )}>
                                  {variant.confidence}%
                                </span>
                              </div>
                              <Progress
                                value={variant.confidence}
                                className={cn(
                                  "h-1 mt-1",
                                  variant.confidence >= 95 && "[&>div]:bg-green-500"
                                )}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {test.startedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started {formatDistanceToNow(test.startedAt, { addSuffix: true })}
                        </span>
                      )}
                      {test.autoSelectWinner && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Auto-select winner
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      View Analysis
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Create Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Create A/B Test
            </DialogTitle>
            <DialogDescription>
              Test different versions of your content to find what works best
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input placeholder="e.g., Caption Style Test - Q4 Campaign" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Winning Metric</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">Engagement Rate</SelectItem>
                    <SelectItem value="clicks">Click-through Rate</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="reach">Reach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <Label>Variants</Label>
              <div className="space-y-4">
                {/* Variant A */}
                <div className="p-4 rounded-xl border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                    <Input placeholder="Variant name" className="flex-1" defaultValue="Variant A" />
                  </div>
                  <Textarea placeholder="Enter post content for Variant A..." className="min-h-[100px]" />
                </div>

                {/* Variant B */}
                <div className="p-4 rounded-xl border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                      B
                    </div>
                    <Input placeholder="Variant name" className="flex-1" defaultValue="Variant B" />
                  </div>
                  <Textarea placeholder="Enter post content for Variant B..." className="min-h-[100px]" />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Variant
              </Button>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <Label>Test Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Sample Size</Label>
                  <Input type="number" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Confidence Level</Label>
                  <Select defaultValue="95">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Auto-select Winner</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically select and apply the winning variant when confidence is reached
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              Start Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Detail Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
          {selectedTest && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      {selectedTest.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn("text-xs", statusConfig[selectedTest.status].color, "text-white")}>
                        {statusConfig[selectedTest.status].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Testing: {metricLabels[selectedTest.winningMetric]}
                      </span>
                    </div>
                  </div>
                  {selectedTest.status === "running" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Flag className="w-4 h-4" />
                      Declare Winner
                    </Button>
                  )}
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-100px)]">
                <div className="p-6 space-y-6">
                  {/* Detailed variant comparison */}
                  <div className="grid grid-cols-2 gap-6">
                    {selectedTest.variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className={cn(
                          "p-5 rounded-xl border",
                          variant.isWinner && "border-green-500 bg-green-500/5"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                            index === 0 ? "bg-blue-500" : "bg-purple-500"
                          )}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{variant.name}</h3>
                            {variant.isWinner && (
                              <Badge className="bg-green-500 text-white text-xs mt-1">
                                <Trophy className="w-3 h-3 mr-1" />
                                Winner
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 p-3 rounded-lg bg-muted/50">
                          {variant.content}
                        </p>

                        {/* All Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{formatNumber(variant.metrics.impressions)}</p>
                            <p className="text-xs text-muted-foreground">Impressions</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{formatNumber(variant.metrics.reach)}</p>
                            <p className="text-xs text-muted-foreground">Reach</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{variant.metrics.engagementRate.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground">Engagement Rate</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{variant.metrics.ctr.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground">CTR</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{formatNumber(variant.metrics.conversions)}</p>
                            <p className="text-xs text-muted-foreground">Conversions</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 text-center">
                            <p className="text-xl font-bold">{formatNumber(variant.metrics.shares)}</p>
                            <p className="text-xs text-muted-foreground">Shares</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Insights */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">AI Insights</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            Variant B shows a 35% higher conversion rate, suggesting the professional tone resonates better with your audience.
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            While Variant A has higher engagement, the clicks don't convert as well. Consider testing the emoji style with a stronger CTA.
                          </li>
                          <li className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            Recommendation: Use professional tone for conversion-focused posts and emoji-heavy content for awareness campaigns.
                          </li>
                        </ul>
                      </div>
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
