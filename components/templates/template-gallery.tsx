"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Heart,
  Eye,
  Copy,
  MoreHorizontal,
  Trash2,
  Edit2,
  Star,
  TrendingUp,
  Hash,
  Sparkles,
  Crown,
  LayoutTemplate,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform, Template } from "@/app/templates/page"

interface TemplateGalleryProps {
  templates: Template[]
  onPreview: (template: Template) => void
  onToggleFavorite: (id: string) => void
  onUse: (id: string) => void
  onDuplicate: (template: Template) => void
  onEdit: (template: Template) => void
  onDelete: (id: string) => void
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  threads: AtSign,
  tiktok: Zap,
}

const platformColors: Record<Platform, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
  linkedin: "#0A66C2",
  threads: "#000000",
  tiktok: "#000000",
}

const styleGradients: Record<string, string> = {
  minimal: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
  bold: "from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30",
  elegant: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
  playful: "from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30",
  professional: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
  creative: "from-pink-100 to-yellow-100 dark:from-pink-900/30 dark:to-yellow-900/30",
}

export function TemplateGallery({
  templates,
  onPreview,
  onToggleFavorite,
  onUse,
  onDuplicate,
  onEdit,
  onDelete,
}: TemplateGalleryProps) {
  if (templates.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="p-12 bg-card border-border shadow-sm max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new template to get started.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="bg-card border-border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            {/* Preview Header */}
            <div
              className={cn(
                "relative h-32 bg-gradient-to-br p-4 flex flex-col justify-between",
                styleGradients[template.style]
              )}
              style={{
                borderBottom: `3px solid ${template.color}`,
              }}
            >
              {/* Top Row - Badges */}
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {template.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1 text-[10px]">
                      <Crown className="w-3 h-3" />
                      Pro
                    </Badge>
                  )}
                  {template.isCustom && (
                    <Badge variant="secondary" className="text-[10px] bg-background/80">
                      Custom
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(template.id)
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    template.isFavorite
                      ? "bg-pink-500 text-white"
                      : "bg-background/80 text-muted-foreground hover:text-pink-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", template.isFavorite && "fill-current")} />
                </button>
              </div>

              {/* Style Badge */}
              <Badge
                variant="secondary"
                className="w-fit text-[10px] bg-background/90 capitalize"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {template.style}
              </Badge>

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                onClick={() => onPreview(template)}
              >
                <Button size="sm" variant="secondary" className="gap-1.5 rounded-lg">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Title & Description */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Content Preview */}
              <div className="p-3 rounded-lg bg-muted/40 mb-3 flex-1">
                <p className="text-xs text-foreground/80 line-clamp-3 font-mono">
                  {template.content.replace(/\{[^}]+\}/g, (match) => (
                    `[${match.slice(1, -1)}]`
                  ))}
                </p>
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-1.5 mb-3">
                {template.platforms.map((platform) => {
                  const Icon = platformIcons[platform]
                  return (
                    <div
                      key={platform}
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${platformColors[platform]}15` }}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: platformColors[platform] }}
                      />
                    </div>
                  )
                })}
                {template.hashtags.length > 0 && (
                  <div className="flex items-center gap-1 ml-2 text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span className="text-[10px]">{template.hashtags.length}</span>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{template.usageCount.toLocaleString()} uses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{template.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs rounded-lg gap-1.5"
                  onClick={() => onUse(template.id)}
                >
                  Use Template
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onPreview(template)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(template)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {template.isCustom && (
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleFavorite(template.id)}>
                      <Heart className={cn("w-4 h-4 mr-2", template.isFavorite && "fill-current text-pink-500")} />
                      {template.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </DropdownMenuItem>
                    {template.isCustom && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(template.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
