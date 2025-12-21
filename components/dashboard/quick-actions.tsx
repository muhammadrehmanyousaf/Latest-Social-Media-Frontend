"use client"

import { Button } from "@/components/ui/button"
import {
  Plus,
  Calendar,
  BarChart3,
  Image,
  Video,
  FileText,
  Layers,
  Zap,
  Send,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuickActionsProps {}

const quickActions = [
  {
    id: "create",
    label: "Create Post",
    icon: Plus,
    href: "/create-post",
    color: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90",
    primary: true,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  },
  {
    id: "bulk",
    label: "Bulk Upload",
    icon: Layers,
    href: "/bulk-schedule",
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
  },
  {
    id: "templates",
    label: "Templates",
    icon: FileText,
    href: "/templates",
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  },
]

const contentTypes = [
  { id: "image", label: "Image", icon: Image },
  { id: "video", label: "Video", icon: Video },
  { id: "carousel", label: "Carousel", icon: Layers },
  { id: "story", label: "Story", icon: Clock },
]

export function QuickActions({}: QuickActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.id} href={action.href}>
              <Button
                variant={action.primary ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-xl gap-2 transition-all",
                  action.color,
                  action.primary && "shadow-lg shadow-primary/25"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Quick Create Shortcuts */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2 hidden lg:block">Quick create:</span>
        <div className="flex items-center gap-1">
          {contentTypes.map((type) => {
            const Icon = type.icon
            return (
              <Button
                key={type.id}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg hover:bg-muted"
                title={type.label}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
              </Button>
            )
          })}
        </div>
        <div className="w-px h-6 bg-border mx-2 hidden lg:block" />
        <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-xs hidden lg:flex">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          AI Generate
        </Button>
      </div>
    </div>
  )
}
