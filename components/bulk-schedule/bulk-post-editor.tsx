"use client"

import { useState, useId } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Copy,
  BookmarkPlus,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  GripVertical,
  Hash,
  X,
  MoreHorizontal,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Platform, BulkPost, BulkPostStatus } from "@/app/bulk-schedule/page"

interface BulkPostEditorProps {
  posts: BulkPost[]
  selectedPosts: string[]
  onSelectPosts: (ids: string[]) => void
  onUpdatePost: (id: string, updates: Partial<BulkPost>) => void
  onDeletePost: (id: string) => void
  onDuplicatePost: (id: string) => void
  onAddToLibrary: (post: BulkPost) => void
  platformLimits: Record<Platform, number>
}

const platformConfig: Record<Platform, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  instagram: { name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  facebook: { name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "bg-[#1877F2]" },
  twitter: { name: "X", icon: Twitter, color: "#000000", bgColor: "bg-black" },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", bgColor: "bg-[#0A66C2]" },
  threads: { name: "Threads", icon: AtSign, color: "#000000", bgColor: "bg-black" },
  tiktok: { name: "TikTok", icon: Zap, color: "#000000", bgColor: "bg-black" },
}

const statusConfig: Record<BulkPostStatus, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: "Draft", color: "text-gray-600", bgColor: "bg-gray-500/10", icon: Clock },
  ready: { label: "Ready", color: "text-green-600", bgColor: "bg-green-500/10", icon: CheckCircle2 },
  scheduled: { label: "Scheduled", color: "text-primary", bgColor: "bg-primary/10", icon: CalendarIcon },
  error: { label: "Error", color: "text-destructive", bgColor: "bg-destructive/10", icon: AlertCircle },
}

export function BulkPostEditor({
  posts,
  selectedPosts,
  onSelectPosts,
  onUpdatePost,
  onDeletePost,
  onDuplicatePost,
  onAddToLibrary,
  platformLimits,
}: BulkPostEditorProps) {
  const id = useId()
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [hashtagInput, setHashtagInput] = useState<Record<string, string>>({})

  const toggleSelect = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      onSelectPosts(selectedPosts.filter((id) => id !== postId))
    } else {
      onSelectPosts([...selectedPosts, postId])
    }
  }

  const selectAll = () => {
    if (selectedPosts.length === posts.length) {
      onSelectPosts([])
    } else {
      onSelectPosts(posts.map((p) => p.id))
    }
  }

  const togglePlatform = (postId: string, platform: Platform, currentPlatforms: Platform[]) => {
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform]
    onUpdatePost(postId, { platforms: newPlatforms })
  }

  const addHashtag = (postId: string, hashtags: string[]) => {
    const input = hashtagInput[postId]?.trim()
    if (input && !hashtags.includes(input.replace("#", ""))) {
      onUpdatePost(postId, { hashtags: [...hashtags, input.replace("#", "")] })
      setHashtagInput((prev) => ({ ...prev, [postId]: "" }))
    }
  }

  const removeHashtag = (postId: string, hashtags: string[], tag: string) => {
    onUpdatePost(postId, { hashtags: hashtags.filter((h) => h !== tag) })
  }

  if (posts.length === 0) {
    return (
      <Card className="p-12 bg-card border-border shadow-sm">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Upload a CSV file, drag media, or click "Add Post" to start creating your bulk schedule
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Select All Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`${id}-select-all`}
            checked={selectedPosts.length === posts.length && posts.length > 0}
            onCheckedChange={selectAll}
          />
          <label htmlFor={`${id}-select-all`} className="text-sm font-medium text-muted-foreground cursor-pointer">
            {selectedPosts.length > 0 ? `${selectedPosts.length} selected` : "Select all"}
          </label>
        </div>
        <span className="text-xs text-muted-foreground">{posts.length} posts</span>
      </div>

      {/* Post Cards */}
      <div className="space-y-3">
        {posts.map((post, index) => {
          const isSelected = selectedPosts.includes(post.id)
          const isExpanded = expandedPost === post.id
          const status = statusConfig[post.status]
          const StatusIcon = status.icon
          const hasErrors = post.errors.length > 0

          return (
            <Card
              key={post.id}
              className={cn(
                "bg-card border-border shadow-sm overflow-hidden transition-all duration-200",
                isSelected && "ring-2 ring-primary/50 border-primary/30",
                isExpanded && "shadow-md"
              )}
            >
              <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(post.id)}
                    />
                    <div className="text-muted-foreground/50 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Platforms */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Object.entries(platformConfig).map(([key, config]) => {
                        const platform = key as Platform
                        const Icon = config.icon
                        const isActive = post.platforms.includes(platform)
                        const charCount = post.characterCount[platform]
                        const limit = platformLimits[platform]
                        const isOverLimit = charCount > limit

                        return (
                          <button
                            key={platform}
                            type="button"
                            onClick={() => togglePlatform(post.id, platform, post.platforms)}
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                              isActive
                                ? isOverLimit
                                  ? "bg-destructive/10 text-destructive border border-destructive/30"
                                  : "bg-primary/10 text-primary border border-primary/30"
                                : "bg-muted/60 text-muted-foreground hover:bg-muted border border-transparent"
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {isActive && (
                              <span className={cn("tabular-nums", isOverLimit && "text-destructive")}>
                                {charCount}/{limit}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Content Textarea */}
                    <Textarea
                      value={post.content}
                      onChange={(e) => onUpdatePost(post.id, { content: e.target.value })}
                      placeholder="Write your post content..."
                      className="min-h-[80px] resize-none border-0 bg-muted/40 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 text-sm"
                    />

                    {/* Hashtags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                      {post.hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 pr-1 text-xs font-medium"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeHashtag(post.id, post.hashtags, tag)}
                            className="ml-0.5 p-0.5 rounded hover:bg-muted-foreground/20"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        value={hashtagInput[post.id] || ""}
                        onChange={(e) => setHashtagInput((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addHashtag(post.id, post.hashtags)}
                        placeholder="Add hashtag..."
                        className="h-6 w-24 text-xs border-0 bg-transparent px-1 focus-visible:ring-0"
                      />
                    </div>

                    {/* Media Preview */}
                    {post.media.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.media.map((item) => (
                          <div key={item.id} className="relative group">
                            <Avatar className="w-16 h-16 rounded-xl border border-border">
                              <AvatarImage src={item.url} className="object-cover" />
                              <AvatarFallback className="rounded-xl bg-muted">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdatePost(post.id, {
                                  media: post.media.filter((m) => m.id !== item.id),
                                })
                              }
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 text-[10px] font-semibold",
                        status.bgColor,
                        status.color,
                        "border-transparent"
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>

                    {/* Schedule Pickers */}
                    <div className="flex items-center gap-1.5">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 gap-1.5 text-xs rounded-lg",
                              !post.scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {post.scheduledDate
                              ? format(post.scheduledDate, "MMM d")
                              : "Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={post.scheduledDate || undefined}
                            onSelect={(date) =>
                              onUpdatePost(post.id, { scheduledDate: date || null })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 gap-1.5 text-xs rounded-lg",
                              !post.scheduledTime && "text-muted-foreground"
                            )}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {post.scheduledTime || "Time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-3" align="end">
                          <div className="grid grid-cols-3 gap-1.5">
                            {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((time) => (
                              <Button
                                key={time}
                                variant={post.scheduledTime === time ? "default" : "ghost"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => onUpdatePost(post.id, { scheduledTime: time })}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {hasErrors && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/10 mt-3">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1">
                      {post.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onDuplicatePost(post.id)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onAddToLibrary(post)}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Save to Library
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeletePost(post.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
