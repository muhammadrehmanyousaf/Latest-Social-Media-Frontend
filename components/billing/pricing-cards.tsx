"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Check,
  X,
  Sparkles,
  Zap,
  Building2,
  Crown,
  ArrowRight,
  Users,
  FolderKanban,
  Share2,
  Calendar,
  BarChart3,
  Headphones,
  Shield,
  Infinity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Plan, PlanTier, BillingCycle } from "@/app/billing/page"

interface PricingCardsProps {
  plans: Plan[]
  currentPlan: Plan
  billingCycle: BillingCycle
  onBillingCycleChange: (cycle: BillingCycle) => void
  onSelectPlan: (planId: PlanTier) => void
  isProcessing: boolean
}

const planIcons: Record<PlanTier, React.ComponentType<{ className?: string }>> = {
  free: Sparkles,
  pro: Zap,
  business: Building2,
  enterprise: Crown,
}

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  workspaces: FolderKanban,
  members: Users,
  channels: Share2,
  posts: Calendar,
  analytics: BarChart3,
  support: Headphones,
  security: Shield,
}

export function PricingCards({
  plans,
  currentPlan,
  billingCycle,
  onBillingCycleChange,
  onSelectPlan,
  isProcessing,
}: PricingCardsProps) {
  const [hoveredPlan, setHoveredPlan] = useState<PlanTier | null>(null)

  const getPrice = (plan: Plan) => {
    if (plan.price.monthly === 0) return "Free"
    return billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly
  }

  const getSavings = (plan: Plan) => {
    if (plan.price.monthly === 0) return 0
    const monthlyCost = plan.price.monthly * 12
    const yearlyCost = plan.price.yearly * 12
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100)
  }

  const getPlanOrder = (tier: PlanTier): number => {
    const order: Record<PlanTier, number> = { free: 0, pro: 1, business: 2, enterprise: 3 }
    return order[tier]
  }

  const canUpgrade = (plan: Plan) => getPlanOrder(plan.id) > getPlanOrder(currentPlan.id)
  const canDowngrade = (plan: Plan) => getPlanOrder(plan.id) < getPlanOrder(currentPlan.id)
  const isCurrent = (plan: Plan) => plan.id === currentPlan.id

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn(
          "text-sm font-medium transition-colors",
          billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
        )}>
          Monthly
        </span>
        <Switch
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) => onBillingCycleChange(checked ? "yearly" : "monthly")}
        />
        <span className={cn(
          "text-sm font-medium transition-colors flex items-center gap-2",
          billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
        )}>
          Yearly
          <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px]">
            Save up to 20%
          </Badge>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const Icon = planIcons[plan.id]
          const isPopular = plan.id === "pro"
          const isEnterprise = plan.id === "enterprise"
          const price = getPrice(plan)
          const savings = getSavings(plan)

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                isPopular && "ring-2 ring-primary shadow-lg",
                hoveredPlan === plan.id && "shadow-xl scale-[1.02]",
                isCurrent(plan) && "ring-2 ring-green-500"
              )}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold py-1.5 text-center">
                  Most Popular
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent(plan) && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold py-1.5 text-center">
                  Current Plan
                </div>
              )}

              <div className={cn("p-6", (isPopular || isCurrent(plan)) && "pt-10")}>
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {isEnterprise ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">Custom</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      {typeof price === "number" ? (
                        <>
                          <span className="text-3xl font-bold text-foreground">${price}</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-foreground">{price}</span>
                      )}
                    </div>
                  )}
                  {billingCycle === "yearly" && savings > 0 && !isEnterprise && (
                    <p className="text-xs text-green-600 mt-1">
                      Save {savings}% with yearly billing
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full mb-6 gap-2 rounded-xl",
                    isPopular && !isCurrent(plan) && "bg-gradient-to-r from-primary to-primary/90"
                  )}
                  variant={isCurrent(plan) ? "outline" : canDowngrade(plan) ? "outline" : "default"}
                  disabled={isCurrent(plan) || isProcessing}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {isCurrent(plan) ? (
                    "Current Plan"
                  ) : isEnterprise ? (
                    <>Contact Sales</>
                  ) : canUpgrade(plan) ? (
                    <>
                      Upgrade
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    "Downgrade"
                  )}
                </Button>

                {/* Features List */}
                <div className="space-y-3">
                  {/* Workspaces */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {plan.workspaceLimit === -1 ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="w-4 h-4" /> Unlimited workspaces
                        </span>
                      ) : (
                        `${plan.workspaceLimit} workspace${plan.workspaceLimit > 1 ? "s" : ""}`
                      )}
                    </span>
                  </div>

                  {/* Team Members */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {plan.teamMemberLimit === -1 ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="w-4 h-4" /> Unlimited team members
                        </span>
                      ) : (
                        `${plan.teamMemberLimit} team member${plan.teamMemberLimit > 1 ? "s" : ""}`
                      )}
                    </span>
                  </div>

                  {/* Channels */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {plan.channelLimit === -1 ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="w-4 h-4" /> Unlimited channels
                        </span>
                      ) : (
                        `${plan.channelLimit} social channel${plan.channelLimit > 1 ? "s" : ""}`
                      )}
                    </span>
                  </div>

                  {/* Posts */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {plan.postsPerMonth === -1 ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="w-4 h-4" /> Unlimited posts
                        </span>
                      ) : (
                        `${plan.postsPerMonth} posts/month`
                      )}
                    </span>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="pt-3 border-t border-border space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Enterprise CTA */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Crown className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Need a custom solution?</h3>
              <p className="text-sm text-muted-foreground">
                Get a tailored plan with custom limits, dedicated support, and advanced security features.
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl shrink-0">
            <Headphones className="w-4 h-4" />
            Talk to Sales
          </Button>
        </div>
      </Card>
    </div>
  )
}
