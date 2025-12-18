"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Youtube,
  CircleDot,
  X,
  Hash,
  Save,
  Settings,
  Clock,
  Bell,
  BarChart3,
  Image as ImageIcon,
  Sparkles,
  Plus,
  BadgeCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, Channel, ChannelSettings as ChannelSettingsType } from "@/app/channels/page"

interface ChannelSettingsProps {
  channel: Channel
  onClose: () => void
  onSave: (settings: Partial<ChannelSettingsType>) => void
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "bg-[#1877F2]" },
  twitter: { name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "bg-black" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", bgColor: "bg-[#0A66C2]" },
  threads: { name: "Threads", icon: AtSign, color: "#000000", bgColor: "bg-black" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000", bgColor: "bg-black" },
  youtube: { name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "bg-[#FF0000]" },
  pinterest: { name: "Pinterest", icon: CircleDot, color: "#E60023", bgColor: "bg-[#E60023]" },
}

export function ChannelSettings({ channel, onClose, onSave }: ChannelSettingsProps) {
  const [settings, setSettings] = useState<ChannelSettingsType>(channel.settings)
  const [hashtagInput, setHashtagInput] = useState("")

  const platform = platformConfig[channel.platform]
  const PlatformIcon = platform.icon

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace("#", "")
    if (tag && !settings.autoHashtags.includes(tag)) {
      setSettings((prev) => ({
        ...prev,
        autoHashtags: [...prev.autoHashtags, tag],
      }))
      setHashtagInput("")
    }
  }

  const removeHashtag = (tag: string) => {
    setSettings((prev) => ({
      ...prev,
      autoHashtags: prev.autoHashtags.filter((h) => h !== tag),
    }))
  }

  const handleSave = () => {
    onSave(settings)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-border">
                <AvatarImage src={channel.profileImage} />
                <AvatarFallback className={cn("text-white font-semibold", platform.bgColor)}>
                  {channel.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background",
                  platform.bgColor
                )}
              >
                <PlatformIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{channel.displayName}</h2>
                {channel.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Channel Settings</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Auto Hashtags */}
          <div>
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Auto Hashtags
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              These hashtags will be automatically added to all posts on this channel.
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHashtag()}
                placeholder="Add hashtag..."
                className="rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl shrink-0"
                onClick={addHashtag}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {settings.autoHashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.autoHashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs cursor-pointer hover:bg-destructive/10"
                    onClick={() => removeHashtag(tag)}
                  >
                    #{tag}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Default Caption */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Default Caption</Label>
            <p className="text-xs text-muted-foreground mb-3">
              This text will be appended to the end of every post on this channel.
            </p>
            <Textarea
              value={settings.defaultCaption}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultCaption: e.target.value }))}
              placeholder="e.g., Follow us for more content!"
              className="rounded-xl resize-none min-h-[80px]"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Watermark</p>
                  <p className="text-xs text-muted-foreground">Add watermark to images</p>
                </div>
              </div>
              <Switch
                checked={settings.watermarkEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, watermarkEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Auto Schedule</p>
                  <p className="text-xs text-muted-foreground">Automatically schedule posts in queue</p>
                </div>
              </div>
              <Switch
                checked={settings.autoSchedule}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, autoSchedule: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Best Time Posting</p>
                  <p className="text-xs text-muted-foreground">Post at optimal times for engagement</p>
                </div>
              </div>
              <Switch
                checked={settings.bestTimePosting}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, bestTimePosting: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified about post performance</p>
                </div>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, notificationsEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">Track and analyze post performance</p>
                </div>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, analyticsEnabled: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2 rounded-xl shadow-sm">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}
