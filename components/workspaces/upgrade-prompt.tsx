"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  X,
  Crown,
  Sparkles,
  ArrowRight,
  Check,
  FolderKanban,
  Users,
  Share2,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  currentPlan: string
  workspaceLimit: number
  onClose: () => void
}

const upgradeFeatures = [
  {
    icon: FolderKanban,
    title: "More Workspaces",
    description: "Organize your projects better with additional workspaces",
  },
  {
    icon: Users,
    title: "Larger Teams",
    description: "Invite more team members to collaborate",
  },
  {
    icon: Share2,
    title: "More Channels",
    description: "Connect additional social media accounts",
  },
  {
    icon: Zap,
    title: "Advanced Features",
    description: "Access AI tools, analytics, and automation",
  },
]

const plans = [
  {
    name: "Pro",
    price: 29,
    workspaces: 3,
    highlight: false,
  },
  {
    name: "Business",
    price: 79,
    workspaces: 10,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: null,
    workspaces: -1,
    highlight: false,
  },
]

export function UpgradePrompt({ currentPlan, workspaceLimit, onClose }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-lg overflow-hidden bg-card border-border shadow-2xl">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/20 to-transparent" />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Workspace Limit Reached
            </h2>
            <p className="text-sm text-muted-foreground">
              You&apos;ve reached the maximum of {workspaceLimit} workspace{workspaceLimit !== 1 ? "s" : ""} on your{" "}
              <span className="font-medium text-foreground">{currentPlan}</span> plan. Upgrade to
              create more workspaces.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {upgradeFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-3 rounded-xl bg-muted/40 border border-border"
                >
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs font-semibold text-foreground mb-0.5">
                    {feature.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Plans comparison */}
          <div className="space-y-2 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  plan.highlight
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {plan.highlight && <Sparkles className="w-4 h-4 text-primary" />}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.workspaces === -1 ? "Unlimited" : plan.workspaces} workspaces
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {plan.price ? (
                    <>
                      <p className="text-lg font-bold text-foreground">${plan.price}</p>
                      <p className="text-[10px] text-muted-foreground">/month</p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">Custom</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link href="/billing" className="block">
              <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 h-12">
                <Sparkles className="w-4 h-4" />
                View All Plans
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Maybe Later
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-green-600" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-green-600" />
              Instant upgrade
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-green-600" />
              14-day refund
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
