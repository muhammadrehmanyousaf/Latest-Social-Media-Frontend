"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Send,
  Trash2,
  Layers,
  Clock,
  BookMarked,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewTab } from "@/app/bulk-schedule/page"

interface BulkScheduleHeaderProps {
  activeTab: ViewTab
  onTabChange: (tab: ViewTab) => void
  totalPosts: number
  readyCount: number
  scheduledCount: number
  errorCount: number
  onAddPost: () => void
  onScheduleAll: () => void
  selectedCount: number
  onDeleteSelected: () => void
}

const tabs: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "editor", label: "Editor", icon: Edit3 },
  { id: "queue", label: "Queue", icon: Layers },
  { id: "templates", label: "Time Slots", icon: Clock },
  { id: "library", label: "Library", icon: BookMarked },
]

export function BulkScheduleHeader({
  activeTab,
  onTabChange,
  totalPosts,
  readyCount,
  scheduledCount,
  errorCount,
  onAddPost,
  onScheduleAll,
  selectedCount,
  onDeleteSelected,
}: BulkScheduleHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bulk Scheduler</h1>
              <p className="text-sm text-muted-foreground">Schedule multiple posts at once</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={onDeleteSelected}
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedCount})
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onAddPost}>
            <Plus className="w-4 h-4" />
            Add Post
          </Button>
          <Button
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-sm"
            onClick={onScheduleAll}
            disabled={readyCount === 0}
          >
            <Send className="w-4 h-4" />
            Schedule All ({readyCount})
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{totalPosts}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">{readyCount}</span>
          <span className="text-xs text-green-600/70">Ready</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{scheduledCount}</span>
          <span className="text-xs text-primary/70">Scheduled</span>
        </div>
        {errorCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">{errorCount}</span>
            <span className="text-xs text-destructive/70">Errors</span>
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
              {tab.id === "queue" && (readyCount + scheduledCount) > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">
                  {readyCount + scheduledCount}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}
