"use client"

import { Button } from "@/components/ui/button"
import {
  Calendar,
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Settings2,
  CalendarDays,
  CalendarRange,
  CalendarClock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewMode, CalendarView } from "@/app/schedule/page"
import Link from "next/link"

interface ScheduleHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  calendarView: CalendarView
  onCalendarViewChange: (view: CalendarView) => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function ScheduleHeader({
  viewMode,
  onViewModeChange,
  calendarView,
  onCalendarViewChange,
  currentDate,
  onDateChange,
}: ScheduleHeaderProps) {
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
    if (calendarView === "month") {
      return currentDate.toLocaleDateString("en-US", options)
    } else if (calendarView === "week") {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (calendarView === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (calendarView === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <header className="border-b border-border bg-card shrink-0">
      {/* Top Row */}
      <div className="flex items-center justify-between h-[70px] px-5 lg:px-6">
        <div className="flex items-center gap-4 ml-12 lg:ml-0">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Content Schedule</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plan and manage your social media content
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 bg-transparent rounded-xl h-9 text-xs font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-2 bg-transparent rounded-xl h-9 text-xs font-medium"
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </Button>

          <Button asChild size="sm" className="gap-2 rounded-xl h-9 shadow-sm font-semibold text-xs">
            <Link href="/create-post">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Post</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom Row - Navigation & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 lg:px-6 py-3 bg-muted/30">
        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <h2 className="text-sm font-semibold text-foreground min-w-[180px]">{formatDateRange()}</h2>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs bg-transparent rounded-lg font-medium"
            onClick={goToToday}
          >
            Today
          </Button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Calendar View Selector */}
          {viewMode === "calendar" && (
            <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg mr-2">
              {[
                { value: "month" as CalendarView, label: "Month", icon: CalendarDays },
                { value: "week" as CalendarView, label: "Week", icon: CalendarRange },
                { value: "day" as CalendarView, label: "Day", icon: CalendarClock },
              ].map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs rounded-md gap-1.5 font-medium",
                    calendarView === item.value
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onCalendarViewChange(item.value)}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          )}

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg">
            {[
              { value: "calendar" as ViewMode, label: "Calendar", icon: Calendar },
              { value: "list" as ViewMode, label: "List", icon: List },
              { value: "timeline" as ViewMode, label: "Timeline", icon: Clock },
            ].map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 px-3 text-xs rounded-md gap-1.5 font-medium",
                  viewMode === item.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onViewModeChange(item.value)}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
