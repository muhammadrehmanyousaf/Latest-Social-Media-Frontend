"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Megaphone,
  Rocket,
  Building2,
  Briefcase,
  Heart,
  Zap,
  Globe,
  Palette,
  Target,
  Store,
  Check,
  Sparkles,
  FolderKanban,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Workspace } from "@/app/workspaces/page"

interface CreateWorkspaceProps {
  onClose: () => void
  onCreate: (workspace: Omit<Workspace, "id" | "createdAt" | "updatedAt" | "ownerId" | "members" | "channels" | "stats">) => void
  remainingWorkspaces: number
}

const icons = [
  { id: "megaphone", icon: Megaphone, label: "Marketing" },
  { id: "rocket", icon: Rocket, label: "Launch" },
  { id: "building", icon: Building2, label: "Business" },
  { id: "briefcase", icon: Briefcase, label: "Agency" },
  { id: "heart", icon: Heart, label: "Personal" },
  { id: "zap", icon: Zap, label: "Quick" },
  { id: "globe", icon: Globe, label: "Global" },
  { id: "palette", icon: Palette, label: "Creative" },
  { id: "target", icon: Target, label: "Goals" },
  { id: "store", icon: Store, label: "Store" },
]

const colors = [
  { id: "orange", value: "#f97316" },
  { id: "blue", value: "#3b82f6" },
  { id: "purple", value: "#8b5cf6" },
  { id: "pink", value: "#ec4899" },
  { id: "green", value: "#22c55e" },
  { id: "red", value: "#ef4444" },
  { id: "cyan", value: "#06b6d4" },
  { id: "amber", value: "#f59e0b" },
  { id: "indigo", value: "#6366f1" },
  { id: "gray", value: "#6b7280" },
]

export function CreateWorkspace({ onClose, onCreate, remainingWorkspaces }: CreateWorkspaceProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("megaphone")
  const [selectedColor, setSelectedColor] = useState("#f97316")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) return

    setIsCreating(true)
    // Simulate API call
    setTimeout(() => {
      onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        status: "active",
        settings: {
          defaultTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          brandColor: selectedColor,
          isPublic: false,
        },
      })
      setIsCreating(false)
    }, 1000)
  }

  const SelectedIcon = icons.find((i) => i.id === selectedIcon)?.icon || Building2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-lg overflow-hidden bg-card border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create Workspace</h2>
              <p className="text-xs text-muted-foreground">
                {remainingWorkspaces === -1
                  ? "Unlimited workspaces available"
                  : `${remainingWorkspaces} workspace${remainingWorkspaces !== 1 ? "s" : ""} remaining`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
                  style={{ backgroundColor: selectedColor }}
                >
                  <SelectedIcon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Marketing Team"
                  className="rounded-xl"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this workspace for?"
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Icon Selection */}
              <div className="space-y-3">
                <Label>Choose an Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {icons.map((item) => {
                    const Icon = item.icon
                    const isSelected = selectedIcon === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIcon(item.id)}
                        className={cn(
                          "relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-transparent bg-muted/60 hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-[10px] text-muted-foreground">{item.label}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Choose a Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const isSelected = selectedColor === color.value
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.value)}
                        className={cn(
                          "relative w-10 h-10 rounded-xl transition-all duration-200",
                          isSelected && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                        )}
                        style={{ backgroundColor: color.value }}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview */}
              <Card className="p-4 bg-muted/40 border-0">
                <p className="text-xs text-muted-foreground mb-3">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <SelectedIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {name || "Workspace Name"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {description || "No description"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          {step === 1 ? (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="gap-2 rounded-xl"
              >
                Continue
                <Sparkles className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="gap-2 rounded-xl"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Workspace
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Step Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === 1 ? "bg-primary" : "bg-muted"
            )}
          />
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === 2 ? "bg-primary" : "bg-muted"
            )}
          />
        </div>
      </Card>
    </div>
  )
}
