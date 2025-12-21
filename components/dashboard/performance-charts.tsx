"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  Users,
  Heart,
  Eye,
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Download,
  Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ChartDataPoint } from "@/app/page"

interface PerformanceChartsProps {
  data: ChartDataPoint[]
}

type ChartType = "area" | "line" | "bar"
type MetricType = "followers" | "engagement" | "reach" | "impressions"

const metrics: { id: MetricType; label: string; color: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "followers", label: "Followers", color: "#3b82f6", icon: Users },
  { id: "engagement", label: "Engagement", color: "#ec4899", icon: Heart },
  { id: "reach", label: "Reach", color: "#8b5cf6", icon: Eye },
  { id: "impressions", label: "Impressions", color: "#22c55e", icon: BarChart3 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-xl p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {entry.dataKey}:
            </span>
            <span className="text-xs font-semibold text-foreground">
              {entry.dataKey === "engagement"
                ? `${entry.value.toFixed(1)}%`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function PerformanceCharts({ data }: PerformanceChartsProps) {
  const [chartType, setChartType] = useState<ChartType>("area")
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(["followers", "engagement"])
  const [timeRange, setTimeRange] = useState("30d")

  const toggleMetric = (metric: MetricType) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const filteredData = data.slice(-parseInt(timeRange))

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {metrics.map((metric) => (
                <linearGradient key={metric.id} id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {selectedMetrics.map((metricId) => {
              const metric = metrics.find((m) => m.id === metricId)!
              return (
                <Area
                  key={metricId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${metricId})`}
                />
              )
            })}
          </AreaChart>
        )

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {selectedMetrics.map((metricId) => {
              const metric = metrics.find((m) => m.id === metricId)!
              return (
                <Line
                  key={metricId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )
            })}
          </LineChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {selectedMetrics.map((metricId) => {
              const metric = metrics.find((m) => m.id === metricId)!
              return (
                <Bar
                  key={metricId}
                  dataKey={metricId}
                  fill={metric.color}
                  radius={[4, 4, 0, 0]}
                />
              )
            })}
          </BarChart>
        )
    }
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your social media growth over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-muted rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 rounded-lg",
                chartType === "area" && "bg-background shadow-sm"
              )}
              onClick={() => setChartType("area")}
            >
              <AreaChartIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 rounded-lg",
                chartType === "line" && "bg-background shadow-sm"
              )}
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 rounded-lg",
                chartType === "bar" && "bg-background shadow-sm"
              )}
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isSelected = selectedMetrics.includes(metric.id)
          return (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                isSelected
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isSelected ? "currentColor" : metric.color }}
              />
              <Icon className="w-3.5 h-3.5" />
              {metric.label}
            </button>
          )
        })}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        {metrics
          .filter((m) => selectedMetrics.includes(m.id))
          .map((metric) => {
            const Icon = metric.icon
            const latestValue = filteredData[filteredData.length - 1]?.[metric.id] || 0
            const firstValue = filteredData[0]?.[metric.id] || 0
            const change = firstValue ? ((latestValue - firstValue) / firstValue) * 100 : 0

            return (
              <div key={metric.id} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {metric.id === "engagement"
                    ? `${latestValue.toFixed(1)}%`
                    : latestValue >= 1000
                    ? `${(latestValue / 1000).toFixed(1)}K`
                    : latestValue.toLocaleString()}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] mt-1",
                    change >= 0
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  )}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </Badge>
              </div>
            )
          })}
      </div>
    </Card>
  )
}
