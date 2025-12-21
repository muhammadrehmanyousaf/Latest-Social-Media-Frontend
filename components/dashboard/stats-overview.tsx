"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Users,
  Heart,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  MousePointer,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts"
import type { DashboardStats } from "@/app/page"

interface StatsOverviewProps {
  stats: DashboardStats
  refreshing: boolean
}

interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  sparklineData: number[]
  suffix?: string
  prefix?: string
  delay?: number
  refreshing: boolean
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgColor,
  sparklineData,
  suffix = "",
  prefix = "",
  delay = 0,
  refreshing,
}: StatCardProps) {
  const [animated, setAnimated] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)

  const chartData = sparklineData.map((v, i) => ({ value: v }))
  const isPositive = change >= 0

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (animated && typeof value === "number") {
      const duration = 1500
      const steps = 60
      const stepValue = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    } else if (typeof value === "string") {
      setDisplayValue(parseFloat(value) || 0)
    }
  }, [animated, value])

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group",
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        refreshing && "animate-pulse"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          bgColor
        )}
        style={{ opacity: 0.03 }}
      />

      {/* Sparkline Background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.replace("text-", "").includes("-") ? `var(--${color.split("-")[0]}-500)` : color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color.replace("text-", "").includes("-") ? `var(--${color.split("-")[0]}-500)` : color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isPositive
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {prefix}
            {typeof value === "number" ? formatNumber(displayValue) : value}
            {suffix}
          </p>
        </div>
      </div>
    </Card>
  )
}

export function StatsOverview({ stats, refreshing }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Followers",
      value: stats.totalFollowers,
      change: stats.followersChange,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      sparklineData: [65, 72, 68, 78, 85, 82, 90, 95, 92, 100],
    },
    {
      title: "Engagement Rate",
      value: stats.engagementRate.toFixed(1),
      change: stats.engagementChange,
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      sparklineData: [40, 45, 52, 48, 55, 60, 58, 65, 62, 70],
      suffix: "%",
    },
    {
      title: "Total Reach",
      value: stats.totalReach,
      change: stats.reachChange,
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      sparklineData: [50, 58, 62, 70, 75, 72, 80, 85, 88, 95],
    },
    {
      title: "Impressions",
      value: stats.impressions,
      change: stats.impressionsChange,
      icon: BarChart3,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      sparklineData: [55, 60, 65, 72, 78, 75, 82, 88, 92, 98],
    },
    {
      title: "Profile Visits",
      value: stats.profileVisits,
      change: stats.visitsChange,
      icon: MousePointer,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      sparklineData: [45, 50, 48, 55, 60, 65, 62, 70, 75, 80],
    },
    {
      title: "Scheduled Posts",
      value: stats.postsScheduled,
      change: 0,
      icon: Calendar,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      sparklineData: [20, 22, 25, 24, 28, 30, 32, 28, 26, 24],
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <StatCard
          key={card.title}
          {...card}
          delay={index * 100}
          refreshing={refreshing}
        />
      ))}
    </div>
  )
}
