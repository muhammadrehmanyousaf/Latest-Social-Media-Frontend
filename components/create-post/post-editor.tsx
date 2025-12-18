"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ImageIcon, Video, Smile, Hash, AtSign, MapPin, Clock, X, Upload, Pencil, Sparkles, Globe } from "lucide-react"
import type { Platform, PostContent } from "@/app/create-post/page"
import { cn } from "@/lib/utils"

const emojis = ["😀", "😂", "🔥", "❤️", "👍", "🎉", "✨", "💯", "🚀", "💪", "👏", "🙌", "💡", "📈", "🎯", "⭐"]

const suggestedHashtags = [
  "#marketing",
  "#socialmedia",
  "#business",
  "#entrepreneur",
  "#digitalmarketing",
  "#growth",
  "#success",
  "#motivation",
  "#branding",
  "#startup",
]

interface PostEditorProps {
  content: PostContent
  onContentChange: (content: Partial<PostContent>) => void
  activePlatform: Platform
  syncContent: boolean
}

export function PostEditor({ content, onContentChange, activePlatform, syncContent }: PostEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const characterLimits: Record<Platform, number> = {
    instagram: 2200,
    facebook: 63206,
    twitter: 280,
    linkedin: 3000,
    threads: 500,
    tiktok: 2200,
  }

  const maxChars = characterLimits[activePlatform]
  const charCount = content.text.length
  const charPercentage = (charCount / maxChars) * 100

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith("image/") ? "image" : "video"
        onContentChange({
          media: [...content.media, { url, type }],
        })
      }
    })
  }

  const removeMedia = (index: number) => {
    onContentChange({
      media: content.media.filter((_, i) => i !== index),
    })
  }

  const insertEmoji = (emoji: string) => {
    onContentChange({ text: content.text + emoji })
  }

  const insertHashtag = (hashtag: string) => {
    onContentChange({
      text: content.text + (content.text.endsWith(" ") || content.text === "" ? "" : " ") + hashtag + " ",
      hashtags: [...content.hashtags, hashtag],
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Editor Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Sync indicator */}
        {syncContent && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs text-primary font-medium">Content synced across all selected platforms</span>
          </div>
        )}

        {/* Text Area */}
        <div className="relative mb-4">
          <Textarea
            placeholder="What would you like to share?"
            value={content.text}
            onChange={(e) => onContentChange({ text: e.target.value })}
            className="min-h-[200px] resize-none border-0 bg-muted/30 rounded-xl p-4 text-base focus-visible:ring-1 focus-visible:ring-primary/50"
          />

          {/* Character count */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="relative h-5 w-5">
              <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${charPercentage * 0.5} 100`}
                  className={cn(
                    charPercentage > 90 ? "text-destructive" : charPercentage > 75 ? "text-yellow-500" : "text-primary",
                  )}
                />
              </svg>
            </div>
            <span
              className={cn("text-xs font-medium", charPercentage > 90 ? "text-destructive" : "text-muted-foreground")}
            >
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Media Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all duration-200 p-4",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/40",
          )}
        >
          {/* Uploaded Media Grid */}
          {content.media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {content.media.map((item, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeMedia(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add more button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add more</span>
              </button>
            </div>
          )}

          {/* Empty state */}
          {content.media.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Drag & drop your media here</p>
              <p className="text-xs text-muted-foreground mb-3">or click to browse files</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="h-4 w-4" />
                  Video
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(Array.from(e.target.files))
              }
            }}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Emoji picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Hashtag picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Suggested hashtags</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedHashtags.map((hashtag) => (
                    <button
                      key={hashtag}
                      onClick={() => insertHashtag(hashtag)}
                      className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Mention */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <AtSign className="h-5 w-5 text-muted-foreground" />
            </Button>

            {/* Location */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </Button>

            <div className="h-5 w-px bg-border mx-2" />

            {/* AI Suggestions */}
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs">AI Suggestions</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Best time to post</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
