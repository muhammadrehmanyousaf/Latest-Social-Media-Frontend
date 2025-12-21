"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Clock } from "lucide-react"
import { ScheduleHeader } from "@/components/schedule/schedule-header"
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar"
import { ScheduleList } from "@/components/schedule/schedule-list"
import { ScheduleTimeline } from "@/components/schedule/schedule-timeline"
import { ScheduleFilters } from "@/components/schedule/schedule-filters"

export type ViewMode = "calendar" | "list" | "timeline"
export type CalendarView = "month" | "week" | "day"
export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok"
export type PostStatus = "scheduled" | "published" | "draft" | "failed"

export interface ScheduledPost {
  id: string
  content: string
  platform: Platform
  scheduledDate: Date
  scheduledTime: string
  status: PostStatus
  image?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

export default function SchedulePage() {
  usePageHeader({
    title: "Schedule",
    subtitle: "Manage your scheduled posts",
    icon: Clock,
  })

  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [calendarView, setCalendarView] = useState<CalendarView>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<PostStatus[]>([])

  return (
    <>
      <ScheduleHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        calendarView={calendarView}
        onCalendarViewChange={setCalendarView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        <ScheduleFilters
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
          selectedStatuses={selectedStatuses}
          onStatusesChange={setSelectedStatuses}
        />

        {/* Main Content */}
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">
          {viewMode === "calendar" && (
            <ScheduleCalendar
              view={calendarView}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              selectedPlatforms={selectedPlatforms}
              selectedStatuses={selectedStatuses}
            />
          )}
          {viewMode === "list" && (
            <ScheduleList
              currentDate={currentDate}
              selectedPlatforms={selectedPlatforms}
              selectedStatuses={selectedStatuses}
            />
          )}
          {viewMode === "timeline" && (
            <ScheduleTimeline
              currentDate={currentDate}
              selectedPlatforms={selectedPlatforms}
              selectedStatuses={selectedStatuses}
            />
          )}
        </main>
      </div>
    </>
  )
}
