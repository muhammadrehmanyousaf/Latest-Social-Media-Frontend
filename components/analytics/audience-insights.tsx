"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Globe,
  MapPin,
  TrendingUp,
  TrendingDown,
  User,
  UserCircle,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { AudienceDemo, DateRange } from "@/app/analytics/page"

interface AudienceInsightsProps {
  demographics: AudienceDemo
  dateRange: DateRange
}

const genderColors = {
  Female: "#ec4899",
  Male: "#3b82f6",
  Other: "#8b5cf6",
}

const ageColors = ["#f97316", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]

// Country flag emojis (simplified)
const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  BR: "🇧🇷",
  IN: "🇮🇳",
  MX: "🇲🇽",
}

export function AudienceInsights({ demographics, dateRange }: AudienceInsightsProps) {
  const genderData = demographics.gender.map((g) => ({
    ...g,
    color: genderColors[g.label as keyof typeof genderColors] || "#6b7280",
  }))

  const ageData = demographics.ageGroups.map((ag, index) => ({
    ...ag,
    color: ageColors[index % ageColors.length],
    change: ag.value - ag.previousValue,
  }))

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">284.5K</p>
              <p className="text-xs text-muted-foreground">Total Audience</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">+6.2%</p>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">25-34</p>
              <p className="text-xs text-muted-foreground">Top Age Group</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Demographics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Gender Distribution
          </h4>
          <div className="flex items-center gap-8">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {genderData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-2"
                    style={{ "--progress-color": item.color } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Age Distribution */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-4 h-4" />
            Age Distribution
          </h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.change >= 0 ? "+" : ""}${props.payload.change}%)`,
                    "Audience",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {ageData.slice(0, 3).map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Top Countries
          </h4>
          <div className="space-y-4">
            {demographics.topCountries.map((country, index) => (
              <div key={country.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{countryFlags[country.code] || "🌍"}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{country.country}</p>
                      <p className="text-xs text-muted-foreground">{country.value}% of audience</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    country.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {country.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(country.change)}%
                  </div>
                </div>
                <Progress value={country.value} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Top Cities */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Top Cities
          </h4>
          <div className="space-y-4">
            {demographics.topCities.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-sm text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{city.city}</p>
                    <p className="text-xs text-muted-foreground">{city.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{city.value}%</p>
                  <p className="text-xs text-muted-foreground">of audience</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audience Insights */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Audience Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Primary Audience</span>
            </div>
            <p className="text-sm text-foreground">
              Your primary audience is <strong>women aged 25-34</strong> primarily from the{" "}
              <strong>United States</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Growing Segment</span>
            </div>
            <p className="text-sm text-foreground">
              The <strong>18-24 age group</strong> is growing fastest, up{" "}
              <strong>4% from last period</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Expansion Opportunity</span>
            </div>
            <p className="text-sm text-foreground">
              <strong>Germany</strong> shows high engagement rates. Consider creating{" "}
              <strong>localized content</strong>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
