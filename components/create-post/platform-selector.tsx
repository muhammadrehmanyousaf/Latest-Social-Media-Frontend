"use client"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Plus } from "lucide-react"
import type { Platform } from "@/app/create-post/page"

const platforms: { id: Platform; name: string; color: string; icon: string; gradient: string }[] = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    icon: "IG",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
  },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "FB", gradient: "from-[#1877F2] to-[#1877F2]" },
  { id: "twitter", name: "X (Twitter)", color: "#000000", icon: "X", gradient: "from-[#000000] to-[#333333]" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", icon: "in", gradient: "from-[#0A66C2] to-[#0A66C2]" },
  { id: "threads", name: "Threads", color: "#000000", icon: "@", gradient: "from-[#000000] to-[#333333]" },
  { id: "tiktok", name: "TikTok", color: "#000000", icon: "TT", gradient: "from-[#00F2EA] via-[#000000] to-[#FF0050]" },
]

interface PlatformSelectorProps {
  selectedPlatforms: Platform[]
  activePlatform: Platform
  onTogglePlatform: (platform: Platform) => void
  onSetActivePlatform: (platform: Platform) => void
  syncContent: boolean
  onToggleSync: () => void
}

export function PlatformSelector({
  selectedPlatforms,
  activePlatform,
  onTogglePlatform,
  onSetActivePlatform,
  syncContent,
  onToggleSync,
}: PlatformSelectorProps) {
  return (
    <div className="p-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Select Platforms</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {selectedPlatforms.length} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sync-content" className="text-xs text-muted-foreground cursor-pointer">
            Sync content across platforms
          </Label>
          <Switch
            id="sync-content"
            checked={syncContent}
            onCheckedChange={onToggleSync}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Platform Grid */}
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id)
          const isActive = activePlatform === platform.id

          return (
            <div key={platform.id} className="relative">
              <button
                onClick={() => {
                  if (isSelected) {
                    onSetActivePlatform(platform.id)
                  } else {
                    onTogglePlatform(platform.id)
                    onSetActivePlatform(platform.id)
                  }
                }}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/50"
                    : "border-dashed border-muted-foreground/30 bg-muted/30 hover:border-muted-foreground/50",
                )}
              >
                {/* Platform Avatar */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br",
                    platform.gradient,
                    !isSelected && "opacity-50",
                  )}
                >
                  {platform.icon}
                </div>

                <div className="text-left">
                  <p className={cn("text-sm font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                    {platform.name}
                  </p>
                  {isSelected && <p className="text-[10px] text-muted-foreground">@yourbrand</p>}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                {!isSelected && <Plus className="w-4 h-4 text-muted-foreground ml-1" />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Platform Tabs (when not synced) */}
      {!syncContent && selectedPlatforms.length > 1 && (
        <div className="mt-4 flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
          {selectedPlatforms.map((platformId) => {
            const platform = platforms.find((p) => p.id === platformId)!
            return (
              <button
                key={platformId}
                onClick={() => onSetActivePlatform(platformId)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activePlatform === platformId
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br",
                    platform.gradient,
                  )}
                >
                  {platform.icon}
                </div>
                {platform.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
