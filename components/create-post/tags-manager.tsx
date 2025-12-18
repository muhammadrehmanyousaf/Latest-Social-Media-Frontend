"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Tag, Plus, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const availableTags = [
  { name: "Marketing", color: "#F97316" },
  { name: "Product Launch", color: "#8B5CF6" },
  { name: "Campaign", color: "#10B981" },
  { name: "Announcement", color: "#3B82F6" },
  { name: "Promotional", color: "#EC4899" },
  { name: "Educational", color: "#06B6D4" },
  { name: "Behind the Scenes", color: "#F59E0B" },
  { name: "User Generated", color: "#6366F1" },
]

interface TagsManagerProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagsManager({ selectedTags, onTagsChange }: TagsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredTags = availableTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName))
  }

  return (
    <div className="px-4 py-3 border-b border-border bg-background">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-8 bg-transparent">
              <Tag className="h-3.5 w-3.5" />
              Tags
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 mb-2"
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name)
                return (
                  <button
                    key={tag.name}
                    onClick={() => toggleTag(tag.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                      isSelected ? "bg-primary/10" : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className={isSelected ? "text-primary font-medium" : "text-foreground"}>{tag.name}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Selected Tags */}
        {selectedTags.map((tagName) => {
          const tag = availableTags.find((t) => t.name === tagName)
          return (
            <span
              key={tagName}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${tag?.color}15`,
                color: tag?.color,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag?.color }} />
              {tagName}
              <button onClick={() => removeTag(tagName)} className="ml-0.5 hover:opacity-70 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
