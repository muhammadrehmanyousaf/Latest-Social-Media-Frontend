"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, AlertCircle, Zap, MoreVertical, ChevronRight } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "ai",
    message: "AI generated a performance report for",
    highlight: "Sales Overview",
    time: "2m ago",
    icon: Zap,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "2",
    type: "user",
    message: "Mike Rowen changed the execution time in",
    highlight: "Sales",
    time: "10m ago",
    avatar: "/mike-professional-man.jpg",
    avatarFallback: "MR",
  },
  {
    id: "3",
    type: "success",
    message: "Workflow",
    highlight: "Invoice Sync",
    suffix: "completed successfully.",
    time: "17m ago",
    icon: CheckCircle2,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: "4",
    type: "ai",
    message: "AI flagged an anomaly in",
    highlight: "Monthly Revenue Trend",
    time: "45m ago",
    icon: AlertCircle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    id: "5",
    type: "user",
    message: "Natalie set revenue gap up to 10% in",
    highlight: "Sales Automation",
    time: "1h ago",
    avatar: "/natalie-professional-woman.jpg",
    avatarFallback: "N",
  },
]

export function ActivityFeed() {
  return (
    <Card className="bg-card border-border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-4 px-5 pt-5 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Activities Feeds</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Stay updated with your business in real time</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              {activity.avatar ? (
                <Avatar className="w-8 h-8 border border-border shrink-0">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs font-semibold bg-muted">{activity.avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                  {activity.icon && <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">
                  {activity.message} <span className="font-semibold text-foreground">{activity.highlight}</span>
                  {activity.suffix && <span className="text-muted-foreground">{activity.suffix}</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground font-medium justify-between group"
        >
          <span>View all activity</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}
