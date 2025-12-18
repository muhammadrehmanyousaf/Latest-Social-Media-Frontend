"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  X,
  Heart,
  Copy,
  Star,
  TrendingUp,
  Calendar,
  User,
  Hash,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  Variable,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Platform, Template } from "@/app/templates/page"

interface TemplatePreviewProps {
  template: Template
  onClose: () => void
  onUse: () => void
  onToggleFavorite: () => void
  onDuplicate: () => void
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "bg-[#1877F2]" },
  twitter: { name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "bg-black" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", bgColor: "bg-[#0A66C2]" },
  threads: { name: "Threads", icon: AtSign, color: "#000000", bgColor: "bg-black" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000", bgColor: "bg-black" },
}

export function TemplatePreview({
  template,
  onClose,
  onUse,
  onToggleFavorite,
  onDuplicate,
}: TemplatePreviewProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    template.variables.forEach((v) => {
      initial[v.key] = v.defaultValue
    })
    return initial
  })
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(template.platforms[0])

  const processedContent = useMemo(() => {
    let content = template.content
    template.variables.forEach((variable) => {
      const value = variableValues[variable.key] || variable.defaultValue
      content = content.replace(new RegExp(`\\{${variable.key}\\}`, "g"), value)
    })
    return content
  }, [template, variableValues])

  const characterCount = processedContent.length
  const platformLimits: Record<Platform, number> = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000,
    threads: 500,
    tiktok: 2200,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${template.color}20` }}
            >
              <Eye className="w-5 h-5" style={{ color: template.color }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Left - Template Details & Variables */}
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground font-medium">
                    {template.usageCount.toLocaleString()} uses
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm text-foreground font-medium">
                    {template.rating.toFixed(1)} rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">by {template.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(template.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                  Available Platforms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {template.platforms.map((platform) => {
                    const config = platformConfig[platform]
                    const Icon = config.icon
                    return (
                      <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                          selectedPlatform === platform
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/60 border border-transparent hover:bg-muted"
                        )}
                      >
                        <div
                          className={cn("w-6 h-6 rounded-md flex items-center justify-center", config.bgColor)}
                        >
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{config.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Variables */}
              {template.variables.length > 0 && (
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Variable className="w-4 h-4" />
                    Customize Variables
                  </Label>
                  <div className="space-y-3">
                    {template.variables.map((variable) => (
                      <div key={variable.key}>
                        <Label className="text-sm font-medium text-foreground mb-1.5 block">
                          {variable.label}
                        </Label>
                        <Input
                          value={variableValues[variable.key] || ""}
                          onChange={(e) =>
                            setVariableValues((prev) => ({
                              ...prev,
                              [variable.key]: e.target.value,
                            }))
                          }
                          placeholder={variable.defaultValue}
                          className="rounded-xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {template.hashtags.length > 0 && (
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Included Hashtags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {template.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Style */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Template Style
                </Label>
                <Badge variant="secondary" className="capitalize">
                  {template.style}
                </Badge>
              </div>
            </div>

            {/* Right - Live Preview */}
            <div className="p-6 bg-muted/30">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 block">
                Live Preview - {platformConfig[selectedPlatform].name}
              </Label>

              {/* Platform Preview Card */}
              <Card className="bg-card border-border shadow-lg overflow-hidden">
                {/* Platform Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      platformConfig[selectedPlatform].bgColor
                    )}
                  >
                    {(() => {
                      const Icon = platformConfig[selectedPlatform].icon
                      return <Icon className="w-5 h-5 text-white" />
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Your Brand</p>
                    <p className="text-xs text-muted-foreground">@yourbrand</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {processedContent}
                  </p>

                  {/* Hashtags in preview */}
                  {template.hashtags.length > 0 && (
                    <p className="text-sm text-primary mt-3">
                      {template.hashtags.map((t) => `#${t}`).join(" ")}
                    </p>
                  )}
                </div>

                {/* Character Count */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Character count</span>
                    <span
                      className={cn(
                        "font-medium",
                        characterCount > platformLimits[selectedPlatform]
                          ? "text-destructive"
                          : "text-foreground"
                      )}
                    >
                      {characterCount} / {platformLimits[selectedPlatform]}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        characterCount > platformLimits[selectedPlatform]
                          ? "bg-destructive"
                          : "bg-primary"
                      )}
                      style={{
                        width: `${Math.min(
                          (characterCount / platformLimits[selectedPlatform]) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Validation */}
              <div className="mt-4 space-y-2">
                {characterCount <= platformLimits[selectedPlatform] ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Within character limit</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <X className="w-4 h-4" />
                    <span className="text-sm">
                      Exceeds {platformConfig[selectedPlatform].name} limit by{" "}
                      {characterCount - platformLimits[selectedPlatform]} characters
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={onToggleFavorite}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  template.isFavorite && "fill-pink-500 text-pink-500"
                )}
              />
              {template.isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={onDuplicate}
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </Button>
          </div>
          <Button size="sm" className="gap-2 rounded-xl shadow-sm" onClick={onUse}>
            <Send className="w-4 h-4" />
            Use This Template
          </Button>
        </div>
      </Card>
    </div>
  )
}
