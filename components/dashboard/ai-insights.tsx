"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Zap,
  ArrowRight,
  X,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InsightItem } from "@/app/page"

interface AiInsightsProps {
  insights: InsightItem[]
}

const insightConfig = {
  tip: {
    icon: Lightbulb,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  opportunity: {
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  trend: {
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
}

const priorityConfig = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
}

export function AiInsights({ insights }: AiInsightsProps) {
  return (
    <Card className="p-5 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
            <p className="text-[10px] text-muted-foreground">Powered by AI</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600">
          {insights.length} new
        </Badge>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 4).map((insight) => {
          const config = insightConfig[insight.type]
          const Icon = config.icon

          return (
            <div
              key={insight.id}
              className={cn(
                "relative p-3 rounded-xl border-l-2 transition-all hover:shadow-md group",
                config.bgColor,
                config.borderColor,
                priorityConfig[insight.priority]
              )}
            >
              {/* Dismiss Button */}
              <button className="absolute top-2 right-2 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>

              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-foreground">
                      {insight.title}
                    </p>
                    {insight.priority === "high" && (
                      <Badge variant="destructive" className="text-[8px] px-1 py-0">
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>

                  {insight.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-2 text-xs text-primary"
                    >
                      {insight.action}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Assistant CTA */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">Ask AI Assistant</p>
            <p className="text-[10px] text-muted-foreground">
              Get personalized advice for your content
            </p>
          </div>
          <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Ask
          </Button>
        </div>
      </div>
    </Card>
  )
}
