"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { BarChart3 } from "lucide-react"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { OverviewStats } from "@/components/analytics/overview-stats"
import { PerformanceCharts } from "@/components/analytics/performance-charts"
import { ContentPerformance } from "@/components/analytics/content-performance"
import { AudienceInsights } from "@/components/analytics/audience-insights"
import { ChannelComparison } from "@/components/analytics/channel-comparison"
import { EngagementHeatmap } from "@/components/analytics/engagement-heatmap"
import { GrowthMetrics } from "@/components/analytics/growth-metrics"

export type DateRange = "7d" | "14d" | "30d" | "90d" | "12m" | "custom"
export type ViewTab = "overview" | "content" | "audience" | "channels"
export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "youtube" | "threads" | "pinterest"

export interface DateRangeValue {
  from: Date
  to: Date
}

export interface OverviewMetric {
  label: string
  value: number
  previousValue: number
  change: number
  changeType: "increase" | "decrease" | "neutral"
  format: "number" | "percentage" | "currency" | "compact"
}

export interface ChartDataPoint {
  date: string
  value: number
  previousValue?: number
}

export interface EngagementData {
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  impressions: number
  reach: number
}

export interface PostPerformance {
  id: string
  platform: Platform
  type: "image" | "video" | "carousel" | "story" | "reel" | "text"
  thumbnail?: string
  caption: string
  publishedAt: Date
  engagement: EngagementData
  engagementRate: number
}

export interface AudienceDemo {
  ageGroups: { label: string; value: number; previousValue: number }[]
  gender: { label: string; value: number }[]
  topCountries: { country: string; code: string; value: number; change: number }[]
  topCities: { city: string; country: string; value: number }[]
}

export interface ChannelMetrics {
  platform: Platform
  followers: number
  followersChange: number
  engagement: number
  engagementChange: number
  reach: number
  reachChange: number
  posts: number
  impressions: number
  clicks: number
}

export interface HeatmapData {
  day: number // 0-6 (Sun-Sat)
  hour: number // 0-23
  value: number
}

// Mock data generators
const generateChartData = (days: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const baseValue = 10000
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      value: baseValue + Math.random() * 5000 + (days - i) * 100,
      previousValue: baseValue + Math.random() * 4000,
    })
  }
  return data
}

const mockOverviewMetrics: OverviewMetric[] = [
  { label: "Total Followers", value: 284500, previousValue: 268000, change: 6.2, changeType: "increase", format: "compact" },
  { label: "Total Reach", value: 2450000, previousValue: 2100000, change: 16.7, changeType: "increase", format: "compact" },
  { label: "Engagement Rate", value: 4.8, previousValue: 4.2, change: 14.3, changeType: "increase", format: "percentage" },
  { label: "Total Impressions", value: 5800000, previousValue: 5200000, change: 11.5, changeType: "increase", format: "compact" },
  { label: "Link Clicks", value: 34500, previousValue: 38000, change: -9.2, changeType: "decrease", format: "compact" },
  { label: "Posts Published", value: 127, previousValue: 115, change: 10.4, changeType: "increase", format: "number" },
]

const mockTopPosts: PostPerformance[] = [
  {
    id: "post_1",
    platform: "instagram",
    type: "reel",
    thumbnail: "/posts/reel1.jpg",
    caption: "Behind the scenes of our latest product launch! 🚀 The team has been working incredibly hard...",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    engagement: { likes: 12400, comments: 890, shares: 2100, saves: 3400, clicks: 1200, impressions: 185000, reach: 142000 },
    engagementRate: 8.2,
  },
  {
    id: "post_2",
    platform: "twitter",
    type: "text",
    caption: "We just hit 100K users! 🎉 Thank you to everyone who believed in us from day one. This is just the beginning...",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    engagement: { likes: 8900, comments: 1200, shares: 4500, saves: 890, clicks: 2300, impressions: 320000, reach: 280000 },
    engagementRate: 5.4,
  },
  {
    id: "post_3",
    platform: "linkedin",
    type: "image",
    thumbnail: "/posts/linkedin1.jpg",
    caption: "Excited to announce our Series A funding round! We've raised $12M to accelerate growth...",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    engagement: { likes: 5600, comments: 340, shares: 890, saves: 1200, clicks: 3400, impressions: 89000, reach: 67000 },
    engagementRate: 9.1,
  },
  {
    id: "post_4",
    platform: "instagram",
    type: "carousel",
    thumbnail: "/posts/carousel1.jpg",
    caption: "10 tips to boost your productivity in 2024 📈 Swipe through for game-changing strategies...",
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    engagement: { likes: 9800, comments: 560, shares: 1800, saves: 4200, clicks: 890, impressions: 156000, reach: 120000 },
    engagementRate: 7.8,
  },
  {
    id: "post_5",
    platform: "tiktok",
    type: "video",
    thumbnail: "/posts/tiktok1.jpg",
    caption: "POV: You finally understand how the algorithm works 😂 #socialmedia #marketing #viral",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    engagement: { likes: 45000, comments: 2300, shares: 8900, saves: 12000, clicks: 560, impressions: 890000, reach: 720000 },
    engagementRate: 9.5,
  },
]

const mockAudienceDemo: AudienceDemo = {
  ageGroups: [
    { label: "13-17", value: 8, previousValue: 10 },
    { label: "18-24", value: 32, previousValue: 28 },
    { label: "25-34", value: 38, previousValue: 36 },
    { label: "35-44", value: 14, previousValue: 16 },
    { label: "45-54", value: 5, previousValue: 6 },
    { label: "55+", value: 3, previousValue: 4 },
  ],
  gender: [
    { label: "Female", value: 58 },
    { label: "Male", value: 39 },
    { label: "Other", value: 3 },
  ],
  topCountries: [
    { country: "United States", code: "US", value: 42, change: 3.2 },
    { country: "United Kingdom", code: "GB", value: 18, change: 1.5 },
    { country: "Canada", code: "CA", value: 12, change: 2.1 },
    { country: "Australia", code: "AU", value: 8, change: -0.5 },
    { country: "Germany", code: "DE", value: 6, change: 1.8 },
  ],
  topCities: [
    { city: "New York", country: "US", value: 12 },
    { city: "Los Angeles", country: "US", value: 9 },
    { city: "London", country: "UK", value: 8 },
    { city: "Toronto", country: "CA", value: 5 },
    { city: "Sydney", country: "AU", value: 4 },
  ],
}

const mockChannelMetrics: ChannelMetrics[] = [
  { platform: "instagram", followers: 125000, followersChange: 5.2, engagement: 4.8, engagementChange: 0.6, reach: 890000, reachChange: 12.3, posts: 45, impressions: 2100000, clicks: 12000 },
  { platform: "twitter", followers: 89000, followersChange: 3.1, engagement: 2.4, engagementChange: -0.2, reach: 450000, reachChange: 8.5, posts: 120, impressions: 980000, clicks: 8500 },
  { platform: "linkedin", followers: 45000, followersChange: 8.4, engagement: 5.2, engagementChange: 1.1, reach: 180000, reachChange: 15.2, posts: 28, impressions: 420000, clicks: 6200 },
  { platform: "tiktok", followers: 67000, followersChange: 18.5, engagement: 8.9, engagementChange: 2.3, reach: 1200000, reachChange: 45.2, posts: 32, impressions: 3500000, clicks: 4500 },
  { platform: "facebook", followers: 34000, followersChange: -1.2, engagement: 1.8, engagementChange: -0.4, reach: 120000, reachChange: -5.3, posts: 38, impressions: 280000, clicks: 3200 },
  { platform: "youtube", followers: 28000, followersChange: 4.5, engagement: 6.2, engagementChange: 0.8, reach: 340000, reachChange: 22.1, posts: 12, impressions: 890000, clicks: 9800 },
]

const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate higher engagement during business hours
      let baseValue = 20
      if (hour >= 9 && hour <= 17) baseValue = 60
      if (hour >= 12 && hour <= 14) baseValue = 85
      if (hour >= 18 && hour <= 21) baseValue = 75
      if (day === 0 || day === 6) baseValue *= 0.7 // Lower on weekends

      data.push({
        day,
        hour,
        value: Math.round(baseValue + Math.random() * 20),
      })
    }
  }
  return data
}

export default function AnalyticsPage() {
  usePageHeader({
    title: "Analytics",
    icon: BarChart3,
    subtitle: "Track your performance metrics",
  })

  const [activeTab, setActiveTab] = useState<ViewTab>("overview")
  const [dateRange, setDateRange] = useState<DateRange>("30d")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [customDateRange, setCustomDateRange] = useState<DateRangeValue>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // Get days from date range
  const getDays = (): number => {
    switch (dateRange) {
      case "7d": return 7
      case "14d": return 14
      case "30d": return 30
      case "90d": return 90
      case "12m": return 365
      default: return Math.ceil((customDateRange.to.getTime() - customDateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    }
  }

  const chartData = generateChartData(getDays())
  const heatmapData = generateHeatmapData()

  // Filter channels by selected platforms
  const filteredChannels = selectedPlatforms.length > 0
    ? mockChannelMetrics.filter((c) => selectedPlatforms.includes(c.platform))
    : mockChannelMetrics

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <AnalyticsHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
        />

        <div className="flex-1 overflow-auto">
          {activeTab === "overview" && (
            <div className="p-4 lg:p-6 space-y-6">
              {/* Overview Stats */}
              <OverviewStats metrics={mockOverviewMetrics} />

              {/* Performance Charts */}
              <PerformanceCharts
                reachData={chartData}
                engagementData={chartData.map((d) => ({ ...d, value: d.value * 0.048 }))}
                impressionsData={chartData.map((d) => ({ ...d, value: d.value * 2.3 }))}
                followersData={chartData.map((d) => ({ ...d, value: 280000 + (getDays() - chartData.indexOf(d)) * 150 }))}
              />

              {/* Growth Metrics */}
              <GrowthMetrics
                channels={filteredChannels}
                dateRange={dateRange}
              />

              {/* Engagement Heatmap */}
              <EngagementHeatmap data={heatmapData} />
            </div>
          )}

          {activeTab === "content" && (
            <div className="p-4 lg:p-6">
              <ContentPerformance
                topPosts={mockTopPosts}
                dateRange={dateRange}
              />
            </div>
          )}

          {activeTab === "audience" && (
            <div className="p-4 lg:p-6">
              <AudienceInsights
                demographics={mockAudienceDemo}
                dateRange={dateRange}
              />
            </div>
          )}

          {activeTab === "channels" && (
            <div className="p-4 lg:p-6">
              <ChannelComparison
                channels={filteredChannels}
                dateRange={dateRange}
              />
            </div>
          )}
        </div>
    </main>
  )
}
