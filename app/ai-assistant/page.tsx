"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  PenSquare,
  MessageSquare,
  Hash,
  Image as ImageIcon,
  Video,
  FileText,
  Zap,
  Crown,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  History,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "threads"
type ContentType = "caption" | "hashtags" | "ideas" | "reply" | "thread" | "bio"
type Tone = "professional" | "casual" | "witty" | "inspirational" | "educational"

interface GeneratedContent {
  id: string
  content: string
  type: ContentType
  platform: Platform
  tone: Tone
  timestamp: Date
  isSaved: boolean
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Zap,
  threads: MessageSquare,
}

const contentTypes = [
  { id: "caption", label: "Caption", icon: PenSquare, description: "Generate engaging post captions" },
  { id: "hashtags", label: "Hashtags", icon: Hash, description: "Get relevant hashtag suggestions" },
  { id: "ideas", label: "Content Ideas", icon: Lightbulb, description: "Brainstorm post ideas" },
  { id: "reply", label: "Reply", icon: MessageSquare, description: "Craft thoughtful responses" },
  { id: "thread", label: "Thread", icon: FileText, description: "Create Twitter/X threads" },
  { id: "bio", label: "Bio", icon: Target, description: "Write compelling bios" },
]

const tones = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "😊" },
  { id: "witty", label: "Witty", emoji: "😄" },
  { id: "inspirational", label: "Inspirational", emoji: "✨" },
  { id: "educational", label: "Educational", emoji: "📚" },
]

const quickPrompts = [
  "Write a caption about our new product launch",
  "Generate hashtags for a fitness post",
  "Create content ideas for a restaurant",
  "Write a professional LinkedIn post about leadership",
  "Generate a witty Twitter reply",
  "Create an Instagram bio for a travel blogger",
]

const recentGenerations: GeneratedContent[] = [
  {
    id: "1",
    content: "Introducing something game-changing! 🚀 After months of hard work, we're thrilled to unveil our latest innovation. This isn't just an upgrade—it's a revolution. Stay tuned for the big reveal tomorrow!",
    type: "caption",
    platform: "instagram",
    tone: "professional",
    timestamp: new Date(Date.now() - 3600000),
    isSaved: true,
  },
  {
    id: "2",
    content: "#SocialMediaMarketing #DigitalMarketing #ContentCreation #MarketingTips #SocialMediaManager #GrowthHacking #BrandStrategy #ContentStrategy",
    type: "hashtags",
    platform: "instagram",
    tone: "professional",
    timestamp: new Date(Date.now() - 7200000),
    isSaved: false,
  },
]

export default function AiAssistantPage() {
  usePageHeader({
    title: "AI Assistant",
    subtitle: "AI-powered content creation",
    icon: Sparkles,
  });

  const [prompt, setPrompt] = useState("")
  const [selectedType, setSelectedType] = useState<ContentType>("caption")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram")
  const [selectedTone, setSelectedTone] = useState<Tone>("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [generations, setGenerations] = useState<GeneratedContent[]>(recentGenerations)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = selectedType === "hashtags"
        ? "#SocialMedia #Marketing #ContentCreation #DigitalMarketing #Growth #Strategy #Engagement #Brand #Success #Tips"
        : "Here's something that'll make your day better! 🌟 We've been working behind the scenes on something special, and we can't wait to share it with you. The best things in life are worth waiting for, and trust us—this one's worth it. Drop a 🔥 if you're excited!"
      setGeneratedContent(mockContent)
      setIsGenerating(false)

      const newGeneration: GeneratedContent = {
        id: Date.now().toString(),
        content: mockContent,
        type: selectedType,
        platform: selectedPlatform,
        tone: selectedTone,
        timestamp: new Date(),
        isSaved: false,
      }
      setGenerations([newGeneration, ...generations])
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUseInPost = () => {
    // Navigate to create post with content
    window.location.href = `/create-post?content=${encodeURIComponent(generatedContent)}`
  }

  return (
    <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Content Type Selection */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">What do you want to create?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id as ContentType)}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all",
                        selectedType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <type.icon className={cn(
                        "w-5 h-5 mx-auto mb-2",
                        selectedType === type.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <p className="text-xs font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Platform & Tone Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Platform</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["instagram", "facebook", "twitter", "linkedin", "tiktok", "threads"] as Platform[]).map((platform) => {
                      const Icon = platformIcons[platform]
                      return (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-all",
                            selectedPlatform === platform
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {platform}
                        </button>
                      )
                    })}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Tone</h3>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id as Tone)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                          selectedTone === tone.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span>{tone.emoji}</span>
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Prompt Input */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Describe what you want</h3>
                <Textarea
                  placeholder="e.g., Write a caption about our new eco-friendly product launch that highlights sustainability..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] rounded-xl resize-none mb-3"
                />
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.slice(0, 3).map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(qp)}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                      >
                        {qp.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
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
              </Card>

              {/* Generated Content */}
              {generatedContent && (
                <Card className="p-4 border-violet-500/20 bg-violet-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <h3 className="text-sm font-semibold text-foreground">Generated Content</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerate}
                        className="rounded-xl gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border mb-3">
                    <p className="text-foreground whitespace-pre-wrap">{generatedContent}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Good
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Bad
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
                        <Bookmark className="w-3.5 h-3.5" />
                        Save
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="rounded-xl gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Link href="/create-post">
                        <Button size="sm" className="rounded-xl gap-1.5">
                          <PenSquare className="w-3.5 h-3.5" />
                          Use in Post
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/create-post">
                  <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <PenSquare className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">Create Post</p>
                        <p className="text-xs text-muted-foreground">Use AI content in a new post</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Card>
                </Link>
                <Link href="/templates">
                  <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">Templates</p>
                        <p className="text-xs text-muted-foreground">Browse content templates</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Card>
                </Link>
                <Link href="/inbox">
                  <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">AI Replies</p>
                        <p className="text-xs text-muted-foreground">Generate smart responses</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent History Sidebar */}
          <div className="w-[300px] border-l border-border p-4 overflow-y-auto hidden xl:block">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Generations
            </h3>
            <div className="space-y-3">
              {generations.map((gen) => (
                <Card
                  key={gen.id}
                  className="p-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setGeneratedContent(gen.content)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {gen.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {gen.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-3">{gen.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] gap-1 capitalize">
                      {(() => {
                        const Icon = platformIcons[gen.platform]
                        return <Icon className="w-3 h-3" />
                      })()}
                      {gen.platform}
                    </Badge>
                    {gen.isSaved && (
                      <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
    </div>
  )
}
