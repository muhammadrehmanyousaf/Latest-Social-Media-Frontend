"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  BookMarked,
  Trash2,
  Plus,
  Image as ImageIcon,
  Hash,
  BarChart3,
  Calendar,
  Sparkles,
  Filter,
  SortAsc,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ContentItem } from "@/app/bulk-schedule/page"

interface ContentLibraryProps {
  items: ContentItem[]
  onUseItem: (id: string) => void
  onDeleteItem: (id: string) => void
}

const categories = ["All", "Product", "Engagement", "Culture", "Saved", "Promotion", "Educational"]

export function ContentLibrary({ items, onUseItem, onDeleteItem }: ContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")

  const filteredItems = useMemo(() => {
    let result = [...items]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.content.toLowerCase().includes(query) ||
          item.hashtags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else {
      result.sort((a, b) => b.usageCount - a.usageCount)
    }

    return result
  }, [items, searchQuery, selectedCategory, sortBy])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { All: items.length }
    items.forEach((item) => {
      stats[item.category] = (stats[item.category] || 0) + 1
    })
    return stats
  }, [items])

  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="p-12 bg-card border-border shadow-sm max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
              <BookMarked className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Content Library is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save posts to your library for quick reuse. Click "Save to Library" on any post in the Editor.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 lg:px-6 py-4 border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content or hashtags..."
                className="pl-9 rounded-xl bg-muted/60 border-0"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[130px] h-9 rounded-xl bg-muted/60 border-0 text-sm">
                  <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat} {categoryStats[cat] ? `(${categoryStats[cat]})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "recent" | "popular")}>
                <SelectTrigger className="w-[120px] h-9 rounded-xl bg-muted/60 border-0 text-sm">
                  <SortAsc className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat}
                {categoryStats[cat] && (
                  <span className="ml-1.5 opacity-70">{categoryStats[cat]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-card border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{items.length}</p>
                  <p className="text-xs text-muted-foreground">Saved Items</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {items.reduce((acc, item) => acc + item.usageCount, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Uses</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {new Set(items.flatMap((i) => i.hashtags)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Unique Hashtags</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {items.filter((i) => i.media.length > 0).length}
                  </p>
                  <p className="text-xs text-muted-foreground">With Media</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <Card className="p-12 bg-card border-border shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold"
                      >
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BarChart3 className="w-3 h-3" />
                        <span>{item.usageCount} uses</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex gap-3 mb-3">
                      <p className="text-sm text-foreground line-clamp-3 flex-1">
                        {item.content}
                      </p>
                      {item.media.length > 0 && (
                        <Avatar className="w-14 h-14 rounded-xl border border-border shrink-0">
                          <AvatarImage src={item.media[0].url} className="object-cover" />
                          <AvatarFallback className="rounded-xl bg-muted">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Hashtags */}
                    {item.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.hashtags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs text-primary">
                            #{tag}
                          </span>
                        ))}
                        {item.hashtags.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{item.hashtags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(item.createdAt, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          className="h-7 gap-1.5 text-xs rounded-lg"
                          onClick={() => onUseItem(item.id)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Use
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Popular Hashtags */}
          {items.length > 0 && (
            <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Popular Hashtags</h3>
                  <p className="text-xs text-muted-foreground">Most used hashtags in your library</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  items
                    .flatMap((i) => i.hashtags)
                    .reduce((acc, tag) => {
                      acc.set(tag, (acc.get(tag) || 0) + 1)
                      return acc
                    }, new Map<string, number>())
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12)
                  .map(([tag, count]) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1.5 text-xs font-medium cursor-pointer hover:bg-primary/20"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                      <span className="text-muted-foreground">({count})</span>
                    </Badge>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
