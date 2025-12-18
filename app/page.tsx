import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { ChartsSection } from "@/components/charts-section"
import { ScheduledPosts } from "@/components/scheduled-posts"
import { ActivityFeed } from "@/components/activity-feed"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
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
      </div>
    </div>
  )
}
