"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  Users,
  Share2,
  FileText,
  HardDrive,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Infinity,
  ArrowUpRight,
  BarChart3,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Plan, Usage } from "@/app/billing/page"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface UsageMetricsProps {
  currentPlan: Plan
  usage: Usage
  onUpgrade: () => void
}

// Mock usage history data
const usageHistory = [
  { date: "Jan", posts: 45, storage: 1.2 },
  { date: "Feb", posts: 52, storage: 1.5 },
  { date: "Mar", posts: 61, storage: 1.8 },
  { date: "Apr", posts: 48, storage: 2.1 },
  { date: "May", posts: 73, storage: 2.4 },
  { date: "Jun", posts: 89, storage: 2.8 },
]

export function UsageMetrics({ currentPlan, usage, onUpgrade }: UsageMetricsProps) {
  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { label: "Critical", color: "text-red-600", bgColor: "bg-red-500" }
    if (percentage >= 75) return { label: "Warning", color: "text-amber-600", bgColor: "bg-amber-500" }
    return { label: "Normal", color: "text-green-600", bgColor: "bg-primary" }
  }

  const formatLimit = (value: number) => {
    if (value === -1) return "Unlimited"
    return value.toString()
  }

  const formatStorage = (gb: number) => {
    if (gb < 1) return `${Math.round(gb * 1024)} MB`
    return `${gb.toFixed(1)} GB`
  }

  const usageItems = [
    {
      label: "Workspaces",
      icon: FolderKanban,
      used: usage.workspaces,
      limit: currentPlan.workspaceLimit,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Team Members",
      icon: Users,
      used: usage.teamMembers,
      limit: currentPlan.teamMemberLimit,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Social Channels",
      icon: Share2,
      used: usage.channels,
      limit: currentPlan.channelLimit,
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "Posts This Month",
      icon: FileText,
      used: usage.postsThisMonth,
      limit: currentPlan.postsPerMonth,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
  ]

  // Calculate overall usage
  const criticalItems = usageItems.filter(
    (item) => item.limit !== -1 && getUsagePercentage(item.used, item.limit) >= 90
  )
  const warningItems = usageItems.filter(
    (item) =>
      item.limit !== -1 &&
      getUsagePercentage(item.used, item.limit) >= 75 &&
      getUsagePercentage(item.used, item.limit) < 90
  )

  return (
    <div className="space-y-6">
      {/* Usage Alert */}
      {criticalItems.length > 0 && (
        <Card className="p-4 bg-red-500/10 border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600 mb-1">Usage limit reached</p>
              <p className="text-xs text-red-600/80">
                You&apos;ve reached {criticalItems.length === 1 ? "a limit" : "limits"} on your current
                plan: {criticalItems.map((i) => i.label).join(", ")}. Upgrade to continue growing.
              </p>
            </div>
            <Button size="sm" onClick={onUpgrade} className="shrink-0">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Upgrade
            </Button>
          </div>
        </Card>
      )}

      {warningItems.length > 0 && criticalItems.length === 0 && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-600 mb-1">Approaching limits</p>
              <p className="text-xs text-amber-600/80">
                You&apos;re approaching {warningItems.length === 1 ? "a limit" : "limits"}:{" "}
                {warningItems.map((i) => i.label).join(", ")}. Consider upgrading soon.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={onUpgrade} className="shrink-0">
              View Plans
            </Button>
          </div>
        </Card>
      )}

      {/* Usage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {usageItems.map((item) => {
          const Icon = item.icon
          const percentage = getUsagePercentage(item.used, item.limit)
          const status = getUsageStatus(percentage)
          const isUnlimited = item.limit === -1

          return (
            <Card key={item.label} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bgColor)}>
                    <Icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.used} of {formatLimit(item.limit)} used
                    </p>
                  </div>
                </div>
                {!isUnlimited && (
                  <span className={cn("text-xs font-medium", status.color)}>
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>

              {isUnlimited ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Infinity className="w-4 h-4" />
                  <span>Unlimited on your plan</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Progress value={percentage} className={cn("h-2", status.bgColor)} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.limit - item.used} remaining</span>
                    {percentage >= 75 && (
                      <span className={cn("flex items-center gap-1", status.color)}>
                        <AlertTriangle className="w-3 h-3" />
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Storage Usage */}
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Storage Used</h4>
              <p className="text-xs text-muted-foreground">
                {formatStorage(usage.storageUsedGB)} of {formatStorage(currentPlan.storageGB)} used
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-foreground">
            {((usage.storageUsedGB / currentPlan.storageGB) * 100).toFixed(1)}%
          </span>
        </div>

        <Progress
          value={(usage.storageUsedGB / currentPlan.storageGB) * 100}
          className="h-2 mb-2"
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatStorage(currentPlan.storageGB - usage.storageUsedGB)} remaining</span>
          <span>Resets monthly</span>
        </div>
      </Card>

      {/* Usage History Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Usage History</h4>
              <p className="text-xs text-muted-foreground">Posts and storage over time</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Storage (GB)</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageHistory}>
              <defs>
                <linearGradient id="postsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="posts"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#postsGradient)"
              />
              <Area
                type="monotone"
                dataKey="storage"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#storageGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-muted/40 border-0">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{usage.postsThisMonth}</p>
          <p className="text-xs text-muted-foreground">posts created</p>
        </Card>

        <Card className="p-4 bg-muted/40 border-0">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Growth</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+23%</p>
          <p className="text-xs text-muted-foreground">vs last month</p>
        </Card>

        <Card className="p-4 bg-muted/40 border-0">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-muted-foreground">API Calls</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{usage.apiCallsThisMonth.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">this month</p>
        </Card>

        <Card className="p-4 bg-muted/40 border-0">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{usage.scheduledPosts}</p>
          <p className="text-xs text-muted-foreground">posts queued</p>
        </Card>
      </div>
    </div>
  )
}
