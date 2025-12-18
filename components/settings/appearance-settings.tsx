"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Languages,
  Type,
  Maximize2,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme, Language } from "@/app/settings/page"

interface AppearanceSettingsProps {
  theme: Theme
  language: Language
  onThemeChange: (theme: Theme) => void
  onLanguageChange: (language: Language) => void
}

const themes: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: "light", label: "Light", icon: Sun, description: "Bright and clean interface" },
  { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes in low light" },
  { value: "system", label: "System", icon: Monitor, description: "Follows your device settings" },
]

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "pt", label: "Português", flag: "🇧🇷" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
]

const fontSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium (Default)" },
  { value: "large", label: "Large" },
]

export function AppearanceSettings({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how SocialFlow looks and feels
        </p>
      </div>

      {/* Theme Selection */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </h3>
        <RadioGroup
          value={theme}
          onValueChange={(value) => onThemeChange(value as Theme)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {themes.map((t) => {
            const Icon = t.icon
            const isSelected = theme === t.value
            return (
              <label
                key={t.value}
                className={cn(
                  "relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={t.value} className="sr-only" />
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {t.description}
                </p>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </label>
            )
          })}
        </RadioGroup>

        {/* Theme Preview */}
        <div className="mt-6 p-4 rounded-xl bg-muted/40">
          <p className="text-xs text-muted-foreground mb-3">Preview</p>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-24 h-16 rounded-lg border",
                theme === "dark"
                  ? "bg-zinc-900 border-zinc-700"
                  : theme === "light"
                  ? "bg-white border-zinc-200"
                  : "bg-gradient-to-r from-white to-zinc-900 border-zinc-300"
              )}
            >
              <div className="p-2 space-y-1">
                <div
                  className={cn(
                    "h-2 w-12 rounded",
                    theme === "dark" ? "bg-zinc-700" : "bg-zinc-200"
                  )}
                />
                <div
                  className={cn(
                    "h-2 w-8 rounded",
                    theme === "dark" ? "bg-zinc-700" : "bg-zinc-200"
                  )}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {themes.find((t) => t.value === theme)?.label} Theme
              </p>
              <p className="text-xs text-muted-foreground">
                {themes.find((t) => t.value === theme)?.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Languages className="w-4 h-4" />
          Language
        </h3>
        <div className="max-w-sm">
          <Label htmlFor="language" className="text-muted-foreground text-sm mb-2 block">
            Select your preferred language
          </Label>
          <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            This will change the language across the entire application
          </p>
        </div>
      </Card>

      {/* Display Options */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Display Options
        </h3>
        <div className="space-y-6">
          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Type className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Font Size</p>
                <p className="text-xs text-muted-foreground">Adjust text size for readability</p>
              </div>
            </div>
            <Select defaultValue="medium">
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Compact Mode</p>
                <p className="text-xs text-muted-foreground">Show more content with less spacing</p>
              </div>
            </div>
            <Switch />
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Animations</p>
                <p className="text-xs text-muted-foreground">Enable smooth transitions and effects</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Reduce Motion</p>
                <p className="text-xs text-muted-foreground">Minimize animations for accessibility</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Color Accent (Future Feature) */}
      <Card className="p-6 bg-muted/40">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Custom Accent Colors</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Personalize your dashboard with custom accent colors to match your brand.
            </p>
            <div className="flex items-center gap-2 mt-3">
              {["#8b5cf6", "#ec4899", "#3b82f6", "#22c55e", "#f97316", "#ef4444"].map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full opacity-50 cursor-not-allowed"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
