"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Search,
  Headphones,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Plus,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Hash,
  AtSign,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Users,
  Zap,
  ExternalLink,
  Bookmark,
  Flag,
  MoreHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
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
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"

type Platform = "twitter" | "instagram" | "linkedin" | "facebook" | "reddit" | "news"
type Sentiment = "positive" | "negative" | "neutral"
type MentionType = "brand" | "keyword" | "hashtag" | "competitor"

interface Mention {
  id: string
  platform: Platform
  type: MentionType
  author: {
    name: string
    username: string
    avatar?: string
    followers: number
    verified: boolean
  }
  content: string
  sentiment: Sentiment
  sentimentScore: number
  engagement: {
    likes: number
    comments: number
    shares: number
    reach: number
  }
  matchedKeywords: string[]
  timestamp: Date
  url: string
  isBookmarked: boolean
  isFlagged: boolean
  isRead: boolean
}

interface TrackedKeyword {
  id: string
  keyword: string
  type: MentionType
  mentions24h: number
  mentionsTrend: number
  sentiment: Sentiment
  isActive: boolean
  alertsEnabled: boolean
}

interface TrendingTopic {
  id: string
  topic: string
  mentions: number
  growth: number
  sentiment: Sentiment
  platforms: Platform[]
}

// Mock Data
const mockKeywords: TrackedKeyword[] = [
  { id: "1", keyword: "SocialFlow", type: "brand", mentions24h: 245, mentionsTrend: 12, sentiment: "positive", isActive: true, alertsEnabled: true },
  { id: "2", keyword: "#SocialMediaMarketing", type: "hashtag", mentions24h: 1520, mentionsTrend: -5, sentiment: "neutral", isActive: true, alertsEnabled: false },
  { id: "3", keyword: "social media management", type: "keyword", mentions24h: 3200, mentionsTrend: 8, sentiment: "neutral", isActive: true, alertsEnabled: true },
  { id: "4", keyword: "@socialflow", type: "brand", mentions24h: 89, mentionsTrend: 25, sentiment: "positive", isActive: true, alertsEnabled: true },
  { id: "5", keyword: "Hootsuite", type: "competitor", mentions24h: 890, mentionsTrend: -2, sentiment: "neutral", isActive: true, alertsEnabled: false },
  { id: "6", keyword: "Buffer", type: "competitor", mentions24h: 650, mentionsTrend: 3, sentiment: "positive", isActive: true, alertsEnabled: false },
]

const mockMentions: Mention[] = [
  {
    id: "m1",
    platform: "twitter",
    type: "brand",
    author: { name: "Sarah Marketing", username: "sarahmarketing", followers: 15200, verified: true },
    content: "Just switched to @SocialFlow for our agency and wow! The AI features are incredible. Saved us 10+ hours this week on content creation. Highly recommend! 🚀 #SocialMediaMarketing",
    sentiment: "positive",
    sentimentScore: 0.92,
    engagement: { likes: 234, comments: 45, shares: 67, reach: 12500 },
    matchedKeywords: ["SocialFlow", "@socialflow", "#SocialMediaMarketing"],
    timestamp: new Date(Date.now() - 1800000),
    url: "https://twitter.com/sarahmarketing/status/123",
    isBookmarked: true,
    isFlagged: false,
    isRead: true,
  },
  {
    id: "m2",
    platform: "linkedin",
    type: "keyword",
    author: { name: "Michael Chen", username: "michaelchen", followers: 8500, verified: false },
    content: "The landscape of social media management is evolving rapidly. Tools that integrate AI for content suggestions are becoming essential. What's your go-to platform?",
    sentiment: "neutral",
    sentimentScore: 0.5,
    engagement: { likes: 89, comments: 34, shares: 12, reach: 4200 },
    matchedKeywords: ["social media management"],
    timestamp: new Date(Date.now() - 3600000),
    url: "https://linkedin.com/posts/123",
    isBookmarked: false,
    isFlagged: false,
    isRead: true,
  },
  {
    id: "m3",
    platform: "twitter",
    type: "competitor",
    author: { name: "Digital Dave", username: "digitaldave", followers: 22000, verified: true },
    content: "Comparing Hootsuite vs Buffer vs SocialFlow for our team. SocialFlow's unified inbox is a game-changer for agencies managing multiple clients.",
    sentiment: "positive",
    sentimentScore: 0.78,
    engagement: { likes: 156, comments: 78, shares: 45, reach: 18000 },
    matchedKeywords: ["Hootsuite", "Buffer", "SocialFlow"],
    timestamp: new Date(Date.now() - 7200000),
    url: "https://twitter.com/digitaldave/status/456",
    isBookmarked: true,
    isFlagged: false,
    isRead: false,
  },
  {
    id: "m4",
    platform: "instagram",
    type: "hashtag",
    author: { name: "Marketing Pro", username: "marketingpro", followers: 45000, verified: true },
    content: "5 tips for crushing your social media strategy in 2025! 📱✨ #SocialMediaMarketing #DigitalMarketing #ContentStrategy",
    sentiment: "positive",
    sentimentScore: 0.85,
    engagement: { likes: 1234, comments: 89, shares: 234, reach: 35000 },
    matchedKeywords: ["#SocialMediaMarketing"],
    timestamp: new Date(Date.now() - 10800000),
    url: "https://instagram.com/p/123",
    isBookmarked: false,
    isFlagged: false,
    isRead: true,
  },
  {
    id: "m5",
    platform: "twitter",
    type: "brand",
    author: { name: "Frustrated User", username: "techuser99", followers: 500, verified: false },
    content: "Having issues with SocialFlow's scheduling feature. Posts not going out on time. Anyone else experiencing this? @socialflow support?",
    sentiment: "negative",
    sentimentScore: 0.25,
    engagement: { likes: 12, comments: 8, shares: 2, reach: 800 },
    matchedKeywords: ["SocialFlow", "@socialflow"],
    timestamp: new Date(Date.now() - 14400000),
    url: "https://twitter.com/techuser99/status/789",
    isBookmarked: false,
    isFlagged: true,
    isRead: false,
  },
  {
    id: "m6",
    platform: "reddit",
    type: "keyword",
    author: { name: "u/socialmediamanager", username: "socialmediamanager", followers: 0, verified: false },
    content: "Looking for recommendations on social media management tools for a small business. Budget is around $50/month. Need scheduling, analytics, and multi-platform support.",
    sentiment: "neutral",
    sentimentScore: 0.5,
    engagement: { likes: 45, comments: 67, shares: 0, reach: 2500 },
    matchedKeywords: ["social media management"],
    timestamp: new Date(Date.now() - 18000000),
    url: "https://reddit.com/r/socialmedia/123",
    isBookmarked: false,
    isFlagged: false,
    isRead: true,
  },
]

const mockTrending: TrendingTopic[] = [
  { id: "t1", topic: "AI Content Creation", mentions: 45000, growth: 234, sentiment: "positive", platforms: ["twitter", "linkedin"] },
  { id: "t2", topic: "Social Commerce 2025", mentions: 32000, growth: 156, sentiment: "positive", platforms: ["instagram", "facebook", "twitter"] },
  { id: "t3", topic: "Creator Economy", mentions: 28000, growth: 89, sentiment: "neutral", platforms: ["twitter", "linkedin", "instagram"] },
  { id: "t4", topic: "Platform Algorithm Changes", mentions: 18000, growth: 312, sentiment: "negative", platforms: ["twitter"] },
  { id: "t5", topic: "Video First Strategy", mentions: 15000, growth: 67, sentiment: "positive", platforms: ["instagram", "facebook"] },
]

const platformIcons: Record<Platform, React.ReactNode> = {
  twitter: <Twitter className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  reddit: <Globe className="h-4 w-4" />,
  news: <Globe className="h-4 w-4" />,
}

const platformColors: Record<Platform, string> = {
  twitter: "text-sky-500",
  instagram: "text-pink-500",
  linkedin: "text-blue-600",
  facebook: "text-blue-500",
  reddit: "text-orange-500",
  news: "text-gray-500",
}

export default function SocialListeningPage() {
  usePageHeader({
    title: "Social Listening",
    subtitle: "Monitor brand mentions and keywords",
    icon: Headphones,
  })

  const [keywords, setKeywords] = useState<TrackedKeyword[]>(mockKeywords)
  const [mentions, setMentions] = useState<Mention[]>(mockMentions)
  const [trending] = useState<TrendingTopic[]>(mockTrending)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">("all")
  const [selectedType, setSelectedType] = useState<MentionType | "all">("all")
  const [activeTab, setActiveTab] = useState("mentions")
  const [newKeyword, setNewKeyword] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter mentions
  const filteredMentions = mentions.filter((mention) => {
    const matchesSearch = mention.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mention.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === "all" || mention.platform === selectedPlatform
    const matchesSentiment = selectedSentiment === "all" || mention.sentiment === selectedSentiment
    const matchesType = selectedType === "all" || mention.type === selectedType
    return matchesSearch && matchesPlatform && matchesSentiment && matchesType
  })

  // Stats
  const stats = {
    totalMentions: mentions.length,
    positiveMentions: mentions.filter((m) => m.sentiment === "positive").length,
    negativeMentions: mentions.filter((m) => m.sentiment === "negative").length,
    totalReach: mentions.reduce((sum, m) => sum + m.engagement.reach, 0),
    avgSentiment: mentions.reduce((sum, m) => sum + m.sentimentScore, 0) / mentions.length,
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return
    const keyword: TrackedKeyword = {
      id: `k_${Date.now()}`,
      keyword: newKeyword,
      type: newKeyword.startsWith("#") ? "hashtag" : newKeyword.startsWith("@") ? "brand" : "keyword",
      mentions24h: 0,
      mentionsTrend: 0,
      sentiment: "neutral",
      isActive: true,
      alertsEnabled: false,
    }
    setKeywords([...keywords, keyword])
    setNewKeyword("")
  }

  const toggleKeywordAlert = (id: string) => {
    setKeywords(keywords.map((k) =>
      k.id === id ? { ...k, alertsEnabled: !k.alertsEnabled } : k
    ))
  }

  const toggleKeywordActive = (id: string) => {
    setKeywords(keywords.map((k) =>
      k.id === id ? { ...k, isActive: !k.isActive } : k
    ))
  }

  const toggleBookmark = (id: string) => {
    setMentions(mentions.map((m) =>
      m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m
    ))
  }

  const toggleFlag = (id: string) => {
    setMentions(mentions.map((m) =>
      m.id === id ? { ...m, isFlagged: !m.isFlagged } : m
    ))
  }

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500 bg-green-500/10"
      case "negative":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getTypeIcon = (type: MentionType) => {
    switch (type) {
      case "brand":
        return <AtSign className="h-3 w-3" />
      case "hashtag":
        return <Hash className="h-3 w-3" />
      case "competitor":
        return <Users className="h-3 w-3" />
      default:
        return <Search className="h-3 w-3" />
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Mentions</p>
                    <p className="text-2xl font-bold">{stats.totalMentions.toLocaleString()}</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Positive</p>
                    <p className="text-2xl font-bold text-green-500">{stats.positiveMentions}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Negative</p>
                    <p className="text-2xl font-bold text-red-500">{stats.negativeMentions}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">{(stats.totalReach / 1000).toFixed(1)}K</p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Sentiment Score</p>
                    <p className="text-2xl font-bold">{(stats.avgSentiment * 100).toFixed(0)}%</p>
                  </div>
                  <PieChart className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Keywords & Trending */}
            <div className="space-y-6">
              {/* Tracked Keywords */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Tracked Keywords</CardTitle>
                    <Badge variant="secondary">{keywords.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword or #hashtag..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-2">
                      {keywords.map((keyword) => (
                        <div
                          key={keyword.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            keyword.isActive ? "bg-card" : "bg-muted/50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(keyword.type)}
                              <span className="text-sm font-medium truncate max-w-[120px]">
                                {keyword.keyword}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleKeywordActive(keyword.id)}>
                                  {keyword.isActive ? (
                                    <>
                                      <VolumeX className="h-4 w-4 mr-2" />
                                      Pause Tracking
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="h-4 w-4 mr-2" />
                                      Resume Tracking
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleKeywordAlert(keyword.id)}>
                                  <Bell className="h-4 w-4 mr-2" />
                                  {keyword.alertsEnabled ? "Disable Alerts" : "Enable Alerts"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Remove Keyword
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{keyword.mentions24h.toLocaleString()} mentions</span>
                            <div className="flex items-center gap-2">
                              {keyword.alertsEnabled && <Bell className="h-3 w-3 text-primary" />}
                              <span className={keyword.mentionsTrend >= 0 ? "text-green-500" : "text-red-500"}>
                                {keyword.mentionsTrend >= 0 ? "+" : ""}{keyword.mentionsTrend}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Trending Topics</CardTitle>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {trending.map((topic, index) => (
                        <div key={topic.id} className="flex items-start gap-3">
                          <span className="text-lg font-bold text-muted-foreground w-5">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{topic.topic}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{(topic.mentions / 1000).toFixed(1)}K mentions</span>
                              <span className="text-green-500">+{topic.growth}%</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {topic.platforms.map((platform) => (
                                <span key={platform} className={platformColors[platform]}>
                                  {platformIcons[platform]}
                                </span>
                              ))}
                            </div>
                          </div>
                          {getSentimentIcon(topic.sentiment)}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Mentions Feed */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="mentions">All Mentions</TabsTrigger>
                        <TabsTrigger value="flagged">
                          Flagged
                          <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                            {mentions.filter((m) => m.isFlagged).length}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search mentions..."
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
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="reddit">Reddit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedSentiment} onValueChange={(v) => setSelectedSentiment(v as Sentiment | "all")}>
                        <SelectTrigger className="w-[120px] h-9">
                          <SelectValue placeholder="Sentiment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sentiment</SelectItem>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-380px)]">
                    <div className="space-y-4">
                      {filteredMentions
                        .filter((m) => {
                          if (activeTab === "flagged") return m.isFlagged
                          if (activeTab === "bookmarked") return m.isBookmarked
                          return true
                        })
                        .map((mention) => (
                          <div
                            key={mention.id}
                            className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                              !mention.isRead ? "bg-primary/5 border-primary/20" : ""
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Author Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-medium">
                                  {mention.author.name.charAt(0)}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{mention.author.name}</span>
                                  {mention.author.verified && (
                                    <CheckCircle className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    @{mention.author.username}
                                  </span>
                                  <span className={platformColors[mention.platform]}>
                                    {platformIcons[mention.platform]}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    · {formatDistanceToNow(mention.timestamp, { addSuffix: true })}
                                  </span>
                                </div>

                                <p className="text-sm mb-3">{mention.content}</p>

                                {/* Keywords */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {mention.matchedKeywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Engagement Stats */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {mention.engagement.likes.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {mention.engagement.comments}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Share2 className="h-3 w-3" />
                                    {mention.engagement.shares}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {(mention.engagement.reach / 1000).toFixed(1)}K reach
                                  </span>
                                </div>
                              </div>

                              {/* Right Side - Sentiment & Actions */}
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getSentimentColor(mention.sentiment)}>
                                  {getSentimentIcon(mention.sentiment)}
                                  <span className="ml-1 capitalize">{mention.sentiment}</span>
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 ${mention.isBookmarked ? "text-yellow-500" : ""}`}
                                    onClick={() => toggleBookmark(mention.id)}
                                  >
                                    <Bookmark className={`h-4 w-4 ${mention.isBookmarked ? "fill-current" : ""}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 ${mention.isFlagged ? "text-red-500" : ""}`}
                                    onClick={() => toggleFlag(mention.id)}
                                  >
                                    <Flag className={`h-4 w-4 ${mention.isFlagged ? "fill-current" : ""}`} />
                                  </Button>
                                  <Link href={mention.url} target="_blank">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <Link href="/inbox">
                                        <DropdownMenuItem>
                                          <MessageCircle className="h-4 w-4 mr-2" />
                                          Reply via Inbox
                                        </DropdownMenuItem>
                                      </Link>
                                      <Link href="/ai-assistant">
                                        <DropdownMenuItem>
                                          <Sparkles className="h-4 w-4 mr-2" />
                                          Generate AI Reply
                                        </DropdownMenuItem>
                                      </Link>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Report Issue
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  )
}
