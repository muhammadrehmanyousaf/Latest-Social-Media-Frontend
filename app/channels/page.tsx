"use client"

import { useState, useCallback, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChannelsHeader } from "@/components/channels/channels-header"
import { ChannelsGrid } from "@/components/channels/channels-grid"
import { ChannelDetails } from "@/components/channels/channel-details"
import { ConnectChannel } from "@/components/channels/connect-channel"
import { ChannelSettings } from "@/components/channels/channel-settings"

export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok" | "youtube" | "pinterest"

export type ConnectionStatus = "connected" | "disconnected" | "expired" | "error" | "pending"

export type AccountType = "personal" | "business" | "creator"

export interface ChannelStats {
  followers: number
  following: number
  posts: number
  engagement: number
  impressions: number
  reach: number
  growth: number
  avgLikes: number
  avgComments: number
}

export interface ChannelSettings {
  autoHashtags: string[]
  defaultCaption: string
  watermarkEnabled: boolean
  autoSchedule: boolean
  bestTimePosting: boolean
  notificationsEnabled: boolean
  analyticsEnabled: boolean
}

export interface Channel {
  id: string
  platform: Platform
  username: string
  displayName: string
  profileImage: string
  bio: string
  website: string
  accountType: AccountType
  isVerified: boolean
  connectionStatus: ConnectionStatus
  connectedAt: Date
  lastSyncedAt: Date
  tokenExpiresAt: Date | null
  stats: ChannelStats
  settings: ChannelSettings
  recentPosts: number
  scheduledPosts: number
  color: string
}

export interface ChannelGroup {
  id: string
  name: string
  channels: string[]
  color: string
}

const mockChannels: Channel[] = [
  {
    id: "1",
    platform: "instagram",
    username: "socialflow.official",
    displayName: "SocialFlow",
    profileImage: "/instagram-profile-placeholder.png",
    bio: "Streamline your social media management | AI-powered scheduling & analytics",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: true,
    connectionStatus: "connected",
    connectedAt: new Date(2024, 8, 15),
    lastSyncedAt: new Date(),
    tokenExpiresAt: new Date(2025, 2, 15),
    stats: {
      followers: 125400,
      following: 892,
      posts: 1247,
      engagement: 4.8,
      impressions: 892000,
      reach: 445000,
      growth: 12.5,
      avgLikes: 3420,
      avgComments: 156,
    },
    settings: {
      autoHashtags: ["socialflow", "socialmedia", "marketing"],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: true,
      bestTimePosting: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 24,
    scheduledPosts: 12,
    color: "#E4405F",
  },
  {
    id: "2",
    platform: "twitter",
    username: "socialflow",
    displayName: "SocialFlow",
    profileImage: "/twitter-profile-placeholder.png",
    bio: "The future of social media management is here. Try SocialFlow today!",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: true,
    connectionStatus: "connected",
    connectedAt: new Date(2024, 7, 20),
    lastSyncedAt: new Date(),
    tokenExpiresAt: null,
    stats: {
      followers: 89200,
      following: 1205,
      posts: 3842,
      engagement: 3.2,
      impressions: 1240000,
      reach: 620000,
      growth: 8.7,
      avgLikes: 892,
      avgComments: 67,
    },
    settings: {
      autoHashtags: [],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: true,
      bestTimePosting: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 45,
    scheduledPosts: 8,
    color: "#1DA1F2",
  },
  {
    id: "3",
    platform: "linkedin",
    username: "socialflow-inc",
    displayName: "SocialFlow Inc.",
    profileImage: "/linkedin-profile-placeholder.png",
    bio: "Enterprise social media management platform | Trusted by Fortune 500 companies",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: false,
    connectionStatus: "connected",
    connectedAt: new Date(2024, 9, 1),
    lastSyncedAt: new Date(),
    tokenExpiresAt: new Date(2025, 1, 1),
    stats: {
      followers: 45600,
      following: 234,
      posts: 892,
      engagement: 5.4,
      impressions: 456000,
      reach: 228000,
      growth: 15.2,
      avgLikes: 1240,
      avgComments: 89,
    },
    settings: {
      autoHashtags: ["B2B", "SaaS", "Marketing"],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: false,
      bestTimePosting: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 18,
    scheduledPosts: 5,
    color: "#0A66C2",
  },
  {
    id: "4",
    platform: "facebook",
    username: "socialflow",
    displayName: "SocialFlow",
    profileImage: "/facebook-profile-placeholder.png",
    bio: "Social media management made simple. Join millions of marketers using SocialFlow.",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: true,
    connectionStatus: "expired",
    connectedAt: new Date(2024, 6, 10),
    lastSyncedAt: new Date(2024, 10, 15),
    tokenExpiresAt: new Date(2024, 10, 15),
    stats: {
      followers: 234500,
      following: 0,
      posts: 2156,
      engagement: 2.8,
      impressions: 1890000,
      reach: 945000,
      growth: -2.1,
      avgLikes: 2890,
      avgComments: 234,
    },
    settings: {
      autoHashtags: [],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: true,
      bestTimePosting: false,
      notificationsEnabled: false,
      analyticsEnabled: true,
    },
    recentPosts: 32,
    scheduledPosts: 0,
    color: "#1877F2",
  },
  {
    id: "5",
    platform: "tiktok",
    username: "socialflow_official",
    displayName: "SocialFlow",
    profileImage: "/tiktok-profile-placeholder.png",
    bio: "Social media tips & tricks | Follow for daily content inspiration",
    website: "https://socialflow.com",
    accountType: "creator",
    isVerified: false,
    connectionStatus: "connected",
    connectedAt: new Date(2024, 10, 1),
    lastSyncedAt: new Date(),
    tokenExpiresAt: new Date(2025, 4, 1),
    stats: {
      followers: 67800,
      following: 156,
      posts: 245,
      engagement: 8.9,
      impressions: 4560000,
      reach: 2280000,
      growth: 34.5,
      avgLikes: 12400,
      avgComments: 892,
    },
    settings: {
      autoHashtags: ["fyp", "socialmediatips", "marketing"],
      defaultCaption: "",
      watermarkEnabled: true,
      autoSchedule: true,
      bestTimePosting: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 15,
    scheduledPosts: 6,
    color: "#000000",
  },
  {
    id: "6",
    platform: "threads",
    username: "socialflow.official",
    displayName: "SocialFlow",
    profileImage: "/threads-profile-placeholder.png",
    bio: "Building the future of social media management, one thread at a time.",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: true,
    connectionStatus: "connected",
    connectedAt: new Date(2024, 10, 10),
    lastSyncedAt: new Date(),
    tokenExpiresAt: null,
    stats: {
      followers: 12400,
      following: 89,
      posts: 156,
      engagement: 6.2,
      impressions: 234000,
      reach: 117000,
      growth: 45.8,
      avgLikes: 456,
      avgComments: 67,
    },
    settings: {
      autoHashtags: [],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: true,
      bestTimePosting: true,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 12,
    scheduledPosts: 4,
    color: "#000000",
  },
  {
    id: "7",
    platform: "youtube",
    username: "SocialFlowHQ",
    displayName: "SocialFlow",
    profileImage: "/youtube-profile-placeholder.png",
    bio: "Tutorials, tips, and strategies for social media success. Subscribe for weekly content!",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: false,
    connectionStatus: "pending",
    connectedAt: new Date(2024, 11, 1),
    lastSyncedAt: new Date(2024, 11, 1),
    tokenExpiresAt: null,
    stats: {
      followers: 8900,
      following: 0,
      posts: 89,
      engagement: 4.5,
      impressions: 567000,
      reach: 283500,
      growth: 22.3,
      avgLikes: 234,
      avgComments: 45,
    },
    settings: {
      autoHashtags: [],
      defaultCaption: "",
      watermarkEnabled: true,
      autoSchedule: false,
      bestTimePosting: false,
      notificationsEnabled: true,
      analyticsEnabled: true,
    },
    recentPosts: 8,
    scheduledPosts: 2,
    color: "#FF0000",
  },
  {
    id: "8",
    platform: "pinterest",
    username: "socialflow",
    displayName: "SocialFlow",
    profileImage: "/pinterest-profile-placeholder.png",
    bio: "Social media inspiration, templates, and marketing tips. Save our pins!",
    website: "https://socialflow.com",
    accountType: "business",
    isVerified: false,
    connectionStatus: "disconnected",
    connectedAt: new Date(2024, 5, 1),
    lastSyncedAt: new Date(2024, 8, 15),
    tokenExpiresAt: null,
    stats: {
      followers: 23400,
      following: 156,
      posts: 567,
      engagement: 3.8,
      impressions: 890000,
      reach: 445000,
      growth: 0,
      avgLikes: 89,
      avgComments: 12,
    },
    settings: {
      autoHashtags: [],
      defaultCaption: "",
      watermarkEnabled: false,
      autoSchedule: false,
      bestTimePosting: false,
      notificationsEnabled: false,
      analyticsEnabled: false,
    },
    recentPosts: 0,
    scheduledPosts: 0,
    color: "#E60023",
  },
]

const mockGroups: ChannelGroup[] = [
  { id: "1", name: "Main Brand", channels: ["1", "2", "3", "4"], color: "#f97316" },
  { id: "2", name: "Content Creators", channels: ["5", "6"], color: "#8b5cf6" },
  { id: "3", name: "Video Platforms", channels: ["7", "5"], color: "#ef4444" },
]

export type ViewMode = "grid" | "list"
export type FilterStatus = "all" | "connected" | "issues"

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels)
  const [groups] = useState<ChannelGroup[]>(mockGroups)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all")
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [isConnectOpen, setIsConnectOpen] = useState(false)
  const [settingsChannel, setSettingsChannel] = useState<Channel | null>(null)

  const filteredChannels = useMemo(() => {
    let result = [...channels]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.username.toLowerCase().includes(query) ||
          c.displayName.toLowerCase().includes(query) ||
          c.platform.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filterStatus === "connected") {
      result = result.filter((c) => c.connectionStatus === "connected")
    } else if (filterStatus === "issues") {
      result = result.filter(
        (c) =>
          c.connectionStatus === "expired" ||
          c.connectionStatus === "error" ||
          c.connectionStatus === "disconnected"
      )
    }

    // Platform filter
    if (filterPlatform !== "all") {
      result = result.filter((c) => c.platform === filterPlatform)
    }

    return result
  }, [channels, searchQuery, filterStatus, filterPlatform])

  const stats = useMemo(() => {
    const connected = channels.filter((c) => c.connectionStatus === "connected").length
    const issues = channels.filter(
      (c) =>
        c.connectionStatus === "expired" ||
        c.connectionStatus === "error" ||
        c.connectionStatus === "disconnected"
    ).length
    const totalFollowers = channels.reduce((acc, c) => acc + c.stats.followers, 0)
    const avgEngagement =
      channels.length > 0
        ? channels.reduce((acc, c) => acc + c.stats.engagement, 0) / channels.length
        : 0

    return { connected, issues, totalFollowers, avgEngagement }
  }, [channels])

  const reconnectChannel = useCallback((id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              connectionStatus: "connected" as ConnectionStatus,
              lastSyncedAt: new Date(),
              tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            }
          : c
      )
    )
  }, [])

  const disconnectChannel = useCallback((id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, connectionStatus: "disconnected" as ConnectionStatus }
          : c
      )
    )
  }, [])

  const removeChannel = useCallback((id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id))
    setSelectedChannel(null)
  }, [])

  const syncChannel = useCallback((id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, lastSyncedAt: new Date() } : c
      )
    )
  }, [])

  const updateChannelSettings = useCallback(
    (id: string, settings: Partial<ChannelSettings>) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, settings: { ...c.settings, ...settings } } : c
        )
      )
    },
    []
  )

  const connectNewChannel = useCallback((platform: Platform) => {
    const newChannel: Channel = {
      id: Math.random().toString(36).substring(2, 9),
      platform,
      username: `new_${platform}_account`,
      displayName: "New Account",
      profileImage: "",
      bio: "",
      website: "",
      accountType: "business",
      isVerified: false,
      connectionStatus: "connected",
      connectedAt: new Date(),
      lastSyncedAt: new Date(),
      tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
        engagement: 0,
        impressions: 0,
        reach: 0,
        growth: 0,
        avgLikes: 0,
        avgComments: 0,
      },
      settings: {
        autoHashtags: [],
        defaultCaption: "",
        watermarkEnabled: false,
        autoSchedule: true,
        bestTimePosting: true,
        notificationsEnabled: true,
        analyticsEnabled: true,
      },
      recentPosts: 0,
      scheduledPosts: 0,
      color: "#6b7280",
    }
    setChannels((prev) => [...prev, newChannel])
    setIsConnectOpen(false)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <ChannelsHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPlatform={filterPlatform}
          onFilterPlatformChange={setFilterPlatform}
          onConnectNew={() => setIsConnectOpen(true)}
          stats={stats}
          totalChannels={channels.length}
        />

        <ChannelsGrid
          channels={filteredChannels}
          viewMode={viewMode}
          groups={groups}
          onSelectChannel={setSelectedChannel}
          onReconnect={reconnectChannel}
          onDisconnect={disconnectChannel}
          onSync={syncChannel}
          onSettings={setSettingsChannel}
          onRemove={removeChannel}
        />

        {selectedChannel && (
          <ChannelDetails
            channel={selectedChannel}
            onClose={() => setSelectedChannel(null)}
            onReconnect={() => reconnectChannel(selectedChannel.id)}
            onDisconnect={() => disconnectChannel(selectedChannel.id)}
            onSync={() => syncChannel(selectedChannel.id)}
            onSettings={() => {
              setSettingsChannel(selectedChannel)
              setSelectedChannel(null)
            }}
            onRemove={() => removeChannel(selectedChannel.id)}
          />
        )}

        {isConnectOpen && (
          <ConnectChannel
            onConnect={connectNewChannel}
            onClose={() => setIsConnectOpen(false)}
            connectedPlatforms={channels.map((c) => c.platform)}
          />
        )}

        {settingsChannel && (
          <ChannelSettings
            channel={settingsChannel}
            onClose={() => setSettingsChannel(null)}
            onSave={(settings) => {
              updateChannelSettings(settingsChannel.id, settings)
              setSettingsChannel(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
