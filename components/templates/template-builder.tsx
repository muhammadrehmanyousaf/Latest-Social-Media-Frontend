"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  X,
  Plus,
  Trash2,
  Variable,
  Hash,
  Sparkles,
  Save,
  Palette,
  Type,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, Template, TemplateCategory, TemplateStyle, TemplateVariable } from "@/app/templates/page"

interface TemplateBuilderProps {
  template: Template | null
  onSave: (template: Omit<Template, "id" | "usageCount" | "rating" | "createdAt" | "author">) => void
  onClose: () => void
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2" },
  twitter: { name: "X", icon: Twitter, color: "#000000" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  threads: { name: "Threads", icon: AtSign, color: "#000000" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000" },
}

const categoryOptions: { value: TemplateCategory; label: string }[] = [
  { value: "product-launch", label: "Product Launch" },
  { value: "engagement", label: "Engagement" },
  { value: "promotional", label: "Promotional" },
  { value: "educational", label: "Educational" },
  { value: "behind-the-scenes", label: "Behind the Scenes" },
  { value: "announcement", label: "Announcements" },
  { value: "testimonial", label: "Testimonials" },
  { value: "tips-tricks", label: "Tips & Tricks" },
  { value: "seasonal", label: "Seasonal" },
  { value: "custom", label: "Custom" },
]

const styleOptions: { value: TemplateStyle; label: string; color: string }[] = [
  { value: "minimal", label: "Minimal", color: "#6b7280" },
  { value: "bold", label: "Bold", color: "#ef4444" },
  { value: "elegant", label: "Elegant", color: "#8b5cf6" },
  { value: "playful", label: "Playful", color: "#22c55e" },
  { value: "professional", label: "Professional", color: "#3b82f6" },
  { value: "creative", label: "Creative", color: "#ec4899" },
]

const colorOptions = [
  "#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#6366f1",
  "#3b82f6", "#0ea5e9", "#14b8a6", "#22c55e", "#84cc16",
  "#f59e0b", "#78716c",
]

export function TemplateBuilder({ template, onSave, onClose }: TemplateBuilderProps) {
  const [name, setName] = useState(template?.name || "")
  const [description, setDescription] = useState(template?.description || "")
  const [content, setContent] = useState(template?.content || "")
  const [category, setCategory] = useState<TemplateCategory>(template?.category || "custom")
  const [style, setStyle] = useState<TemplateStyle>(template?.style || "minimal")
  const [platforms, setPlatforms] = useState<Platform[]>(template?.platforms || ["instagram"])
  const [hashtags, setHashtags] = useState<string[]>(template?.hashtags || [])
  const [hashtagInput, setHashtagInput] = useState("")
  const [variables, setVariables] = useState<TemplateVariable[]>(template?.variables || [])
  const [color, setColor] = useState(template?.color || "#f97316")

  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((p) => p !== platform))
      }
    } else {
      setPlatforms([...platforms, platform])
    }
  }

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace("#", "")
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag])
      setHashtagInput("")
    }
  }

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((h) => h !== tag))
  }

  const addVariable = () => {
    const newVariable: TemplateVariable = {
      key: `var_${Date.now()}`,
      label: "New Variable",
      defaultValue: "",
      type: "text",
    }
    setVariables([...variables, newVariable])
  }

  const updateVariable = (index: number, updates: Partial<TemplateVariable>) => {
    setVariables(
      variables.map((v, i) => (i === index ? { ...v, ...updates } : v))
    )
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const insertVariable = (key: string) => {
    setContent((prev) => prev + `{${key}}`)
  }

  const handleSave = () => {
    if (!name.trim() || !content.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      content: content.trim(),
      category,
      style,
      platforms,
      hashtags,
      variables,
      color,
      isFavorite: template?.isFavorite || false,
      isCustom: true,
      isPremium: false,
    })
  }

  const isValid = name.trim() && content.trim() && platforms.length > 0

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {template ? "Edit Template" : "Create Template"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Design your perfect social media template
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Template Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Launch Announcement"
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of when to use this template"
                  className="rounded-xl"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Template Content</Label>
                  <span className="text-xs text-muted-foreground">
                    {content.length} characters
                  </span>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your template content here. Use {variable_name} for dynamic content."
                  className="min-h-[150px] rounded-xl resize-none"
                />
                {variables.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs text-muted-foreground">Insert:</span>
                    {variables.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => insertVariable(v.key)}
                        className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {`{${v.key}}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category & Style */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Style</Label>
                  <Select value={style} onValueChange={(v) => setStyle(v as TemplateStyle)}>
                    <SelectTrigger className="rounded-xl">
                      <Sparkles className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: opt.color }}
                            />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color */}
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Accent Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-lg transition-all",
                        color === c && "ring-2 ring-offset-2 ring-primary"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Platforms, Hashtags, Variables */}
            <div className="space-y-5">
              {/* Platforms */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Target Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(platformConfig).map(([key, config]) => {
                    const platform = key as Platform
                    const Icon = config.icon
                    const isActive = platforms.includes(platform)

                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all",
                          isActive
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/60 border border-transparent hover:bg-muted"
                        )}
                      >
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                        <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {config.name}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Default Hashtags
                </Label>
                <div className="flex gap-2 mb-2">
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
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {hashtags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1 text-xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeHashtag(tag)}
                          className="ml-0.5 p-0.5 rounded hover:bg-muted-foreground/20"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Variables */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Variable className="w-4 h-4" />
                    Template Variables
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 rounded-lg"
                    onClick={addVariable}
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
                {variables.length === 0 ? (
                  <Card className="p-4 bg-muted/40 border-dashed">
                    <p className="text-xs text-muted-foreground text-center">
                      Add variables to make your template customizable.
                      <br />
                      Example: {"{product_name}"}, {"{discount}"}
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {variables.map((variable, index) => (
                      <Card key={variable.key} className="p-3 bg-muted/40">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={variable.key}
                                onChange={(e) =>
                                  updateVariable(index, {
                                    key: e.target.value.replace(/\s/g, "_").toLowerCase(),
                                  })
                                }
                                placeholder="variable_key"
                                className="h-8 text-xs rounded-lg font-mono"
                              />
                              <Input
                                value={variable.label}
                                onChange={(e) =>
                                  updateVariable(index, { label: e.target.value })
                                }
                                placeholder="Display Label"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                            <Input
                              value={variable.defaultValue}
                              onChange={(e) =>
                                updateVariable(index, { defaultValue: e.target.value })
                              }
                              placeholder="Default value"
                              className="h-8 text-xs rounded-lg"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeVariable(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="gap-2 rounded-xl shadow-sm"
          >
            <Save className="w-4 h-4" />
            {template ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
