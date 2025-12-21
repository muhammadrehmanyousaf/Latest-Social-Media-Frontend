"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Search,
  Filter,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Check,
  X,
  Plus,
  Send,
  Bookmark,
  MoreHorizontal,
  ExternalLink,
  Mail,
  DollarSign,
  BarChart3,
  Sparkles,
  Crown,
  Verified,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  UserPlus,
  Handshake,
  Clock,
  Award,
  Target,
  Zap,
  Users,
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
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { format } from "date-fns"

type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "linkedin"
type InfluencerTier = "nano" | "micro" | "mid" | "macro" | "mega"
type CollaborationStatus = "available" | "in_talks" | "active" | "completed" | "declined"
type ViewMode = "grid" | "list"

interface Influencer {
  id: string
  name: string
  username: string
  avatar?: string
  bio: string
  location: string
  platforms: {
    platform: Platform
    username: string
    followers: number
    engagement: number
    verified: boolean
  }[]
  tier: InfluencerTier
  categories: string[]
  avgEngagement: number
  totalFollowers: number
  priceRange: { min: number; max: number }
  recentPosts: {
    id: string
    platform: Platform
    thumbnail?: string
    likes: number
    comments: number
  }[]
  metrics: {
    audienceQuality: number
    contentQuality: number
    brandFit: number
    responseRate: number
  }
  collaborationStatus: CollaborationStatus
  isSaved: boolean
  isContacted: boolean
  lastActive: Date
}

interface Campaign {
  id: string
  name: string
  status: "draft" | "active" | "completed"
  influencers: number
  budget: number
  reach: number
  startDate: Date
  endDate?: Date
}

// Mock Data
const mockInfluencers: Influencer[] = [
  {
    id: "inf_1",
    name: "Emma Rodriguez",
    username: "emmarod",
    bio: "Digital creator | Marketing enthusiast | Helping brands tell their stories 📱✨",
    location: "Los Angeles, CA",
    platforms: [
      { platform: "instagram", username: "emmarod", followers: 125000, engagement: 4.8, verified: true },
      { platform: "tiktok", username: "emmarod", followers: 89000, engagement: 6.2, verified: false },
      { platform: "youtube", username: "EmmaRodriguez", followers: 45000, engagement: 3.5, verified: false },
    ],
    tier: "mid",
    categories: ["Marketing", "Lifestyle", "Tech"],
    avgEngagement: 4.8,
    totalFollowers: 259000,
    priceRange: { min: 500, max: 2000 },
    recentPosts: [
      { id: "p1", platform: "instagram", likes: 5600, comments: 234 },
      { id: "p2", platform: "tiktok", likes: 12000, comments: 456 },
    ],
    metrics: { audienceQuality: 92, contentQuality: 88, brandFit: 95, responseRate: 85 },
    collaborationStatus: "available",
    isSaved: true,
    isContacted: false,
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: "inf_2",
    name: "James Chen",
    username: "jamestech",
    bio: "Tech reviewer | Gadget enthusiast | Making tech accessible for everyone 🎮💻",
    location: "San Francisco, CA",
    platforms: [
      { platform: "youtube", username: "JamesTechReviews", followers: 890000, engagement: 5.2, verified: true },
      { platform: "twitter", username: "jamestech", followers: 245000, engagement: 3.8, verified: true },
      { platform: "instagram", username: "jamestech", followers: 156000, engagement: 4.1, verified: true },
    ],
    tier: "macro",
    categories: ["Technology", "Reviews", "Gadgets"],
    avgEngagement: 4.4,
    totalFollowers: 1291000,
    priceRange: { min: 5000, max: 15000 },
    recentPosts: [
      { id: "p3", platform: "youtube", likes: 45000, comments: 2100 },
      { id: "p4", platform: "instagram", likes: 8900, comments: 345 },
    ],
    metrics: { audienceQuality: 95, contentQuality: 94, brandFit: 88, responseRate: 72 },
    collaborationStatus: "in_talks",
    isSaved: true,
    isContacted: true,
    lastActive: new Date(Date.now() - 7200000),
  },
  {
    id: "inf_3",
    name: "Sofia Martinez",
    username: "sofiafitness",
    bio: "Certified PT | Wellness advocate | Transform your life one day at a time 💪🌱",
    location: "Miami, FL",
    platforms: [
      { platform: "instagram", username: "sofiafitness", followers: 45000, engagement: 7.2, verified: false },
      { platform: "tiktok", username: "sofiafitness", followers: 78000, engagement: 8.5, verified: false },
    ],
    tier: "micro",
    categories: ["Fitness", "Health", "Lifestyle"],
    avgEngagement: 7.8,
    totalFollowers: 123000,
    priceRange: { min: 200, max: 800 },
    recentPosts: [
      { id: "p5", platform: "instagram", likes: 3200, comments: 189 },
      { id: "p6", platform: "tiktok", likes: 8900, comments: 567 },
    ],
    metrics: { audienceQuality: 88, contentQuality: 90, brandFit: 82, responseRate: 95 },
    collaborationStatus: "active",
    isSaved: false,
    isContacted: true,
    lastActive: new Date(),
  },
  {
    id: "inf_4",
    name: "Alex Turner",
    username: "alexcooks",
    bio: "Home chef | Recipe creator | Bringing restaurant quality to your kitchen 🍳👨‍🍳",
    location: "Chicago, IL",
    platforms: [
      { platform: "instagram", username: "alexcooks", followers: 8500, engagement: 9.2, verified: false },
      { platform: "tiktok", username: "alexcooks", followers: 12000, engagement: 11.5, verified: false },
    ],
    tier: "nano",
    categories: ["Food", "Cooking", "Lifestyle"],
    avgEngagement: 10.3,
    totalFollowers: 20500,
    priceRange: { min: 50, max: 200 },
    recentPosts: [
      { id: "p7", platform: "tiktok", likes: 1400, comments: 89 },
      { id: "p8", platform: "instagram", likes: 780, comments: 56 },
    ],
    metrics: { audienceQuality: 96, contentQuality: 85, brandFit: 78, responseRate: 100 },
    collaborationStatus: "available",
    isSaved: false,
    isContacted: false,
    lastActive: new Date(Date.now() - 86400000),
  },
  {
    id: "inf_5",
    name: "Olivia Park",
    username: "oliviastyle",
    bio: "Fashion & beauty creator | Sustainable style advocate | NYC based 👗💄",
    location: "New York, NY",
    platforms: [
      { platform: "instagram", username: "oliviastyle", followers: 2100000, engagement: 3.2, verified: true },
      { platform: "tiktok", username: "oliviastyle", followers: 1800000, engagement: 4.5, verified: true },
      { platform: "youtube", username: "OliviaStyleOfficial", followers: 890000, engagement: 2.8, verified: true },
    ],
    tier: "mega",
    categories: ["Fashion", "Beauty", "Lifestyle"],
    avgEngagement: 3.5,
    totalFollowers: 4790000,
    priceRange: { min: 25000, max: 75000 },
    recentPosts: [
      { id: "p9", platform: "instagram", likes: 67000, comments: 1200 },
      { id: "p10", platform: "tiktok", likes: 89000, comments: 2300 },
    ],
    metrics: { audienceQuality: 89, contentQuality: 96, brandFit: 72, responseRate: 45 },
    collaborationStatus: "declined",
    isSaved: true,
    isContacted: true,
    lastActive: new Date(Date.now() - 172800000),
  },
]

const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Summer Product Launch", status: "active", influencers: 8, budget: 25000, reach: 2500000, startDate: new Date(2024, 10, 1) },
  { id: "c2", name: "Holiday Campaign 2024", status: "draft", influencers: 3, budget: 15000, reach: 0, startDate: new Date(2024, 11, 15) },
  { id: "c3", name: "Q3 Brand Awareness", status: "completed", influencers: 12, budget: 45000, reach: 8500000, startDate: new Date(2024, 6, 1), endDate: new Date(2024, 8, 30) },
]

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: <Zap className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
}

const platformColors: Record<Platform, string> = {
  instagram: "text-pink-500",
  tiktok: "text-black dark:text-white",
  youtube: "text-red-500",
  twitter: "text-sky-500",
  linkedin: "text-blue-600",
}

const tierColors: Record<InfluencerTier, string> = {
  nano: "bg-gray-500/10 text-gray-500",
  micro: "bg-blue-500/10 text-blue-500",
  mid: "bg-purple-500/10 text-purple-500",
  macro: "bg-orange-500/10 text-orange-500",
  mega: "bg-yellow-500/10 text-yellow-600",
}

const tierLabels: Record<InfluencerTier, string> = {
  nano: "Nano (1K-10K)",
  micro: "Micro (10K-100K)",
  mid: "Mid-tier (100K-500K)",
  macro: "Macro (500K-1M)",
  mega: "Mega (1M+)",
}

const statusColors: Record<CollaborationStatus, string> = {
  available: "bg-green-500/10 text-green-500",
  in_talks: "bg-blue-500/10 text-blue-500",
  active: "bg-purple-500/10 text-purple-500",
  completed: "bg-gray-500/10 text-gray-500",
  declined: "bg-red-500/10 text-red-500",
}

export default function InfluencerDiscoveryPage() {
  usePageHeader({
    title: "Influencers",
    subtitle: "Find and collaborate with influencers",
    icon: Users,
  })

  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers)
  const [campaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [selectedTier, setSelectedTier] = useState<InfluencerTier | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState("discover")
  const [minEngagement, setMinEngagement] = useState([3])
  const [followerRange, setFollowerRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique categories
  const allCategories = Array.from(new Set(influencers.flatMap((i) => i.categories)))

  // Filter influencers
  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform =
      selectedPlatform === "all" ||
      influencer.platforms.some((p) => p.platform === selectedPlatform)
    const matchesTier = selectedTier === "all" || influencer.tier === selectedTier
    const matchesCategory =
      selectedCategory === "all" || influencer.categories.includes(selectedCategory)
    const matchesEngagement = influencer.avgEngagement >= minEngagement[0]
    return matchesSearch && matchesPlatform && matchesTier && matchesCategory && matchesEngagement
  })

  // Stats
  const stats = {
    total: influencers.length,
    saved: influencers.filter((i) => i.isSaved).length,
    contacted: influencers.filter((i) => i.isContacted).length,
    active: influencers.filter((i) => i.collaborationStatus === "active").length,
  }

  const toggleSaved = (id: string) => {
    setInfluencers(influencers.map((i) => (i.id === id ? { ...i, isSaved: !i.isSaved } : i)))
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Discovered</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Search className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="text-2xl font-bold">{stats.saved}</p>
                  </div>
                  <Bookmark className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Contacted</p>
                    <p className="text-2xl font-bold">{stats.contacted}</p>
                  </div>
                  <Send className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Collabs</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                  <Handshake className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="saved">
                  Saved
                  <Badge variant="secondary" className="ml-2">
                    {stats.saved}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="campaigns">
                  Campaigns
                  <Badge variant="secondary" className="ml-2">
                    {campaigns.filter((c) => c.status === "active").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="outreach">Outreach</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search influencers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-[220px]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
                      <Select
                        value={selectedPlatform}
                        onValueChange={(v) => setSelectedPlatform(v as Platform | "all")}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Tier</label>
                      <Select
                        value={selectedTier}
                        onValueChange={(v) => setSelectedTier(v as InfluencerTier | "all")}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="nano">Nano (1K-10K)</SelectItem>
                          <SelectItem value="micro">Micro (10K-100K)</SelectItem>
                          <SelectItem value="mid">Mid-tier (100K-500K)</SelectItem>
                          <SelectItem value="macro">Macro (500K-1M)</SelectItem>
                          <SelectItem value="mega">Mega (1M+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {allCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Min. Engagement: {minEngagement[0]}%
                      </label>
                      <Slider
                        value={minEngagement}
                        onValueChange={setMinEngagement}
                        min={0}
                        max={15}
                        step={0.5}
                        className="mt-3"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedPlatform("all")
                          setSelectedTier("all")
                          setSelectedCategory("all")
                          setMinEngagement([3])
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInfluencers.map((influencer) => (
                    <Card key={influencer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        {/* Header */}
                        <div className="p-4 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-lg font-semibold">
                                {influencer.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <h3 className="font-semibold truncate">{influencer.name}</h3>
                                {influencer.platforms.some((p) => p.verified) && (
                                  <Verified className="h-4 w-4 text-blue-500 fill-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {influencer.location}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 ${influencer.isSaved ? "text-yellow-500" : ""}`}
                              onClick={() => toggleSaved(influencer.id)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${influencer.isSaved ? "fill-current" : ""}`}
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="px-4 pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {influencer.bio}
                          </p>
                        </div>

                        {/* Platforms */}
                        <div className="px-4 pb-3">
                          <div className="flex flex-wrap gap-2">
                            {influencer.platforms.map((platform) => (
                              <div
                                key={platform.platform}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs"
                              >
                                <span className={platformColors[platform.platform]}>
                                  {platformIcons[platform.platform]}
                                </span>
                                <span>{formatFollowers(platform.followers)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="px-4 pb-3">
                          <div className="flex flex-wrap gap-1">
                            {influencer.categories.map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 px-4 pb-3">
                          <div className="text-center p-2 rounded-lg bg-muted/30">
                            <p className="text-lg font-bold">
                              {formatFollowers(influencer.totalFollowers)}
                            </p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/30">
                            <p className="text-lg font-bold">{influencer.avgEngagement}%</p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/30">
                            <p className="text-lg font-bold">
                              ${influencer.priceRange.min >= 1000
                                ? `${(influencer.priceRange.min / 1000).toFixed(0)}K`
                                : influencer.priceRange.min}
                            </p>
                            <p className="text-xs text-muted-foreground">From</p>
                          </div>
                        </div>

                        {/* Quality Scores */}
                        <div className="px-4 pb-3">
                          <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div>
                              <p className={`font-bold ${getScoreColor(influencer.metrics.audienceQuality)}`}>
                                {influencer.metrics.audienceQuality}
                              </p>
                              <p className="text-muted-foreground">Audience</p>
                            </div>
                            <div>
                              <p className={`font-bold ${getScoreColor(influencer.metrics.contentQuality)}`}>
                                {influencer.metrics.contentQuality}
                              </p>
                              <p className="text-muted-foreground">Content</p>
                            </div>
                            <div>
                              <p className={`font-bold ${getScoreColor(influencer.metrics.brandFit)}`}>
                                {influencer.metrics.brandFit}
                              </p>
                              <p className="text-muted-foreground">Brand Fit</p>
                            </div>
                            <div>
                              <p className={`font-bold ${getScoreColor(influencer.metrics.responseRate)}`}>
                                {influencer.metrics.responseRate}%
                              </p>
                              <p className="text-muted-foreground">Response</p>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={tierColors[influencer.tier]}>
                              {influencer.tier.charAt(0).toUpperCase() + influencer.tier.slice(1)}
                            </Badge>
                            <Badge className={statusColors[influencer.collaborationStatus]}>
                              {influencer.collaborationStatus.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Link href="/inbox">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Add to Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Outreach
                                </DropdownMenuItem>
                                <Link href="/ai-assistant">
                                  <DropdownMenuItem>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    AI Outreach Message
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Full Profile
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-350px)]">
                      <div className="divide-y">
                        {filteredInfluencers.map((influencer) => (
                          <div
                            key={influencer.id}
                            className="p-4 hover:bg-muted/50 transition-colors flex items-center gap-4"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-lg font-semibold">
                                {influencer.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{influencer.name}</h3>
                                {influencer.platforms.some((p) => p.verified) && (
                                  <Verified className="h-4 w-4 text-blue-500 fill-blue-500" />
                                )}
                                <Badge className={tierColors[influencer.tier]}>
                                  {influencer.tier}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <p className="font-bold">
                                  {formatFollowers(influencer.totalFollowers)}
                                </p>
                                <p className="text-xs text-muted-foreground">Followers</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold">{influencer.avgEngagement}%</p>
                                <p className="text-xs text-muted-foreground">Engagement</p>
                              </div>
                              <div className="flex gap-1">
                                {influencer.platforms.slice(0, 3).map((p) => (
                                  <span key={p.platform} className={platformColors[p.platform]}>
                                    {platformIcons[p.platform]}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <Badge className={statusColors[influencer.collaborationStatus]}>
                              {influencer.collaborationStatus.replace("_", " ")}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${influencer.isSaved ? "text-yellow-500" : ""}`}
                                onClick={() => toggleSaved(influencer.id)}
                              >
                                <Bookmark
                                  className={`h-4 w-4 ${influencer.isSaved ? "fill-current" : ""}`}
                                />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Send className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInfluencers
                  .filter((i) => i.isSaved)
                  .map((influencer) => (
                    <Card key={influencer.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          {influencer.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{influencer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatFollowers(influencer.totalFollowers)} followers
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-500"
                          onClick={() => toggleSaved(influencer.id)}
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns">
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              campaign.status === "active"
                                ? "bg-green-500/10"
                                : campaign.status === "draft"
                                ? "bg-yellow-500/10"
                                : "bg-gray-500/10"
                            }`}
                          >
                            <Target
                              className={`h-6 w-6 ${
                                campaign.status === "active"
                                  ? "text-green-500"
                                  : campaign.status === "draft"
                                  ? "text-yellow-500"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(campaign.startDate, "MMM d, yyyy")}
                              {campaign.endDate && ` - ${format(campaign.endDate, "MMM d, yyyy")}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="font-bold">{campaign.influencers}</p>
                            <p className="text-xs text-muted-foreground">Influencers</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">${(campaign.budget / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-muted-foreground">Budget</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">
                              {campaign.reach > 0 ? `${(campaign.reach / 1000000).toFixed(1)}M` : "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">Reach</p>
                          </div>
                          <Badge
                            className={
                              campaign.status === "active"
                                ? "bg-green-500/10 text-green-500"
                                : campaign.status === "draft"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-gray-500/10 text-gray-500"
                            }
                          >
                            {campaign.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Campaign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Outreach Tab */}
            <TabsContent value="outreach">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Outreach Center</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage all your influencer communications in one place
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link href="/inbox">
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Inbox
                      </Button>
                    </Link>
                    <Link href="/ai-assistant">
                      <Button variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Message Generator
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
  )
}
