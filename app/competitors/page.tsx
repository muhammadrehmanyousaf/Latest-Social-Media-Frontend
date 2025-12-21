"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Target,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  MoreHorizontal,
  ExternalLink,
  Download,
  RefreshCw,
  Trash2,
  Edit,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Medal,
  Crown,
  Swords,
  Activity,
  Calendar,
  Filter,
  Settings,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Progress } from "@/components/ui/progress"
import NextLink from "next/link"
import { format, formatDistanceToNow } from "date-fns"

type Platform = "instagram" | "twitter" | "linkedin" | "facebook" | "youtube" | "tiktok"

interface CompetitorPlatform {
  platform: Platform
  username: string
  followers: number
  followerGrowth: number
  engagement: number
  engagementGrowth: number
  posts30d: number
  avgLikes: number
  avgComments: number
  verified: boolean
  lastPost: Date
}

interface Competitor {
  id: string
  name: string
  website: string
  logo?: string
  description: string
  industry: string
  platforms: CompetitorPlatform[]
  totalFollowers: number
  avgEngagement: number
  overallScore: number
  isTracking: boolean
  addedAt: Date
  lastUpdated: Date
  alerts: {
    enabled: boolean
    threshold: number
  }
}

interface ContentAnalysis {
  id: string
  competitorId: string
  platform: Platform
  postUrl: string
  content: string
  engagement: number
  likes: number
  comments: number
  shares: number
  postedAt: Date
  contentType: "image" | "video" | "carousel" | "text"
  hashtags: string[]
  sentiment: "positive" | "neutral" | "negative"
}

interface BenchmarkMetric {
  metric: string
  yourValue: number
  industryAvg: number
  topPerformer: number
  rank: number
  trend: "up" | "down" | "stable"
}

// Mock Data
const mockCompetitors: Competitor[] = [
  {
    id: "c1",
    name: "Hootsuite",
    website: "hootsuite.com",
    description: "Social media management platform for businesses",
    industry: "Social Media Management",
    platforms: [
      { platform: "instagram", username: "hootsuite", followers: 285000, followerGrowth: 2.3, engagement: 3.2, engagementGrowth: -0.5, posts30d: 45, avgLikes: 4500, avgComments: 120, verified: true, lastPost: new Date(Date.now() - 86400000) },
      { platform: "twitter", username: "hootsuite", followers: 420000, followerGrowth: 1.8, engagement: 2.1, engagementGrowth: 0.3, posts30d: 120, avgLikes: 890, avgComments: 45, verified: true, lastPost: new Date(Date.now() - 3600000) },
      { platform: "linkedin", username: "hootsuite", followers: 180000, followerGrowth: 3.5, engagement: 4.5, engagementGrowth: 1.2, posts30d: 30, avgLikes: 2200, avgComments: 85, verified: true, lastPost: new Date(Date.now() - 172800000) },
    ],
    totalFollowers: 885000,
    avgEngagement: 3.3,
    overallScore: 82,
    isTracking: true,
    addedAt: new Date(2024, 3, 15),
    lastUpdated: new Date(Date.now() - 3600000),
    alerts: { enabled: true, threshold: 10 },
  },
  {
    id: "c2",
    name: "Buffer",
    website: "buffer.com",
    description: "Social media toolkit for small businesses",
    industry: "Social Media Management",
    platforms: [
      { platform: "instagram", username: "buffer", followers: 145000, followerGrowth: 3.1, engagement: 4.8, engagementGrowth: 0.8, posts30d: 38, avgLikes: 5200, avgComments: 180, verified: true, lastPost: new Date(Date.now() - 43200000) },
      { platform: "twitter", username: "buffer", followers: 320000, followerGrowth: 1.2, engagement: 2.8, engagementGrowth: -0.2, posts30d: 95, avgLikes: 650, avgComments: 35, verified: true, lastPost: new Date(Date.now() - 7200000) },
      { platform: "linkedin", username: "buffer", followers: 95000, followerGrowth: 4.2, engagement: 5.2, engagementGrowth: 1.5, posts30d: 25, avgLikes: 1800, avgComments: 95, verified: true, lastPost: new Date(Date.now() - 86400000) },
    ],
    totalFollowers: 560000,
    avgEngagement: 4.3,
    overallScore: 78,
    isTracking: true,
    addedAt: new Date(2024, 4, 1),
    lastUpdated: new Date(Date.now() - 7200000),
    alerts: { enabled: true, threshold: 15 },
  },
  {
    id: "c3",
    name: "Sprout Social",
    website: "sproutsocial.com",
    description: "Enterprise social media management",
    industry: "Social Media Management",
    platforms: [
      { platform: "instagram", username: "sproutsocial", followers: 125000, followerGrowth: 2.8, engagement: 3.9, engagementGrowth: 0.4, posts30d: 42, avgLikes: 3800, avgComments: 95, verified: true, lastPost: new Date(Date.now() - 129600000) },
      { platform: "twitter", username: "sproutsocial", followers: 195000, followerGrowth: 2.1, engagement: 2.5, engagementGrowth: 0.1, posts30d: 85, avgLikes: 520, avgComments: 28, verified: true, lastPost: new Date(Date.now() - 14400000) },
      { platform: "linkedin", username: "sprout-social", followers: 220000, followerGrowth: 5.2, engagement: 5.8, engagementGrowth: 2.1, posts30d: 35, avgLikes: 4500, avgComments: 150, verified: true, lastPost: new Date(Date.now() - 259200000) },
    ],
    totalFollowers: 540000,
    avgEngagement: 4.1,
    overallScore: 85,
    isTracking: true,
    addedAt: new Date(2024, 5, 10),
    lastUpdated: new Date(Date.now() - 14400000),
    alerts: { enabled: false, threshold: 10 },
  },
  {
    id: "c4",
    name: "Later",
    website: "later.com",
    description: "Visual social marketing platform",
    industry: "Social Media Management",
    platforms: [
      { platform: "instagram", username: "latermedia", followers: 520000, followerGrowth: 4.5, engagement: 5.2, engagementGrowth: 1.8, posts30d: 55, avgLikes: 12000, avgComments: 380, verified: true, lastPost: new Date(Date.now() - 21600000) },
      { platform: "tiktok", username: "latermedia", followers: 180000, followerGrowth: 12.5, engagement: 8.5, engagementGrowth: 3.2, posts30d: 25, avgLikes: 15000, avgComments: 450, verified: false, lastPost: new Date(Date.now() - 43200000) },
    ],
    totalFollowers: 700000,
    avgEngagement: 6.9,
    overallScore: 88,
    isTracking: true,
    addedAt: new Date(2024, 6, 20),
    lastUpdated: new Date(Date.now() - 21600000),
    alerts: { enabled: true, threshold: 20 },
  },
]

const mockTopContent: ContentAnalysis[] = [
  { id: "p1", competitorId: "c4", platform: "instagram", postUrl: "#", content: "🎉 Big announcement! We're launching new AI features...", engagement: 15200, likes: 12000, comments: 380, shares: 2820, postedAt: new Date(Date.now() - 172800000), contentType: "carousel", hashtags: ["socialmedia", "ai", "marketing"], sentiment: "positive" },
  { id: "p2", competitorId: "c2", platform: "instagram", postUrl: "#", content: "5 tips to boost your engagement this holiday season...", engagement: 8500, likes: 5200, comments: 180, shares: 3120, postedAt: new Date(Date.now() - 259200000), contentType: "carousel", hashtags: ["tips", "engagement", "holidays"], sentiment: "positive" },
  { id: "p3", competitorId: "c1", platform: "linkedin", postUrl: "#", content: "The future of social media management is here...", engagement: 6800, likes: 2200, comments: 85, shares: 4515, postedAt: new Date(Date.now() - 345600000), contentType: "image", hashtags: ["future", "socialmedia"], sentiment: "positive" },
]

const mockBenchmarks: BenchmarkMetric[] = [
  { metric: "Total Followers", yourValue: 259000, industryAvg: 520000, topPerformer: 885000, rank: 4, trend: "up" },
  { metric: "Engagement Rate", yourValue: 4.8, industryAvg: 3.8, topPerformer: 6.9, rank: 2, trend: "up" },
  { metric: "Posts per Month", yourValue: 45, industryAvg: 55, topPerformer: 120, rank: 3, trend: "stable" },
  { metric: "Follower Growth", yourValue: 5.2, industryAvg: 3.5, topPerformer: 12.5, rank: 2, trend: "up" },
  { metric: "Response Rate", yourValue: 92, industryAvg: 78, topPerformer: 95, rank: 2, trend: "up" },
  { metric: "Content Score", yourValue: 85, industryAvg: 72, topPerformer: 88, rank: 2, trend: "stable" },
]

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <Zap className="h-4 w-4" />,
}

const platformColors: Record<Platform, string> = {
  instagram: "text-pink-500",
  twitter: "text-sky-500",
  linkedin: "text-blue-600",
  facebook: "text-blue-500",
  youtube: "text-red-500",
  tiktok: "text-black dark:text-white",
}

export default function CompetitorsPage() {
  usePageHeader({
    title: "Competitor Analysis",
    icon: Users,
    subtitle: "Track and analyze competitors",
  })

  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors)
  const [topContent] = useState<ContentAnalysis[]>(mockTopContent)
  const [benchmarks] = useState<BenchmarkMetric[]>(mockBenchmarks)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Stats
  const stats = {
    tracked: competitors.filter((c) => c.isTracking).length,
    totalFollowers: competitors.reduce((sum, c) => sum + c.totalFollowers, 0),
    avgEngagement: (competitors.reduce((sum, c) => sum + c.avgEngagement, 0) / competitors.length).toFixed(1),
    yourRank: 3,
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-bold">#{rank}</span>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking</p>
                    <p className="text-2xl font-bold">{stats.tracked}</p>
                    <p className="text-xs text-muted-foreground">competitors</p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Combined Followers</p>
                    <p className="text-2xl font-bold">{formatNumber(stats.totalFollowers)}</p>
                    <p className="text-xs text-green-500">+4.2% avg growth</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Industry Avg Engagement</p>
                    <p className="text-2xl font-bold">{stats.avgEngagement}%</p>
                    <p className="text-xs text-green-500">You: 4.8% (+1.0%)</p>
                  </div>
                  <Heart className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold">#{stats.yourRank}</p>
                    <p className="text-xs text-green-500">Up 2 positions</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
                <TabsTrigger value="content">Top Content</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search competitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-[200px]"
                  />
                </div>
                <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as Platform | "all")}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leaderboard */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Competitive Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Your position */}
                      <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            #3
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Your Brand (SocialFlow)</h3>
                              <Badge className="bg-primary/10 text-primary">You</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              259K followers · 4.8% engagement
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">86</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Competitors */}
                      {[...competitors]
                        .sort((a, b) => b.overallScore - a.overallScore)
                        .map((competitor, index) => (
                          <div
                            key={competitor.id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {getRankBadge(index + 1 >= 3 ? index + 2 : index + 1)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{competitor.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(competitor.totalFollowers)} followers ·{" "}
                                {competitor.avgEngagement}% engagement
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {competitor.platforms.slice(0, 3).map((p) => (
                                <span key={p.platform} className={platformColors[p.platform]}>
                                  {platformIcons[p.platform]}
                                </span>
                              ))}
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getScoreColor(competitor.overallScore)}`}>
                                {competitor.overallScore}
                              </p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Insights */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Quick Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Outperforming on Engagement</p>
                          <p className="text-xs text-muted-foreground">
                            Your engagement rate is 26% above industry average
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Growth Opportunity</p>
                          <p className="text-xs text-muted-foreground">
                            Later is growing 12.5% on TikTok. Consider this platform.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Content Insight</p>
                          <p className="text-xs text-muted-foreground">
                            Carousel posts perform 2x better for your competitors
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-3">
                          {competitors.slice(0, 4).map((c) => (
                            <div key={c.id} className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                {c.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">
                                  <span className="font-medium">{c.name}</span> posted on Instagram
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(c.lastUpdated, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Competitors Tab */}
            <TabsContent value="competitors" className="space-y-4">
              <div className="grid gap-4">
                {competitors.map((competitor) => (
                  <Card key={competitor.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-lg font-bold">
                            {competitor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{competitor.name}</h3>
                              <Badge variant="outline">{competitor.industry}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {competitor.description}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Globe className="h-3 w-3" />
                              <a href={`https://${competitor.website}`} target="_blank" className="hover:underline">
                                {competitor.website}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <p className={`text-2xl font-bold ${getScoreColor(competitor.overallScore)}`}>
                              {competitor.overallScore}
                            </p>
                            <p className="text-xs text-muted-foreground">Overall Score</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell className="h-4 w-4 mr-2" />
                                Configure Alerts
                              </DropdownMenuItem>
                              <NextLink href="/reports">
                                <DropdownMenuItem>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Generate Report
                                </DropdownMenuItem>
                              </NextLink>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Platform Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {competitor.platforms.map((platform) => (
                          <div
                            key={platform.platform}
                            className="p-4 rounded-lg bg-muted/30 border"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className={platformColors[platform.platform]}>
                                  {platformIcons[platform.platform]}
                                </span>
                                <span className="font-medium capitalize">{platform.platform}</span>
                                {platform.verified && (
                                  <CheckCircle className="h-3 w-3 text-blue-500 fill-blue-500" />
                                )}
                              </div>
                              <a href="#" className="text-muted-foreground hover:text-foreground">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Followers</p>
                                <p className="font-semibold">{formatNumber(platform.followers)}</p>
                                <p className={`text-xs ${platform.followerGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                  {platform.followerGrowth >= 0 ? "+" : ""}{platform.followerGrowth}%
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Engagement</p>
                                <p className="font-semibold">{platform.engagement}%</p>
                                <p className={`text-xs ${platform.engagementGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                  {platform.engagementGrowth >= 0 ? "+" : ""}{platform.engagementGrowth}%
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Posts/30d</p>
                                <p className="font-semibold">{platform.posts30d}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Avg Likes</p>
                                <p className="font-semibold">{formatNumber(platform.avgLikes)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Benchmarks Tab */}
            <TabsContent value="benchmarks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Benchmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {benchmarks.map((benchmark) => (
                      <div key={benchmark.metric} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{benchmark.metric}</span>
                            {getTrendIcon(benchmark.trend)}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Industry: {benchmark.industryAvg.toLocaleString()}{benchmark.metric.includes("Rate") || benchmark.metric.includes("Score") ? "%" : ""}
                            </span>
                            <span className="text-muted-foreground">
                              Top: {benchmark.topPerformer.toLocaleString()}{benchmark.metric.includes("Rate") || benchmark.metric.includes("Score") ? "%" : ""}
                            </span>
                            <div className="flex items-center gap-1">
                              {getRankBadge(benchmark.rank)}
                              <span className="text-xs text-muted-foreground">of 5</span>
                            </div>
                          </div>
                        </div>
                        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-primary/20 rounded-full"
                            style={{
                              width: `${(benchmark.industryAvg / benchmark.topPerformer) * 100}%`,
                            }}
                          />
                          <div
                            className="absolute h-full bg-primary rounded-full"
                            style={{
                              width: `${(benchmark.yourValue / benchmark.topPerformer) * 100}%`,
                            }}
                          />
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-green-500"
                            style={{
                              left: `${(benchmark.topPerformer / benchmark.topPerformer) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold">
                            Your value: {benchmark.yourValue.toLocaleString()}{benchmark.metric.includes("Rate") || benchmark.metric.includes("Score") ? "%" : ""}
                          </span>
                          <span className={benchmark.yourValue >= benchmark.industryAvg ? "text-green-500" : "text-red-500"}>
                            {benchmark.yourValue >= benchmark.industryAvg ? "Above" : "Below"} average
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4">
                {topContent.map((content, index) => {
                  const competitor = competitors.find((c) => c.id === content.competitorId)
                  return (
                    <Card key={content.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{competitor?.name}</span>
                              <span className={platformColors[content.platform]}>
                                {platformIcons[content.platform]}
                              </span>
                              <Badge variant="outline">{content.contentType}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(content.postedAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm mb-3">{content.content}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {formatNumber(content.likes)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {formatNumber(content.comments)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                {formatNumber(content.shares)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-4 w-4" />
                                {formatNumber(content.engagement)} total
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {content.hashtags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Competitor Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map((competitor) => (
                      <div
                        key={competitor.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                            {competitor.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{competitor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Alert when growth exceeds {competitor.alerts.threshold}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={competitor.alerts.enabled ? "default" : "secondary"}
                          >
                            {competitor.alerts.enabled ? "Active" : "Disabled"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights CTA */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">AI Competitive Intelligence</h3>
                      <p className="text-sm text-muted-foreground">
                        Get AI-powered insights on competitor strategies, content gaps, and opportunities.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <NextLink href="/ai-assistant">
                        <Button>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze with AI
                        </Button>
                      </NextLink>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
