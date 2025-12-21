"use client"

import { usePageHeader } from "@/components/page-context"
import { LayoutDashboard } from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { ChartsSection } from "@/components/charts-section"
import { ScheduledPosts } from "@/components/scheduled-posts"
import { ActivityFeed } from "@/components/activity-feed"

export default function DashboardPage() {
  usePageHeader({
    title: "Dashboard",
    icon: LayoutDashboard,
    subtitle: "Here's your social media overview",
  })

  return (
    <main className="flex-1 p-5 lg:p-6 space-y-5 overflow-y-auto">
      <StatsCards />
      <ChartsSection />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ScheduledPosts />
        </div>
        <div className="xl:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </main>
  )
}
