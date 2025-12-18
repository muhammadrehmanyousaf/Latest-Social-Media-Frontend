"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  FolderKanban,
  Users,
  Share2,
  Sparkles,
  Crown,
  ArrowUpRight,
  AlertTriangle,
  Infinity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ViewMode, WorkspaceStatus, SubscriptionLimits } from "@/app/workspaces/page"

interface WorkspacesHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: WorkspaceStatus | "all"
  onStatusFilterChange: (status: WorkspaceStatus | "all") => void
  onCreateWorkspace: () => void
  stats: {
    total: number
    active: number
    totalMembers: number
    totalChannels: number
  }
  subscriptionLimits: SubscriptionLimits
  canCreateWorkspace: boolean
  remainingWorkspaces: number
}

export function WorkspacesHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateWorkspace,
  stats,
  subscriptionLimits,
  canCreateWorkspace,
  remainingWorkspaces,
}: WorkspacesHeaderProps) {
  const usagePercentage =
    subscriptionLimits.workspaceLimit === -1
      ? 0
      : (stats.total / subscriptionLimits.workspaceLimit) * 100

  const isNearLimit = usagePercentage >= 80 && usagePercentage < 100
  const isAtLimit = usagePercentage >= 100

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <FolderKanban className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Workspaces</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team workspaces
            </p>
          </div>
        </div>

        <Button
          onClick={onCreateWorkspace}
          className={cn(
            "gap-2 rounded-xl shadow-sm",
            canCreateWorkspace
              ? "bg-gradient-to-r from-primary to-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          disabled={!canCreateWorkspace}
        >
          <Plus className="w-4 h-4" />
          {canCreateWorkspace ? "New Workspace" : "Limit Reached"}
        </Button>
      </div>

      {/* Workspace Limit Card */}
      <Card className="p-4 mb-4 bg-muted/40 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isAtLimit ? "bg-red-500/10" : isNearLimit ? "bg-amber-500/10" : "bg-primary/10"
            )}>
              <Crown className={cn(
                "w-6 h-6",
                isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-primary"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {subscriptionLimits.planName} Plan
                </span>
                {subscriptionLimits.workspaceLimit !== -1 && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-medium",
                      isAtLimit
                        ? "bg-red-500/10 text-red-600 border-transparent"
                        : isNearLimit
                        ? "bg-amber-500/10 text-amber-600 border-transparent"
                        : "bg-muted"
                    )}
                  >
                    {stats.total} / {subscriptionLimits.workspaceLimit} workspaces
                  </Badge>
                )}
                {subscriptionLimits.workspaceLimit === -1 && (
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                    <Infinity className="w-3 h-3 mr-1" />
                    Unlimited
                  </Badge>
                )}
              </div>
              {subscriptionLimits.workspaceLimit !== -1 && (
                <div className="flex items-center gap-3">
                  <Progress
                    value={usagePercentage}
                    className={cn(
                      "h-2 flex-1 max-w-xs",
                      isAtLimit ? "[&>div]:bg-red-500" : isNearLimit ? "[&>div]:bg-amber-500" : ""
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {remainingWorkspaces > 0
                      ? `${remainingWorkspaces} remaining`
                      : "No workspaces remaining"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!canCreateWorkspace && (
            <Link href="/billing">
              <Button variant="outline" className="gap-2 rounded-xl shrink-0">
                <Sparkles className="w-4 h-4" />
                Upgrade Plan
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {isNearLimit && !isAtLimit && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-600">
              You&apos;re approaching your workspace limit. Consider upgrading for more workspaces.
            </p>
          </div>
        )}
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total Workspaces</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.active}</p>
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.totalMembers}</p>
              <p className="text-[10px] text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-card border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.totalChannels}</p>
              <p className="text-[10px] text-muted-foreground">Connected Channels</p>
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
            placeholder="Search workspaces..."
            className="pl-9 rounded-xl bg-muted/60 border-0 h-10"
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as WorkspaceStatus | "all")}>
            <SelectTrigger className="w-[130px] h-10 rounded-xl bg-muted/60 border-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
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
