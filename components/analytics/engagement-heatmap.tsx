"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  TrendingUp,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { HeatmapData } from "@/app/analytics/page"

interface EngagementHeatmapProps {
  data: HeatmapData[]
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const hours = Array.from({ length: 24 }, (_, i) => i)

const formatHour = (hour: number): string => {
  if (hour === 0) return "12am"
  if (hour === 12) return "12pm"
  if (hour < 12) return `${hour}am`
  return `${hour - 12}pm`
}

const getTimeOfDayIcon = (hour: number) => {
  if (hour >= 5 && hour < 9) return Sunrise
  if (hour >= 9 && hour < 17) return Sun
  if (hour >= 17 && hour < 21) return Sunset
  return Moon
}

const getHeatColor = (value: number): string => {
  // Value is 0-100
  if (value >= 80) return "bg-green-500"
  if (value >= 60) return "bg-green-400"
  if (value >= 40) return "bg-yellow-400"
  if (value >= 20) return "bg-orange-300"
  return "bg-gray-200 dark:bg-gray-700"
}

const getHeatOpacity = (value: number): number => {
  return 0.3 + (value / 100) * 0.7
}

export function EngagementHeatmap({ data }: EngagementHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null)

  // Find best times to post
  const sortedData = [...data].sort((a, b) => b.value - a.value)
  const bestTimes = sortedData.slice(0, 5)

  // Get value for specific day/hour
  const getValue = (day: number, hour: number): number => {
    const cell = data.find((d) => d.day === day && d.hour === hour)
    return cell?.value || 0
  }

  // Calculate day averages
  const dayAverages = days.map((_, dayIndex) => {
    const dayData = data.filter((d) => d.day === dayIndex)
    const avg = dayData.reduce((sum, d) => sum + d.value, 0) / dayData.length
    return { day: dayIndex, average: avg }
  }).sort((a, b) => b.average - a.average)

  // Calculate hour averages
  const hourAverages = hours.map((hour) => {
    const hourData = data.filter((d) => d.hour === hour)
    const avg = hourData.reduce((sum, d) => sum + d.value, 0) / hourData.length
    return { hour, average: avg }
  }).sort((a, b) => b.average - a.average)

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Best Times to Post
          </h3>
          <p className="text-sm text-muted-foreground">
            Based on your audience engagement patterns
          </p>
        </div>

        {/* Best Times Summary */}
        <div className="flex flex-wrap gap-2">
          {bestTimes.slice(0, 3).map((time, index) => {
            const TimeIcon = getTimeOfDayIcon(time.hour)
            return (
              <Badge
                key={`${time.day}-${time.hour}`}
                variant="secondary"
                className={cn(
                  "px-3 py-1.5 gap-2",
                  index === 0 && "bg-green-500/10 text-green-600 border-green-500/20"
                )}
              >
                <TimeIcon className="w-3.5 h-3.5" />
                {days[time.day]} {formatHour(time.hour)}
                {index === 0 && <Sparkles className="w-3 h-3" />}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour Labels */}
          <div className="flex mb-2 ml-12">
            {hours.filter((_, i) => i % 3 === 0).map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-xs text-muted-foreground"
                style={{ minWidth: "48px" }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          <div className="space-y-1">
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                {/* Day Label */}
                <div className="w-10 text-xs font-medium text-muted-foreground text-right">
                  {day}
                </div>

                {/* Hour Cells */}
                <div className="flex flex-1 gap-0.5">
                  {hours.map((hour) => {
                    const value = getValue(dayIndex, hour)
                    const isHovered = hoveredCell?.day === dayIndex && hoveredCell?.hour === hour
                    const isBestTime = bestTimes.some((t) => t.day === dayIndex && t.hour === hour)

                    return (
                      <div
                        key={hour}
                        className={cn(
                          "flex-1 h-8 rounded-sm cursor-pointer transition-all relative",
                          getHeatColor(value),
                          isHovered && "ring-2 ring-primary ring-offset-1",
                          isBestTime && "ring-1 ring-green-500"
                        )}
                        style={{ opacity: getHeatOpacity(value), minWidth: "16px" }}
                        onMouseEnter={() => setHoveredCell({ day: dayIndex, hour })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isBestTime && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Low Engagement</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
              <div className="w-6 h-4 rounded-sm bg-orange-300" />
              <div className="w-6 h-4 rounded-sm bg-yellow-400" />
              <div className="w-6 h-4 rounded-sm bg-green-400" />
              <div className="w-6 h-4 rounded-sm bg-green-500" />
            </div>
            <span className="text-xs text-muted-foreground">High Engagement</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-3 rounded-xl bg-muted/60 text-center">
          <p className="text-sm font-medium text-foreground">
            {days[hoveredCell.day]} at {formatHour(hoveredCell.hour)}
          </p>
          <p className="text-xs text-muted-foreground">
            Engagement Score: {getValue(hoveredCell.day, hoveredCell.hour)}%
          </p>
        </div>
      )}

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Best Days */}
        <div className="p-4 rounded-xl bg-muted/40">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Best Days to Post
          </h4>
          <div className="space-y-2">
            {dayAverages.slice(0, 3).map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{days[day.day]}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {day.average.toFixed(0)}% avg
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Best Hours */}
        <div className="p-4 rounded-xl bg-muted/40">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Best Hours to Post
          </h4>
          <div className="space-y-2">
            {hourAverages.slice(0, 3).map((hour, index) => {
              const TimeIcon = getTimeOfDayIcon(hour.hour)
              return (
                <div key={hour.hour} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <TimeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{formatHour(hour.hour)}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {hour.average.toFixed(0)}% avg
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
