"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Send, Users, Heart, Calendar, Info } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

const sparklineUp = [
  { value: 30 },
  { value: 45 },
  { value: 38 },
  { value: 52 },
  { value: 48 },
  { value: 65 },
  { value: 58 },
  { value: 75 },
  { value: 68 },
  { value: 82 },
]

const sparklineDown = [
  { value: 65 },
  { value: 58 },
  { value: 62 },
  { value: 48 },
  { value: 52 },
  { value: 42 },
  { value: 45 },
  { value: 38 },
  { value: 42 },
  { value: 35 },
]

const stats = [
  {
    title: "Scheduled Posts",
    value: "128",
    change: "+12.5%",
    changeLabel: "vs last week",
    trend: "up" as const,
    icon: Calendar,
    sparkline: sparklineUp,
    accentColor: "#f97316",
  },
  {
    title: "Total Engagement",
    value: "24,521",
    change: "+8.2%",
    changeLabel: "vs last week",
    trend: "up" as const,
    icon: Heart,
    sparkline: sparklineUp,
    accentColor: "#f97316",
  },
  {
    title: "Posts Published",
    value: "342",
    change: "-4.7%",
    changeLabel: "vs last week",
    trend: "down" as const,
    icon: Send,
    sparkline: sparklineDown,
    accentColor: "#ef4444",
  },
  {
    title: "Total Followers",
    value: "89.2K",
    change: "+5.1%",
    changeLabel: "vs last week",
    trend: "up" as const,
    icon: Users,
    sparkline: sparklineUp,
    accentColor: "#f97316",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-muted/80 flex items-center justify-center">
                  <stat.icon className="w-[18px] h-[18px] text-muted-foreground" />
                </div>
                <span className="text-[13px] font-medium text-muted-foreground">{stat.title}</span>
              </div>
              <button className="p-1 rounded-lg text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[28px] font-bold text-foreground tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`inline-flex items-center text-[13px] font-semibold ${
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
                </div>
              </div>
              <div className="w-24 h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.sparkline}>
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stat.accentColor} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={stat.accentColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={stat.accentColor}
                      strokeWidth={2}
                      fill={`url(#gradient-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
