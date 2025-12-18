"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react"

const engagementData = [
  { month: "Jan", engagement: 4200 },
  { month: "Feb", engagement: 5100 },
  { month: "Mar", engagement: 4800 },
  { month: "Apr", engagement: 6400 },
  { month: "May", engagement: 5800 },
  { month: "Jun", engagement: 7200 },
  { month: "Jul", engagement: 6800 },
  { month: "Aug", engagement: 8100 },
]

const platformData = [
  { name: "Website", yesterday: "1,23K", today: "10,24K", change: 34.7, positive: true, color: "#f97316" },
  { name: "Marketplace", yesterday: "590", today: "180K", change: 80.5, positive: true, color: "#84cc16" },
  { name: "Retail POS", yesterday: "986", today: "598", change: 15.6, positive: false, color: "#f97316" },
]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Engagement Analytics - Takes 2 columns */}
      <Card className="bg-card border-border shadow-sm xl:col-span-2">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Engagement Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Performance of your active campaigns</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[110px] h-9 text-xs bg-muted/60 border-0 rounded-lg font-medium">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button variant="ghost" size="sm" className="h-9 px-3 text-xs rounded-none bg-muted/60 font-medium">
                  Line
                </Button>
                <Button variant="ghost" size="sm" className="h-9 px-3 text-xs rounded-none font-medium">
                  Bar
                </Button>
              </div>
            </div>
          </div>
          {/* Legend and Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-5 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f97316]" />
              <span className="text-sm text-foreground font-medium">Engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">98% Success</span>
              <span className="flex items-center text-xs text-success font-semibold">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                16.2%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Automation</span>
              <span className="flex items-center text-xs text-destructive font-semibold">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                4.7%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="flex items-center text-xs text-success font-semibold">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                20.9%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(v) => `${v / 1000}K`}
                  dx={-5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                    padding: "10px 14px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: "#6b7280", fontSize: 13 }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#engagementGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Performance - Business Traffics style */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Business Traffics</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Keep an eye to your business orders</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {/* Traffic Target Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">240K / 500 M Traffic targets</span>
              <span className="flex items-center text-xs text-success font-semibold">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                5.2% vs yesterday
              </span>
            </div>
            <div className="flex gap-0.5 h-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${i < 10 ? "bg-gradient-to-b from-primary to-primary/70" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>

          {/* Platform Stats Table */}
          <div className="space-y-0">
            <div className="grid grid-cols-3 py-2.5 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Platforms</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">
                Yesterday
              </span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                Today
              </span>
            </div>
            {platformData.map((platform) => (
              <div
                key={platform.name}
                className="grid grid-cols-3 py-3 border-b border-border last:border-0 items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                </div>
                <span className="text-sm text-muted-foreground text-center">{platform.yesterday}</span>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-foreground">{platform.today}</span>
                  <span className={`text-xs font-semibold ${platform.positive ? "text-success" : "text-destructive"}`}>
                    {platform.positive ? "↑" : "↓"} {platform.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
