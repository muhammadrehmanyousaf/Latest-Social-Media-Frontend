"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Hash,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  RefreshCw,
  Plus,
  X,
  Target,
  Users,
  BarChart3,
  Zap,
  Info,
  Search,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Star,
  Crown,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Hashtag {
  tag: string
  popularity: "high" | "medium" | "low" | "niche"
  volume: number
  relevance: number
  trending?: boolean
  competition: "high" | "medium" | "low"
}

interface HashtagGeneratorProps {
  content?: string
  platform?: string
  onInsertHashtags?: (hashtags: string[]) => void
  trigger?: React.ReactNode
}

const popularityConfig = {
  high: { label: "High Volume", color: "bg-red-500", icon: Flame, description: "1M+ posts" },
  medium: { label: "Medium", color: "bg-amber-500", icon: TrendingUp, description: "100K-1M posts" },
  low: { label: "Low Volume", color: "bg-blue-500", icon: BarChart3, description: "10K-100K posts" },
  niche: { label: "Niche", color: "bg-purple-500", icon: Target, description: "<10K posts" },
}

const competitionConfig = {
  high: { label: "High Competition", color: "text-red-500" },
  medium: { label: "Medium Competition", color: "text-amber-500" },
  low: { label: "Low Competition", color: "text-green-500" },
}

const hashtagCategories = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "niche", label: "Niche" },
  { id: "brand", label: "Brand" },
  { id: "community", label: "Community" },
]

const generateHashtags = (content: string, platform: string): Hashtag[] => {
  // Simulated AI-generated hashtags based on content
  const baseHashtags: Hashtag[] = [
    { tag: "socialmedia", popularity: "high", volume: 45000000, relevance: 95, competition: "high" },
    { tag: "marketing", popularity: "high", volume: 38000000, relevance: 90, competition: "high" },
    { tag: "digitalmarketing", popularity: "high", volume: 25000000, relevance: 92, trending: true, competition: "high" },
    { tag: "contentcreator", popularity: "medium", volume: 8500000, relevance: 88, competition: "medium" },
    { tag: "growthhacking", popularity: "medium", volume: 2100000, relevance: 85, trending: true, competition: "medium" },
    { tag: "socialmediastrategy", popularity: "low", volume: 450000, relevance: 94, competition: "low" },
    { tag: "contentmarketing", popularity: "medium", volume: 5600000, relevance: 91, competition: "medium" },
    { tag: "brandawareness", popularity: "low", volume: 890000, relevance: 87, competition: "low" },
    { tag: "marketingtips", popularity: "medium", volume: 3200000, relevance: 89, trending: true, competition: "medium" },
    { tag: "socialmediamanager", popularity: "low", volume: 1200000, relevance: 86, competition: "low" },
    { tag: "instagramgrowth", popularity: "medium", volume: 4500000, relevance: 82, competition: "medium" },
    { tag: "businessgrowth", popularity: "medium", volume: 6700000, relevance: 84, competition: "medium" },
    { tag: "entrepreneur", popularity: "high", volume: 52000000, relevance: 78, competition: "high" },
    { tag: "smallbusiness", popularity: "high", volume: 28000000, relevance: 80, competition: "high" },
    { tag: "b2bmarketing", popularity: "niche", volume: 89000, relevance: 93, competition: "low" },
    { tag: "linkedintips", popularity: "niche", volume: 156000, relevance: 90, competition: "low" },
    { tag: "contentcreation", popularity: "medium", volume: 7800000, relevance: 88, competition: "medium" },
    { tag: "viralcontent", popularity: "low", volume: 980000, relevance: 83, competition: "medium" },
    { tag: "engagementtips", popularity: "niche", volume: 45000, relevance: 91, competition: "low" },
    { tag: "socialmediatips", popularity: "medium", volume: 4100000, relevance: 94, competition: "medium" },
  ]

  // Add platform-specific hashtags
  const platformHashtags: Record<string, Hashtag[]> = {
    instagram: [
      { tag: "instagramreels", popularity: "high", volume: 12000000, relevance: 85, trending: true, competition: "high" },
      { tag: "igdaily", popularity: "medium", volume: 5400000, relevance: 75, competition: "medium" },
    ],
    twitter: [
      { tag: "twittermarketing", popularity: "low", volume: 234000, relevance: 88, competition: "low" },
      { tag: "twittertips", popularity: "niche", volume: 67000, relevance: 86, competition: "low" },
    ],
    linkedin: [
      { tag: "linkedinmarketing", popularity: "niche", volume: 98000, relevance: 92, competition: "low" },
      { tag: "thoughtleadership", popularity: "niche", volume: 156000, relevance: 89, competition: "low" },
    ],
    tiktok: [
      { tag: "tiktoktips", popularity: "medium", volume: 3200000, relevance: 84, trending: true, competition: "medium" },
      { tag: "fyp", popularity: "high", volume: 890000000, relevance: 70, competition: "high" },
    ],
  }

  const result = [...baseHashtags]
  if (platformHashtags[platform]) {
    result.push(...platformHashtags[platform])
  }

  return result.sort((a, b) => b.relevance - a.relevance)
}

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
  return volume.toString()
}

export function HashtagGenerator({ content = "", platform = "instagram", onInsertHashtags, trigger }: HashtagGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [inputContent, setInputContent] = useState(content)
  const [selectedPlatform, setSelectedPlatform] = useState(platform)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [maxHashtags, setMaxHashtags] = useState([15])
  const [includeNiche, setIncludeNiche] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (content) {
      setInputContent(content)
    }
  }, [content])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const generated = generateHashtags(inputContent, selectedPlatform)
    setHashtags(generated)
    // Auto-select top hashtags based on settings
    const autoSelected = generated
      .filter((h) => includeNiche || h.popularity !== "niche")
      .slice(0, maxHashtags[0])
      .map((h) => h.tag)
    setSelectedHashtags(autoSelected)
    setIsGenerating(false)
  }

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 30
        ? [...prev, tag]
        : prev
    )
  }

  const handleCopy = async () => {
    const hashtagString = selectedHashtags.map((t) => `#${t}`).join(" ")
    await navigator.clipboard.writeText(hashtagString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertHashtags?.(selectedHashtags)
    setOpen(false)
  }

  const filteredHashtags = hashtags.filter((h) => {
    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "trending" && h.trending) ||
      (categoryFilter === "niche" && h.popularity === "niche") ||
      (categoryFilter === "brand" && h.relevance >= 90) ||
      (categoryFilter === "community" && h.competition === "low")
    const matchesSearch = h.tag.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Hash className="w-4 h-4" />
            Hashtag Generator
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                AI Hashtag Generator
              </DialogTitle>
              <DialogDescription>
                Generate optimized hashtags for maximum reach and engagement
              </DialogDescription>
            </div>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[550px]">
          {/* Input Section */}
          <div className="p-4 border-b space-y-4">
            <div className="space-y-2">
              <Label>Content or Topic</Label>
              <Textarea
                placeholder="Describe your post or paste your content here..."
                className="min-h-[80px] resize-none"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Max hashtags: {maxHashtags[0]}</Label>
                  <Slider
                    value={maxHashtags}
                    onValueChange={setMaxHashtags}
                    min={5}
                    max={30}
                    step={1}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="niche"
                    checked={includeNiche}
                    onCheckedChange={setIncludeNiche}
                  />
                  <Label htmlFor="niche" className="text-xs">Include niche</Label>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!inputContent || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {hashtags.length > 0 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Selected Hashtags Preview */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Selected ({selectedHashtags.length}/{maxHashtags[0]})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => setSelectedHashtags([])}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                  {selectedHashtags.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Click hashtags below to select them</span>
                  ) : (
                    selectedHashtags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="gap-1 pr-1 cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleHashtag(tag)}
                      >
                        #{tag}
                        <X className="w-3 h-3" />
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="p-3 border-b flex items-center gap-3">
                <div className="relative flex-1 max-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search hashtags..."
                    className="pl-9 h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  {hashtagCategories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={categoryFilter === cat.id ? "default" : "ghost"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setCategoryFilter(cat.id)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hashtag Grid */}
              <ScrollArea className="flex-1">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {filteredHashtags.map((hashtag) => {
                    const isSelected = selectedHashtags.includes(hashtag.tag)
                    const config = popularityConfig[hashtag.popularity]
                    const PopIcon = config.icon
                    return (
                      <TooltipProvider key={hashtag.tag}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleHashtag(hashtag.tag)}
                              className={cn(
                                "p-3 rounded-xl border text-left transition-all",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                  : "hover:border-primary/30 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-sm">#{hashtag.tag}</span>
                                  {hashtag.trending && (
                                    <Flame className="w-3 h-3 text-orange-500" />
                                  )}
                                </div>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <PopIcon className="w-3 h-3" />
                                  {formatVolume(hashtag.volume)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {hashtag.relevance}%
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn("h-4 text-[10px] px-1", config.color, "text-white border-0")}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="space-y-1">
                              <p className="font-medium">#{hashtag.tag}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatVolume(hashtag.volume)} posts · {hashtag.relevance}% relevant
                              </p>
                              <p className={cn("text-xs", competitionConfig[hashtag.competition].color)}>
                                {competitionConfig[hashtag.competition].label}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State */}
          {hashtags.length === 0 && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center mb-4">
                <Hash className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-medium mb-1">Generate Hashtags</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter your content or topic above and click Generate to get AI-powered hashtag suggestions
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {hashtags.length > 0 && (
          <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4" />
              Mix high-volume and niche hashtags for best results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setHashtags([])}>
                Start Over
              </Button>
              <Button onClick={handleInsert} disabled={selectedHashtags.length === 0} className="gap-2">
                <Plus className="w-4 h-4" />
                Insert {selectedHashtags.length} Hashtags
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Compact inline version
export function HashtagGeneratorInline({ onInsert }: { onInsert?: (tags: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const quickTags = ["marketing", "socialmedia", "business", "growth", "tips"]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Hash className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-pink-500" />
            <span className="font-medium text-sm">Quick Hashtags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  onInsert?.([tag])
                  setIsOpen(false)
                }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
          <HashtagGenerator
            trigger={
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                Generate More
              </Button>
            }
            onInsertHashtags={onInsert}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
