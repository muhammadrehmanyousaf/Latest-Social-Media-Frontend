"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Heart,
  UserPlus,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NotificationPreferences } from "@/app/settings/page"

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onUpdate: (preferences: NotificationPreferences) => void
}

interface NotificationCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  settings: {
    key: keyof NotificationPreferences
    label: string
  }[]
}

const categories: NotificationCategory[] = [
  {
    id: "engagement",
    title: "Engagement",
    description: "Likes, comments, and shares on your posts",
    icon: Heart,
    color: "text-pink-500 bg-pink-500/10",
    settings: [
      { key: "likes", label: "New likes" },
      { key: "comments", label: "New comments" },
      { key: "mentions", label: "Mentions" },
    ],
  },
  {
    id: "followers",
    title: "Followers",
    description: "New followers and follower milestones",
    icon: UserPlus,
    color: "text-blue-500 bg-blue-500/10",
    settings: [
      { key: "newFollowers", label: "New followers" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description: "Performance reports and trending content",
    icon: TrendingUp,
    color: "text-green-500 bg-green-500/10",
    settings: [
      { key: "weeklyReport", label: "Weekly performance report" },
    ],
  },
  {
    id: "scheduling",
    title: "Scheduling",
    description: "Post publishing and schedule reminders",
    icon: Calendar,
    color: "text-purple-500 bg-purple-500/10",
    settings: [
      { key: "postPublished", label: "Post published" },
      { key: "scheduledReminder", label: "Scheduled post reminders" },
    ],
  },
  {
    id: "system",
    title: "System",
    description: "Account and security alerts",
    icon: AlertTriangle,
    color: "text-amber-500 bg-amber-500/10",
    settings: [
      { key: "failedPosts", label: "Failed post alerts" },
    ],
  },
]

export function NotificationSettings({
  preferences,
  onUpdate,
}: NotificationSettingsProps) {
  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    onUpdate({ ...preferences, [key]: value })
  }

  const allEnabled = Object.values(preferences).every((v) => v === true)
  const allDisabled = Object.values(preferences).every((v) => v === false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose what you want to be notified about
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Quick Actions</p>
              <p className="text-xs text-muted-foreground">Manage all notifications at once</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => {
                const allOn = Object.keys(preferences).reduce((acc, key) => {
                  acc[key as keyof NotificationPreferences] = true
                  return acc
                }, {} as NotificationPreferences)
                onUpdate(allOn)
              }}
              disabled={allEnabled}
            >
              <Volume2 className="w-4 h-4" />
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => {
                const allOff = Object.keys(preferences).reduce((acc, key) => {
                  acc[key as keyof NotificationPreferences] = false
                  return acc
                }, {} as NotificationPreferences)
                onUpdate(allOff)
              }}
              disabled={allDisabled}
            >
              <VolumeX className="w-4 h-4" />
              Disable All
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Channels */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Push */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified on your device</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* In-App */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">In-App Notifications</p>
                <p className="text-xs text-muted-foreground">See notifications within SocialFlow</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Notification Categories */}
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Card key={category.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", category.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <div className="space-y-3 ml-14">
              {category.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">{setting.label}</span>
                  <Switch
                    checked={preferences[setting.key]}
                    onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )
      })}

      {/* Email Frequency */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Email Digest Frequency
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          How often would you like to receive email summaries?
        </p>
        <div className="max-w-sm">
          <Select defaultValue="daily">
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time (as they happen)</SelectItem>
              <SelectItem value="hourly">Hourly digest</SelectItem>
              <SelectItem value="daily">Daily digest</SelectItem>
              <SelectItem value="weekly">Weekly digest</SelectItem>
              <SelectItem value="never">Never (disable email)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <VolumeX className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Quiet Hours</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Pause notifications during specific hours. Perfect for avoiding distractions
                during sleep or focused work time.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Select defaultValue="22">
                    <SelectTrigger className="w-24 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-24 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <Switch />
        </div>
      </Card>
    </div>
  )
}
