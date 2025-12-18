"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  RefreshCw,
  FileText,
  Users,
  Share2,
  TrendingUp,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  Zap,
  CircleDot,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ViewTab, DateRange, DateRangeValue, Platform } from "@/app/analytics/page"

interface AnalyticsHeaderProps {
  activeTab: ViewTab
  onTabChange: (tab: ViewTab) => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  customDateRange: DateRangeValue
  onCustomDateRangeChange: (range: DateRangeValue) => void
  selectedPlatforms: Platform[]
  onPlatformsChange: (platforms: Platform[]) => void
}

const tabs: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "content", label: "Content", icon: FileText },
  { id: "audience", label: "Audience", icon: Users },
  { id: "channels", label: "Channels", icon: Share2 },
]

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "custom", label: "Custom range" },
]

const platformOptions: { value: Platform; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { value: "twitter", label: "X (Twitter)", icon: Twitter, color: "#000000" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { value: "tiktok", label: "TikTok", icon: Zap, color: "#000000" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { value: "threads", label: "Threads", icon: AtSign, color: "#000000" },
  { value: "pinterest", label: "Pinterest", icon: CircleDot, color: "#E60023" },
]

export function AnalyticsHeader({
  activeTab,
  onTabChange,
  dateRange,
  onDateRangeChange,
  customDateRange,
  onCustomDateRangeChange,
  selectedPlatforms,
  onPlatformsChange,
}: AnalyticsHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCustomCalendar, setShowCustomCalendar] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handlePlatformToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform))
    } else {
      onPlatformsChange([...selectedPlatforms, platform])
    }
  }

  const getDateRangeLabel = () => {
    if (dateRange === "custom") {
      return `${format(customDateRange.from, "MMM d")} - ${format(customDateRange.to, "MMM d, yyyy")}`
    }
    return dateRangeOptions.find((opt) => opt.value === dateRange)?.label || ""
  }

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Track your social media performance
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl h-10">
                <CalendarIcon className="w-4 h-4" />
                {getDateRangeLabel()}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b border-border">
                <div className="grid grid-cols-2 gap-2">
                  {dateRangeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={dateRange === option.value ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        onDateRangeChange(option.value)
                        if (option.value !== "custom") {
                          setShowCustomCalendar(false)
                        }
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              {dateRange === "custom" && (
                <div className="p-3">
                  <Calendar
                    mode="range"
                    selected={{
                      from: customDateRange.from,
                      to: customDateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        onCustomDateRangeChange({
                          from: range.from,
                          to: range.to,
                        })
                      }
                    }}
                    numberOfMonths={2}
                    className="rounded-xl"
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Platform Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl h-10">
                <Filter className="w-4 h-4" />
                Platforms
                {selectedPlatforms.length > 0 && (
                  <Badge className="ml-1 bg-primary/10 text-primary border-0 text-[10px]">
                    {selectedPlatforms.length}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {platformOptions.map((platform) => {
                const Icon = platform.icon
                return (
                  <DropdownMenuCheckboxItem
                    key={platform.value}
                    checked={selectedPlatforms.includes(platform.value)}
                    onCheckedChange={() => handlePlatformToggle(platform.value)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" style={{ color: platform.color }} />
                    {platform.label}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {selectedPlatforms.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlatformsChange([])}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Selected Platforms Pills */}
        {selectedPlatforms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedPlatforms.map((platform) => {
              const config = platformOptions.find((p) => p.value === platform)
              if (!config) return null
              const Icon = config.icon
              return (
                <Badge
                  key={platform}
                  variant="secondary"
                  className="gap-1.5 px-2.5 py-1 rounded-lg"
                >
                  <Icon className="w-3 h-3" style={{ color: config.color }} />
                  {config.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
