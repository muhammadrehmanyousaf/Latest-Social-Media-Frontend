"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, PostStatus } from "@/app/schedule/page"

interface ScheduleFiltersProps {
  selectedPlatforms: Platform[]
  onPlatformsChange: (platforms: Platform[]) => void
  selectedStatuses: PostStatus[]
  onStatusesChange: (statuses: PostStatus[]) => void
}

const platforms: { id: Platform; name: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2" },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "#000000" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { id: "threads", name: "Threads", icon: AtSign, color: "#000000" },
  { id: "tiktok", name: "TikTok", icon: Zap, color: "#000000" },
]

const statuses: { id: PostStatus; name: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "scheduled", name: "Scheduled", icon: Clock, color: "#f97316" },
  { id: "published", name: "Published", icon: CheckCircle2, color: "#22c55e" },
  { id: "draft", name: "Draft", icon: FileEdit, color: "#6b7280" },
  { id: "failed", name: "Failed", icon: AlertCircle, color: "#ef4444" },
]

const bestTimes = [
  { time: "9:00 AM", day: "Mon-Fri", score: 95 },
  { time: "12:00 PM", day: "Daily", score: 88 },
  { time: "6:00 PM", day: "Mon-Fri", score: 92 },
  { time: "8:00 PM", day: "Weekends", score: 85 },
]

export function ScheduleFilters({
  selectedPlatforms,
  onPlatformsChange,
  selectedStatuses,
  onStatusesChange,
}: ScheduleFiltersProps) {
  const [platformsExpanded, setPlatformsExpanded] = useState(true)
  const [statusesExpanded, setStatusesExpanded] = useState(true)
  const [bestTimesExpanded, setBestTimesExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform))
    } else {
      onPlatformsChange([...selectedPlatforms, platform])
    }
  }

  const toggleStatus = (status: PostStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusesChange([...selectedStatuses, status])
    }
  }

  const clearAllFilters = () => {
    onPlatformsChange([])
    onStatusesChange([])
  }

  const hasFilters = selectedPlatforms.length > 0 || selectedStatuses.length > 0

  const FilterContent = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">
        {/* Quick Stats */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">This Week</p>
              <p className="text-xs text-muted-foreground">Schedule overview</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-background/80">
              <p className="text-lg font-bold text-foreground">24</p>
              <p className="text-[10px] text-muted-foreground">Scheduled</p>
            </div>
            <div className="p-2.5 rounded-lg bg-background/80">
              <p className="text-lg font-bold text-foreground">18</p>
              <p className="text-[10px] text-muted-foreground">Published</p>
            </div>
          </div>
        </Card>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs text-muted-foreground hover:text-destructive gap-2"
            onClick={clearAllFilters}
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </Button>
        )}

        {/* Platforms Filter */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setPlatformsExpanded(!platformsExpanded)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Platforms
            </span>
            {platformsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {platformsExpanded && (
            <div className="space-y-1">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id)
                const Icon = platform.icon
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/60 border border-transparent"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: platform.color }} />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {platform.name}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setStatusesExpanded(!statusesExpanded)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Status
            </span>
            {statusesExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {statusesExpanded && (
            <div className="space-y-1">
              {statuses.map((status) => {
                const isSelected = selectedStatuses.includes(status.id)
                const Icon = status.icon
                return (
                  <button
                    key={status.id}
                    onClick={() => toggleStatus(status.id)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/60 border border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" style={{ color: status.color }} />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {status.name}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Best Times */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setBestTimesExpanded(!bestTimesExpanded)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Best Times to Post
            </span>
            {bestTimesExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {bestTimesExpanded && (
            <div className="space-y-2">
              {bestTimes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.time}</p>
                    <p className="text-[10px] text-muted-foreground">{item.day}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary">{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg bg-card"
        onClick={() => setMobileOpen(true)}
      >
        <Filter className="w-5 h-5" />
        {hasFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {selectedPlatforms.length + selectedStatuses.length}
          </span>
        )}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-50 w-[280px] bg-card border-l border-border transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <span className="text-sm font-semibold">Filters</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <FilterContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border bg-card shrink-0">
        <div className="flex items-center gap-2 h-12 px-4 border-b border-border">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filters</span>
          {hasFilters && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
              {selectedPlatforms.length + selectedStatuses.length} active
            </span>
          )}
        </div>
        <FilterContent />
      </aside>
    </>
  )
}
