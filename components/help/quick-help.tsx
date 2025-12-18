"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Zap,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Keyboard,
  RefreshCw,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickHelpProps {}

const quickHelpItems = [
  {
    id: "getting-started",
    title: "Getting Started Guide",
    description: "New to SocialFlow? Start here for a complete walkthrough",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    badge: "Recommended",
    badgeColor: "bg-blue-500",
  },
  {
    id: "whats-new",
    title: "What's New",
    description: "Latest features and improvements in SocialFlow",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600",
    badge: "Updated",
    badgeColor: "bg-purple-500",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Guide",
    description: "Having issues? Find solutions to common problems",
    icon: AlertTriangle,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
    badge: null,
    badgeColor: null,
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Speed up your workflow with these handy shortcuts",
    icon: Keyboard,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
    badge: null,
    badgeColor: null,
  },
]

const statusItems = [
  {
    id: "api-status",
    title: "API Status",
    status: "operational",
    icon: RefreshCw,
  },
  {
    id: "security",
    title: "Security",
    status: "secure",
    icon: Shield,
  },
]

export function QuickHelp({}: QuickHelpProps) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickHelpItems.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="group relative overflow-hidden p-5 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Border Effect */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                  item.color
                )}
                style={{
                  maskImage: "linear-gradient(to bottom, transparent 0%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 100%)",
                }}
              />

              {/* Badge */}
              {item.badge && (
                <Badge
                  className={cn(
                    "absolute top-4 right-4 text-[10px]",
                    item.badgeColor,
                    "text-white border-0"
                  )}
                >
                  {item.badge}
                </Badge>
              )}

              {/* Content */}
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                    item.bgColor
                  )}
                >
                  <Icon className={cn("w-6 h-6", item.textColor)} />
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Status Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl bg-muted/40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>119 articles</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4" />
          <span>24/7 support</span>
        </div>
        <div className="w-px h-4 bg-border" />
        {statusItems.map((status) => {
          const StatusIcon = status.icon
          return (
            <div key={status.id} className="flex items-center gap-2 text-sm">
              <StatusIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{status.title}:</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  status.status === "operational" || status.status === "secure"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                )}
              >
                {status.status === "operational" ? "All Systems Go" : status.status === "secure" ? "Secure" : status.status}
              </Badge>
            </div>
          )
        })}
      </div>
    </section>
  )
}
