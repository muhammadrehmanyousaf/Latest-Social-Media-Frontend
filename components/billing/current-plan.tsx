"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Crown,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  Zap,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  FolderKanban,
  Users,
  Share2,
  FileText,
  Infinity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Plan, PlanTier, Subscription, Usage } from "@/app/billing/page"

interface CurrentPlanProps {
  currentPlan: Plan
  subscription: Subscription
  usage: Usage
  onManagePlan: () => void
  onCancelPlan: () => void
  onResumePlan: () => void
}

const planIcons: Record<PlanTier, React.ComponentType<{ className?: string }>> = {
  free: Sparkles,
  pro: Zap,
  business: Building2,
  enterprise: Crown,
}

const statusConfig = {
  active: { label: "Active", color: "text-green-600", bgColor: "bg-green-500/10", icon: CheckCircle2 },
  canceled: { label: "Canceled", color: "text-gray-500", bgColor: "bg-gray-500/10", icon: AlertTriangle },
  past_due: { label: "Past Due", color: "text-red-600", bgColor: "bg-red-500/10", icon: AlertTriangle },
  trialing: { label: "Trial", color: "text-blue-600", bgColor: "bg-blue-500/10", icon: Clock },
}

export function CurrentPlan({
  currentPlan,
  subscription,
  usage,
  onManagePlan,
  onCancelPlan,
  onResumePlan,
}: CurrentPlanProps) {
  const PlanIcon = planIcons[currentPlan.id]
  const status = statusConfig[subscription.status]
  const StatusIcon = status.icon

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-amber-500"
    return "bg-primary"
  }

  const formatLimit = (value: number) => {
    if (value === -1) return "Unlimited"
    return value.toString()
  }

  return (
    <div className="space-y-6">
      {/* Main Plan Card */}
      <Card className="overflow-hidden">
        {/* Header Banner */}
        <div
          className="h-20 relative"
          style={{
            background: `linear-gradient(135deg, ${currentPlan.color}40 0%, ${currentPlan.color}80 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        </div>

        <div className="p-6 -mt-10">
          {/* Plan Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-background"
                style={{ backgroundColor: currentPlan.color }}
              >
                <PlanIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">{currentPlan.name} Plan</h2>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold",
                      status.bgColor,
                      status.color,
                      "border-transparent"
                    )}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button onClick={onResumePlan} className="gap-2 rounded-xl">
                  <RefreshCw className="w-4 h-4" />
                  Resume Plan
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onCancelPlan} className="rounded-xl">
                    Cancel Plan
                  </Button>
                  <Button onClick={onManagePlan} className="gap-2 rounded-xl">
                    <ArrowUpRight className="w-4 h-4" />
                    Upgrade
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Cancellation Warning */}
          {subscription.cancelAtPeriodEnd && (
            <Card className="p-4 mb-6 bg-amber-500/10 border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-600 mb-1">
                    Your subscription is set to cancel
                  </p>
                  <p className="text-xs text-amber-600/80">
                    You'll lose access to {currentPlan.name} features on{" "}
                    {format(subscription.currentPeriodEnd, "MMMM d, yyyy")}. Resume your subscription
                    to keep your current plan.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Billing</p>
                  <p className="text-lg font-bold text-foreground">
                    {currentPlan.price.monthly === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${subscription.billingCycle === "monthly"
                          ? currentPlan.price.monthly
                          : currentPlan.price.yearly}
                        <span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Billing Cycle</p>
                  <p className="text-lg font-bold text-foreground capitalize">
                    {subscription.billingCycle}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Access Until" : "Next Billing"}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {format(subscription.currentPeriodEnd, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Usage Overview */}
          <h3 className="text-sm font-semibold text-foreground mb-4">Current Usage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workspaces */}
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Workspaces</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.workspaces} / {formatLimit(currentPlan.workspaceLimit)}
                </span>
              </div>
              {currentPlan.workspaceLimit !== -1 ? (
                <Progress
                  value={getUsagePercentage(usage.workspaces, currentPlan.workspaceLimit)}
                  className="h-2"
                />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Infinity className="w-3 h-3" />
                  <span>Unlimited</span>
                </div>
              )}
            </Card>

            {/* Team Members */}
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Team Members</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.teamMembers} / {formatLimit(currentPlan.teamMemberLimit)}
                </span>
              </div>
              {currentPlan.teamMemberLimit !== -1 ? (
                <Progress
                  value={getUsagePercentage(usage.teamMembers, currentPlan.teamMemberLimit)}
                  className="h-2"
                />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Infinity className="w-3 h-3" />
                  <span>Unlimited</span>
                </div>
              )}
            </Card>

            {/* Channels */}
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Social Channels</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.channels} / {formatLimit(currentPlan.channelLimit)}
                </span>
              </div>
              {currentPlan.channelLimit !== -1 ? (
                <Progress
                  value={getUsagePercentage(usage.channels, currentPlan.channelLimit)}
                  className="h-2"
                />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Infinity className="w-3 h-3" />
                  <span>Unlimited</span>
                </div>
              )}
            </Card>

            {/* Posts */}
            <Card className="p-4 bg-muted/40 border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Posts This Month</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.postsThisMonth} / {formatLimit(currentPlan.postsPerMonth)}
                </span>
              </div>
              {currentPlan.postsPerMonth !== -1 ? (
                <Progress
                  value={getUsagePercentage(usage.postsThisMonth, currentPlan.postsPerMonth)}
                  className="h-2"
                />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Infinity className="w-3 h-3" />
                  <span>Unlimited</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>

      {/* Plan Features */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Included in your plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
