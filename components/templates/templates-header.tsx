"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  Plus,
  SlidersHorizontal,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Sparkles,
  LayoutTemplate,
  TrendingUp,
  Clock,
  Star,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, TemplateStyle } from "@/app/templates/page"

interface TemplatesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: "popular" | "recent" | "rating"
  onSortChange: (sort: "popular" | "recent" | "rating") => void
  selectedPlatforms: Platform[]
  onPlatformsChange: (platforms: Platform[]) => void
  selectedStyle: TemplateStyle | "all"
  onStyleChange: (style: TemplateStyle | "all") => void
  showFavoritesOnly: boolean
  onFavoritesChange: (show: boolean) => void
  onCreateNew: () => void
  totalTemplates: number
  favoriteCount: number
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2" },
  twitter: { name: "X", icon: Twitter, color: "#000000" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  threads: { name: "Threads", icon: AtSign, color: "#000000" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000" },
}

const styleOptions: { value: TemplateStyle | "all"; label: string }[] = [
  { value: "all", label: "All Styles" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "elegant", label: "Elegant" },
  { value: "playful", label: "Playful" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
]

const sortOptions = [
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "rating", label: "Highest Rated", icon: Star },
]

export function TemplatesHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedPlatforms,
  onPlatformsChange,
  selectedStyle,
  onStyleChange,
  showFavoritesOnly,
  onFavoritesChange,
  onCreateNew,
  totalTemplates,
  favoriteCount,
}: TemplatesHeaderProps) {
  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform))
    } else {
      onPlatformsChange([...selectedPlatforms, platform])
    }
  }

  const clearFilters = () => {
    onPlatformsChange([])
    onStyleChange("all")
    onFavoritesChange(false)
  }

  const hasActiveFilters = selectedPlatforms.length > 0 || selectedStyle !== "all" || showFavoritesOnly

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shrink-0">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <LayoutTemplate className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground">
              {totalTemplates} templates available
            </p>
          </div>
        </div>

        <Button onClick={onCreateNew} className="gap-2 rounded-xl shadow-sm bg-gradient-to-r from-primary to-primary/90">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates, hashtags..."
            className="pl-9 rounded-xl bg-muted/60 border-0 h-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as "popular" | "recent" | "rating")}>
            <SelectTrigger className="w-[150px] h-10 rounded-xl bg-muted/60 border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* Style Filter */}
          <Select value={selectedStyle} onValueChange={(v) => onStyleChange(v as TemplateStyle | "all")}>
            <SelectTrigger className="w-[130px] h-10 rounded-xl bg-muted/60 border-0">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Platform Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 gap-2 rounded-xl border-0 bg-muted/60",
                  selectedPlatforms.length > 0 && "bg-primary/10 text-primary"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Platforms
                {selectedPlatforms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {selectedPlatforms.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Filter by Platform
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(platformConfig).map(([key, config]) => {
                  const platform = key as Platform
                  const Icon = config.icon
                  const isActive = selectedPlatforms.includes(platform)

                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted border border-transparent"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.name}
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Favorites Toggle */}
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 rounded-xl border-0 bg-muted/60",
              showFavoritesOnly && "bg-pink-500/10 text-pink-600"
            )}
            onClick={() => onFavoritesChange(!showFavoritesOnly)}
          >
            <Heart className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} />
            Favorites
            {favoriteCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {favoriteCount}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearFilters}
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {selectedPlatforms.map((platform) => {
            const config = platformConfig[platform]
            const Icon = config.icon
            return (
              <Badge
                key={platform}
                variant="secondary"
                className="gap-1.5 pr-1 cursor-pointer hover:bg-destructive/10"
                onClick={() => togglePlatform(platform)}
              >
                <Icon className="w-3 h-3" />
                {config.name}
                <X className="w-3 h-3 ml-0.5" />
              </Badge>
            )
          })}
          {selectedStyle !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1 cursor-pointer hover:bg-destructive/10 capitalize"
              onClick={() => onStyleChange("all")}
            >
              <Sparkles className="w-3 h-3" />
              {selectedStyle}
              <X className="w-3 h-3 ml-0.5" />
            </Badge>
          )}
          {showFavoritesOnly && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1 cursor-pointer hover:bg-destructive/10"
              onClick={() => onFavoritesChange(false)}
            >
              <Heart className="w-3 h-3" />
              Favorites Only
              <X className="w-3 h-3 ml-0.5" />
            </Badge>
          )}
        </div>
      )}
    </header>
  )
}
