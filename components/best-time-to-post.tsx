"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  Sun,
  Moon,
  Coffee,
  Sunset,
  Info,
  Check,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, setHours, setMinutes } from "date-fns"

interface TimeSlot {
  time: string
  hour: number
  score: number
  engagement: number
  reach: number
  label: "peak" | "good" | "moderate" | "low"
  reason: string
}

interface DayAnalysis {
  day: string
  date: Date
  bestSlots: TimeSlot[]
  overallScore: number
}

interface PlatformInsight {
  platform: string
  bestDay: string
  bestTime: string
  peakHours: string[]
  audienceActivity: number
  recommendation: string
}

interface BestTimeToPostProps {
  platform?: string
  onSelectTime?: (date: Date) => void
  trigger?: React.ReactNode
}

const platformInsights: Record<string, PlatformInsight> = {
  twitter: {
    platform: "X (Twitter)",
    bestDay: "Wednesday",
    bestTime: "9:00 AM",
    peakHours: ["9 AM", "12 PM", "5 PM"],
    audienceActivity: 78,
    recommendation: "Your audience is most active during weekday mornings. News and trending content performs best early morning.",
  },
  instagram: {
    platform: "Instagram",
    bestDay: "Tuesday",
    bestTime: "11:00 AM",
    peakHours: ["11 AM", "2 PM", "7 PM"],
    audienceActivity: 85,
    recommendation: "Visual content performs best during lunch breaks and evening hours when users are relaxing.",
  },
  facebook: {
    platform: "Facebook",
    bestDay: "Thursday",
    bestTime: "1:00 PM",
    peakHours: ["1 PM", "3 PM", "9 PM"],
    audienceActivity: 72,
    recommendation: "Afternoon posts see highest engagement. Your audience browses during work breaks and evenings.",
  },
  linkedin: {
    platform: "LinkedIn",
    bestDay: "Tuesday",
    bestTime: "10:00 AM",
    peakHours: ["8 AM", "10 AM", "12 PM"],
    audienceActivity: 68,
    recommendation: "Professional content performs best during business hours, especially mid-morning.",
  },
  tiktok: {
    platform: "TikTok",
    bestDay: "Friday",
    bestTime: "7:00 PM",
    peakHours: ["7 PM", "9 PM", "11 PM"],
    audienceActivity: 92,
    recommendation: "Evening and late-night content gets the most views when users are unwinding.",
  },
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const peakHours = [9, 12, 17, 19, 21]
  const goodHours = [8, 10, 11, 13, 14, 18, 20]

  for (let hour = 6; hour <= 23; hour++) {
    let score = 30 + Math.random() * 20
    let label: TimeSlot["label"] = "low"
    let reason = "Lower audience activity expected"

    if (peakHours.includes(hour)) {
      score = 80 + Math.random() * 20
      label = "peak"
      reason = "Peak engagement time based on your audience data"
    } else if (goodHours.includes(hour)) {
      score = 60 + Math.random() * 20
      label = "good"
      reason = "Good engagement potential"
    } else if (hour >= 7 && hour <= 22) {
      score = 40 + Math.random() * 20
      label = "moderate"
      reason = "Moderate audience activity"
    }

    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      hour,
      score: Math.round(score),
      engagement: Math.round(score * 0.8 + Math.random() * 20),
      reach: Math.round(score * 1.2 + Math.random() * 30),
      label,
      reason,
    })
  }

  return slots
}

const generateWeekAnalysis = (): DayAnalysis[] => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i)
    const dayName = days[date.getDay()]
    const allSlots = generateTimeSlots()
    const bestSlots = allSlots
      .filter((s) => s.label === "peak" || s.label === "good")
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    return {
      day: dayName,
      date,
      bestSlots,
      overallScore: Math.round(bestSlots.reduce((acc, s) => acc + s.score, 0) / bestSlots.length),
    }
  })
}

const getTimeIcon = (hour: number) => {
  if (hour >= 5 && hour < 12) return Sun
  if (hour >= 12 && hour < 17) return Coffee
  if (hour >= 17 && hour < 20) return Sunset
  return Moon
}

const getLabelColor = (label: TimeSlot["label"]) => {
  switch (label) {
    case "peak":
      return "bg-green-500"
    case "good":
      return "bg-blue-500"
    case "moderate":
      return "bg-amber-500"
    case "low":
      return "bg-gray-400"
  }
}

export function BestTimeToPost({ platform = "all", onSelectTime, trigger }: BestTimeToPostProps) {
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(platform)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [weekAnalysis, setWeekAnalysis] = useState<DayAnalysis[]>([])
  const [selectedDay, setSelectedDay] = useState<DayAnalysis | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (open) {
      setIsAnalyzing(true)
      // Simulate AI analysis
      setTimeout(() => {
        setWeekAnalysis(generateWeekAnalysis())
        setTimeSlots(generateTimeSlots())
        setIsAnalyzing(false)
      }, 1500)
    }
  }, [open])

  useEffect(() => {
    if (weekAnalysis.length > 0 && !selectedDay) {
      setSelectedDay(weekAnalysis[0])
    }
  }, [weekAnalysis, selectedDay])

  const handleSelectTime = (slot: TimeSlot) => {
    if (selectedDay && onSelectTime) {
      const date = setMinutes(setHours(selectedDay.date, slot.hour), 0)
      onSelectTime(date)
      setOpen(false)
    }
  }

  const insight = platformInsights[selectedPlatform] || platformInsights.instagram

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Best Time to Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                AI Best Time to Post
              </DialogTitle>
              <DialogDescription>
                AI-powered recommendations based on your audience activity
              </DialogDescription>
            </div>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
            <h3 className="font-medium mb-1">Analyzing Your Audience</h3>
            <p className="text-sm text-muted-foreground">
              Finding the best times based on engagement patterns...
            </p>
          </div>
        ) : (
          <div className="flex h-[500px]">
            {/* Left Panel - Day Selection */}
            <div className="w-[200px] border-r p-4 flex flex-col">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Select Day
              </h3>
              <ScrollArea className="flex-1 -mx-2">
                <div className="px-2 space-y-1">
                  {weekAnalysis.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-all",
                        selectedDay?.day === day.day
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/60"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{day.day}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 px-1.5 text-[10px]",
                            day.overallScore >= 80
                              ? "bg-green-500/10 text-green-600"
                              : day.overallScore >= 60
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-gray-500/10 text-gray-600"
                          )}
                        >
                          {day.overallScore}%
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {format(day.date, "MMM d")}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Time Analysis */}
            <div className="flex-1 flex flex-col">
              {/* Platform Insight Card */}
              <div className="p-4 border-b">
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 border border-violet-500/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">AI Recommendation</span>
                        <Badge variant="secondary" className="text-[10px] gap-1">
                          <Zap className="w-3 h-3" />
                          {insight.audienceActivity}% Activity
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Times for Selected Day */}
              <div className="p-4 border-b">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Best Times for {selectedDay?.day}
                </h3>
                <div className="flex gap-2">
                  {selectedDay?.bestSlots.map((slot, index) => {
                    const TimeIcon = getTimeIcon(slot.hour)
                    return (
                      <button
                        key={slot.time}
                        onClick={() => handleSelectTime(slot)}
                        className={cn(
                          "flex-1 p-3 rounded-xl border transition-all hover:border-primary/50 hover:bg-primary/5 group",
                          index === 0 && "border-green-500/30 bg-green-500/5"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              index === 0
                                ? "bg-green-500 text-white"
                                : "bg-muted"
                            )}
                          >
                            <TimeIcon className="w-4 h-4" />
                          </div>
                          {index === 0 && (
                            <Badge className="bg-green-500 text-white text-[10px]">
                              Top Pick
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-lg">{slot.time}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          {slot.score}% score
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Full Day Timeline */}
              <div className="flex-1 overflow-hidden">
                <div className="p-4 pb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Day Timeline
                  </h3>
                </div>
                <ScrollArea className="h-[calc(100%-40px)]">
                  <div className="px-4 pb-4 space-y-1">
                    {timeSlots.map((slot) => {
                      const TimeIcon = getTimeIcon(slot.hour)
                      return (
                        <TooltipProvider key={slot.time}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleSelectTime(slot)}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                              >
                                <span className="w-12 text-sm text-muted-foreground">
                                  {slot.time}
                                </span>
                                <div className="flex-1">
                                  <div className="h-6 rounded-full bg-muted/50 overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full transition-all",
                                        getLabelColor(slot.label)
                                      )}
                                      style={{ width: `${slot.score}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="w-10 text-sm font-medium text-right">
                                  {slot.score}%
                                </span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-[200px]">
                              <p className="font-medium mb-1">{slot.time}</p>
                              <p className="text-xs text-muted-foreground">{slot.reason}</p>
                              <div className="flex gap-3 mt-2 text-xs">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {slot.engagement}%
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {slot.reach}%
                                </span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Peak (80%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Good (60-80%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Moderate (40-60%)
            </span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            View Full Analytics
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Compact card version for dashboard
export function BestTimeCard({ platform = "all" }: { platform?: string }) {
  const [nextBestTime, setNextBestTime] = useState<{ time: string; score: number } | null>(null)

  useEffect(() => {
    // Get next best posting time
    const now = new Date()
    const hour = now.getHours()
    const peakHours = [9, 12, 17, 19, 21]
    const nextPeak = peakHours.find((h) => h > hour) || peakHours[0]
    setNextBestTime({
      time: `${nextPeak}:00`,
      score: 85 + Math.floor(Math.random() * 10),
    })
  }, [])

  if (!nextBestTime) return null

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Best time to post today</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{nextBestTime.time}</span>
            <Badge className="bg-green-500 text-white text-[10px]">
              {nextBestTime.score}% optimal
            </Badge>
          </div>
        </div>
        <BestTimeToPost
          platform={platform}
          trigger={
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </Button>
          }
        />
      </div>
    </div>
  )
}
