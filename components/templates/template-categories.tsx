"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Layers,
  Rocket,
  MessageCircle,
  Tag,
  GraduationCap,
  Camera,
  Megaphone,
  Quote,
  Lightbulb,
  CalendarDays,
  Palette,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
  X,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TemplateCategory, Collection } from "@/app/templates/page"

interface TemplateCategoriesProps {
  selectedCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
  categoryStats: Record<string, number>
  collections: Collection[]
  customCount: number
}

const categories: { id: TemplateCategory; name: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "all", name: "All Templates", icon: Layers, color: "#6b7280" },
  { id: "product-launch", name: "Product Launch", icon: Rocket, color: "#f97316" },
  { id: "engagement", name: "Engagement", icon: MessageCircle, color: "#22c55e" },
  { id: "promotional", name: "Promotional", icon: Tag, color: "#ef4444" },
  { id: "educational", name: "Educational", icon: GraduationCap, color: "#8b5cf6" },
  { id: "behind-the-scenes", name: "Behind the Scenes", icon: Camera, color: "#ec4899" },
  { id: "announcement", name: "Announcements", icon: Megaphone, color: "#0ea5e9" },
  { id: "testimonial", name: "Testimonials", icon: Quote, color: "#14b8a6" },
  { id: "tips-tricks", name: "Tips & Tricks", icon: Lightbulb, color: "#6366f1" },
  { id: "seasonal", name: "Seasonal", icon: CalendarDays, color: "#f59e0b" },
  { id: "custom", name: "My Templates", icon: Palette, color: "#a855f7" },
]

export function TemplateCategories({
  selectedCategory,
  onCategoryChange,
  categoryStats,
  collections,
  customCount,
}: TemplateCategoriesProps) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true)
  const [collectionsExpanded, setCollectionsExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const CategoriesContent = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">
        {/* Quick Stats */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Template Stats</p>
              <p className="text-xs text-muted-foreground">Your collection overview</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-background/80">
              <p className="text-lg font-bold text-foreground">{categoryStats.all || 0}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div className="p-2.5 rounded-lg bg-background/80">
              <p className="text-lg font-bold text-foreground">{customCount}</p>
              <p className="text-[10px] text-muted-foreground">Custom</p>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Categories
            </span>
            {categoriesExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {categoriesExpanded && (
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategory === category.id
                const count = category.id === "custom" ? customCount : categoryStats[category.id] || 0

                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/60 border border-transparent"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium flex-1 text-left",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {category.name}
                    </span>
                    {count > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Collections */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setCollectionsExpanded(!collectionsExpanded)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Collections
            </span>
            {collectionsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {collectionsExpanded && (
            <div className="space-y-2">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${collection.color}20` }}
                    >
                      <FolderOpen className="w-5 h-5" style={{ color: collection.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {collection.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {collection.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                          {collection.templates.length} templates
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Collection */}
              <button className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">Create Collection</span>
              </button>
            </div>
          )}
        </div>

        {/* Pro Tip */}
        <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Pro Tip</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use variables like {"{product_name}"} in your templates for quick customization when creating posts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ScrollArea>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed bottom-4 left-4 z-40 h-12 w-12 rounded-full shadow-lg bg-card"
        onClick={() => setMobileOpen(true)}
      >
        <Filter className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <span className="text-sm font-semibold">Categories</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CategoriesContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border bg-card shrink-0">
        <div className="flex items-center gap-2 h-12 px-4 border-b border-border">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Categories</span>
        </div>
        <CategoriesContent />
      </aside>
    </>
  )
}
