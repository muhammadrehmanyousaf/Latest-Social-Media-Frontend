"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Zap,
  Target,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import type { ChartDataPoint } from "@/app/analytics/page"

interface PerformanceChartsProps {
  reachData: ChartDataPoint[]
  engagementData: ChartDataPoint[]
  impressionsData: ChartDataPoint[]
  followersData: ChartDataPoint[]
}

type ChartType = "reach" | "engagement" | "impressions" | "followers"

const chartConfig: Record<ChartType, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  gradient: { start: string; end: string }
}> = {
  reach: {
    label: "Reach",
    icon: Eye,
    color: "#8b5cf6",
    gradient: { start: "#8b5cf640", end: "#8b5cf600" },
  },
  engagement: {
    label: "Engagement Rate",
    icon: Zap,
    color: "#22c55e",
    gradient: { start: "#22c55e40", end: "#22c55e00" },
  },
  impressions: {
    label: "Impressions",
    icon: Target,
    color: "#f97316",
    gradient: { start: "#f9731640", end: "#f9731600" },
  },
  followers: {
    label: "Followers",
    icon: Users,
    color: "#3b82f6",
    gradient: { start: "#3b82f640", end: "#3b82f600" },
  },
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toFixed(num < 10 ? 1 : 0)
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function PerformanceCharts({
  reachData,
  engagementData,
  impressionsData,
  followersData,
}: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>("reach")
  const [chartStyle, setChartStyle] = useState<"area" | "line" | "bar">("area")

  const getChartData = () => {
    switch (activeChart) {
      case "reach":
        return reachData
      case "engagement":
        return engagementData
      case "impressions":
        return impressionsData
      case "followers":
        return followersData
    }
  }

  const config = chartConfig[activeChart]
  const data = getChartData()

  // Calculate totals and changes
  const currentTotal = data.reduce((sum, d) => sum + d.value, 0)
  const previousTotal = data.reduce((sum, d) => sum + (d.previousValue || 0), 0)
  const change = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-xl p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{formatDate(label)}</p>
          <p className="text-sm font-semibold text-foreground">
            {activeChart === "engagement"
              ? `${payload[0].value.toFixed(2)}%`
              : formatNumber(payload[0].value)}
          </p>
          {payload[0].payload.previousValue && (
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {activeChart === "engagement"
                ? `${payload[0].payload.previousValue.toFixed(2)}%`
                : formatNumber(payload[0].payload.previousValue)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Performance Overview</h3>
          <p className="text-sm text-muted-foreground">Track your key metrics over time</p>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center gap-2">
          {(Object.keys(chartConfig) as ChartType[]).map((type) => {
            const cfg = chartConfig[type]
            const Icon = cfg.icon
            const isActive = activeChart === type
            return (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-muted/40">
          <p className="text-xs text-muted-foreground mb-1">Total {config.label}</p>
          <p className="text-2xl font-bold text-foreground">
            {activeChart === "engagement"
              ? `${(currentTotal / data.length).toFixed(2)}%`
              : formatNumber(currentTotal)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/40">
          <p className="text-xs text-muted-foreground mb-1">Average</p>
          <p className="text-2xl font-bold text-foreground">
            {activeChart === "engagement"
              ? `${(currentTotal / data.length).toFixed(2)}%`
              : formatNumber(currentTotal / data.length)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/40">
          <p className="text-xs text-muted-foreground mb-1">Change</p>
          <p className={cn(
            "text-2xl font-bold",
            change >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart Style Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg">
          {(["area", "line", "bar"] as const).map((style) => (
            <button
              key={style}
              onClick={() => setChartStyle(style)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                chartStyle === style
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {style}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartStyle === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${activeChart}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#gradient-${activeChart})`}
              />
            </AreaChart>
          ) : chartStyle === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={2}
                dot={{ fill: config.color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="previousValue"
                stroke={config.color}
                strokeWidth={1}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill={config.color}
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
