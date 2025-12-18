"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Star,
  Calendar,
  Zap as Lightning,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, TimeSlot, BulkPost } from "@/app/bulk-schedule/page"

interface TimeSlotTemplatesProps {
  timeSlots: TimeSlot[]
  onAddSlot: (slot: Omit<TimeSlot, "id">) => void
  onDeleteSlot: (id: string) => void
  onApplySlot: (slotId: string, postIds: string[]) => void
  posts: BulkPost[]
  selectedPosts: string[]
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2" },
  twitter: { name: "X", icon: Twitter, color: "#000000" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  threads: { name: "Threads", icon: AtSign, color: "#000000" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000" },
}

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const presetSlots: Omit<TimeSlot, "id">[] = [
  { name: "Early Bird", time: "07:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["twitter", "linkedin"] },
  { name: "Business Hours", time: "10:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["linkedin", "twitter", "facebook"] },
  { name: "Lunch Boost", time: "12:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["instagram", "facebook", "twitter"] },
  { name: "Afternoon Push", time: "15:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["instagram", "linkedin"] },
  { name: "Evening Prime", time: "19:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], platforms: ["instagram", "facebook", "tiktok"] },
  { name: "Weekend Chill", time: "11:00", days: ["Sat", "Sun"], platforms: ["instagram", "tiktok", "threads"] },
]

export function TimeSlotTemplates({
  timeSlots,
  onAddSlot,
  onDeleteSlot,
  onApplySlot,
  posts,
  selectedPosts,
}: TimeSlotTemplatesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, "id">>({
    name: "",
    time: "09:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    platforms: ["instagram"],
  })

  const toggleDay = (day: string) => {
    setNewSlot((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }))
  }

  const togglePlatform = (platform: Platform) => {
    setNewSlot((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const handleCreate = () => {
    if (newSlot.name && newSlot.time && newSlot.days.length > 0 && newSlot.platforms.length > 0) {
      onAddSlot(newSlot)
      setNewSlot({
        name: "",
        time: "09:00",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        platforms: ["instagram"],
      })
      setIsCreateOpen(false)
    }
  }

  const draftPosts = posts.filter((p) => p.status === "draft")
  const postsToApply = selectedPosts.length > 0 ? selectedPosts : draftPosts.map((p) => p.id)

  return (
    <div className="h-full overflow-auto p-4 lg:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Time Slot Templates</h2>
            <p className="text-sm text-muted-foreground">
              Quickly apply optimal posting times to your content
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl shadow-sm">
                <Plus className="w-4 h-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Time Slot Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={newSlot.name}
                    onChange={(e) => setNewSlot((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Morning Rush"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot((prev) => ({ ...prev, time: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          newSlot.days.includes(day)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(platformConfig).map(([key, config]) => {
                      const platform = key as Platform
                      const Icon = config.icon
                      const isActive = newSlot.platforms.includes(platform)

                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {config.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button onClick={handleCreate} className="w-full rounded-xl">
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Apply Banner */}
        {postsToApply.length > 0 && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Quick Apply</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPosts.length > 0
                    ? `${selectedPosts.length} selected posts`
                    : `${draftPosts.length} draft posts`}{" "}
                  ready to schedule
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Your Templates */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Your Templates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <Card
                key={slot.id}
                className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{slot.name}</h4>
                      <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{slot.time}</span>
                      </div>
                    </div>
                    {slot.isDefault && (
                      <Badge variant="secondary" className="text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>

                  {/* Days */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {slot.days.map((day) => (
                      <span
                        key={day}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-1.5 mb-4">
                    {slot.platforms.map((platform) => {
                      const Icon = platformConfig[platform].icon
                      return (
                        <div
                          key={platform}
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: `${platformConfig[platform].color}15` }}
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: platformConfig[platform].color }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs rounded-lg gap-1.5"
                      disabled={postsToApply.length === 0}
                      onClick={() => onApplySlot(slot.id, postsToApply)}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Apply ({postsToApply.length})
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteSlot(slot.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Preset Templates */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Suggested Templates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetSlots.map((preset, index) => {
              const alreadyExists = timeSlots.some(
                (s) =>
                  s.name === preset.name &&
                  s.time === preset.time &&
                  JSON.stringify(s.days) === JSON.stringify(preset.days)
              )

              return (
                <Card
                  key={index}
                  className={cn(
                    "bg-card border-border shadow-sm overflow-hidden transition-all",
                    alreadyExists ? "opacity-50" : "hover:shadow-md"
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{preset.name}</h4>
                        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{preset.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Days */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preset.days.map((day) => (
                        <span
                          key={day}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    {/* Platforms */}
                    <div className="flex gap-1.5 mb-4">
                      {preset.platforms.map((platform) => {
                        const Icon = platformConfig[platform].icon
                        return (
                          <div
                            key={platform}
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: `${platformConfig[platform].color}15` }}
                          >
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{ color: platformConfig[platform].color }}
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* Add Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs rounded-lg gap-1.5"
                      disabled={alreadyExists}
                      onClick={() => onAddSlot(preset)}
                    >
                      {alreadyExists ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Add Template
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
