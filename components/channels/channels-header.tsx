"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Link2,
  AlertTriangle,
  Users,
  TrendingUp,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Youtube,
  CircleDot,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, ViewMode, FilterStatus } from "@/app/channels/page"

interface ChannelsHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filterStatus: FilterStatus
  onFilterStatusChange: (status: FilterStatus) => void
  filterPlatform: Platform | "all"
  onFilterPlatformChange: (platform: Platform | "all") => void
  onConnectNew: () => void
  stats: {
    connected: number
    issues: number
    totalFollowers: number
    avgEngagement: number
  }
  totalChannels: number
}

const platformOptions: { value: Platform | "all"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "All Platforms", icon: Share2 },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "twitter", label: "X (Twitter)", icon: Twitter },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "threads", label: "Threads", icon: AtSign },
  { value: "tiktok", label: "TikTok", icon: Zap },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "pinterest", label: "Pinterest", icon: CircleDot },
]

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function ChannelsHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPlatform,
  onFilterPlatformChange,
  onConnectNew,
  stats,
  totalChannels,
}: ChannelsHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Share2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Social Channels</h1>
            <p className="text-sm text-muted-foreground">
              {totalChannels} channel{totalChannels !== 1 ? "s" : ""} connected
            </p>
          </div>
        </div>

        <Button
          onClick={onConnectNew}
          className="gap-2 rounded-xl shadow-sm bg-gradient-to-r from-primary to-primary/90"
        >
          <Plus className="w-4 h-4" />
          Connect Channel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.connected}</p>
              <p className="text-[10px] text-muted-foreground">Connected</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              stats.issues > 0 ? "bg-amber-500/10" : "bg-muted"
            )}>
              <AlertTriangle className={cn(
                "w-4 h-4",
                stats.issues > 0 ? "text-amber-600" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className={cn(
                "text-lg font-bold",
                stats.issues > 0 ? "text-amber-600" : "text-foreground"
              )}>
                {stats.issues}
              </p>
              <p className="text-[10px] text-muted-foreground">Need Attention</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatNumber(stats.totalFollowers)}</p>
              <p className="text-[10px] text-muted-foreground">Total Followers</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.avgEngagement.toFixed(1)}%</p>
              <p className="text-[10px] text-muted-foreground">Avg. Engagement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search channels..."
            className="pl-9 rounded-xl bg-muted/60 border-0 h-10"
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-muted/60 rounded-xl">
            <button
              onClick={() => onFilterStatusChange("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filterStatus === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => onFilterStatusChange("connected")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filterStatus === "connected"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Connected
            </button>
            <button
              onClick={() => onFilterStatusChange("issues")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                filterStatus === "issues"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Issues
              {stats.issues > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                  {stats.issues}
                </span>
              )}
            </button>
          </div>

          {/* Platform Filter */}
          <Select value={filterPlatform} onValueChange={(v) => onFilterPlatformChange(v as Platform | "all")}>
            <SelectTrigger className="w-[150px] h-10 rounded-xl bg-muted/60 border-0">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((opt) => {
                const Icon = opt.icon
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {opt.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-muted/60 rounded-xl">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
