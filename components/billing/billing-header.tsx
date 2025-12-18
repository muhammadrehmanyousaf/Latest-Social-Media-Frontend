"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Sparkles,
  Receipt,
  BarChart3,
  Crown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ViewTab, Plan, Subscription } from "@/app/billing/page"

interface BillingHeaderProps {
  activeTab: ViewTab
  onTabChange: (tab: ViewTab) => void
  currentPlan: Plan
  subscription: Subscription
}

const tabs: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "plans", label: "Plans & Pricing", icon: Sparkles },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "usage", label: "Usage", icon: BarChart3 },
]

export function BillingHeader({
  activeTab,
  onTabChange,
  currentPlan,
  subscription,
}: BillingHeaderProps) {
  const statusConfig = {
    active: { label: "Active", color: "text-green-600", bgColor: "bg-green-500/10", icon: CheckCircle2 },
    canceled: { label: "Canceled", color: "text-gray-500", bgColor: "bg-gray-500/10", icon: AlertTriangle },
    past_due: { label: "Past Due", color: "text-red-600", bgColor: "bg-red-500/10", icon: AlertTriangle },
    trialing: { label: "Trial", color: "text-blue-600", bgColor: "bg-blue-500/10", icon: Sparkles },
  }

  const status = statusConfig[subscription.status]
  const StatusIcon = status.icon

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Billing & Plans</h1>
            <p className="text-sm text-muted-foreground">
              Manage your subscription and billing
            </p>
          </div>
        </div>

        {/* Current Plan Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60">
            <Crown className="w-4 h-4" style={{ color: currentPlan.color }} />
            <span className="text-sm font-semibold text-foreground">{currentPlan.name} Plan</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold ml-1",
                status.bgColor,
                status.color,
                "border-transparent"
              )}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      {subscription.cancelAtPeriodEnd && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-600">
            Your subscription will end on {format(subscription.currentPeriodEnd, "MMMM d, yyyy")}. You can resume anytime before then.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
