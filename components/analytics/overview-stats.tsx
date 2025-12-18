"use client"

import { Card } from "@/components/ui/card"
import {
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Zap,
  MousePointer,
  FileText,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { OverviewMetric } from "@/app/analytics/page"

interface OverviewStatsProps {
  metrics: OverviewMetric[]
}

const metricIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Total Followers": Users,
  "Total Reach": Eye,
  "Engagement Rate": Zap,
  "Total Impressions": Target,
  "Link Clicks": MousePointer,
  "Posts Published": FileText,
}

const metricColors: Record<string, { bg: string; icon: string }> = {
  "Total Followers": { bg: "bg-blue-500/10", icon: "text-blue-600" },
  "Total Reach": { bg: "bg-purple-500/10", icon: "text-purple-600" },
  "Engagement Rate": { bg: "bg-green-500/10", icon: "text-green-600" },
  "Total Impressions": { bg: "bg-orange-500/10", icon: "text-orange-600" },
  "Link Clicks": { bg: "bg-pink-500/10", icon: "text-pink-600" },
  "Posts Published": { bg: "bg-cyan-500/10", icon: "text-cyan-600" },
}

const formatValue = (value: number, format: string): string => {
  switch (format) {
    case "compact":
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toString()
    case "percentage":
      return `${value.toFixed(1)}%`
    case "currency":
      return `$${value.toLocaleString()}`
    default:
      return value.toLocaleString()
  }
}

export function OverviewStats({ metrics }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const Icon = metricIcons[metric.label] || TrendingUp
        const colors = metricColors[metric.label] || { bg: "bg-primary/10", icon: "text-primary" }
        const isPositive = metric.changeType === "increase"
        const isNegative = metric.changeType === "decrease"

        return (
          <Card key={metric.label} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
                <Icon className={cn("w-5 h-5", colors.icon)} />
              </div>
              {metric.change !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold",
                    isPositive && "bg-green-500/10 text-green-600",
                    isNegative && "bg-red-500/10 text-red-600",
                    !isPositive && !isNegative && "bg-muted text-muted-foreground"
                  )}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : isNegative ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {formatValue(metric.value, metric.format)}
              </p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>

            {/* Mini sparkline placeholder */}
            <div className="mt-3 h-8 flex items-end gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 20 + Math.random() * 80
                const isLast = i === 11
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-all",
                      isLast
                        ? isPositive
                          ? "bg-green-500"
                          : isNegative
                          ? "bg-red-500"
                          : "bg-primary"
                        : "bg-muted"
                    )}
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
