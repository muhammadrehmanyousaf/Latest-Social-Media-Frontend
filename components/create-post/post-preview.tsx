"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  Repeat2,
  Eye,
  Info,
} from "lucide-react"
import type { Platform, PostContent } from "@/app/create-post/page"

interface PostPreviewProps {
  platform: Platform
  content: PostContent
}

const platformConfig: Record<Platform, { name: string; icon: string; color: string }> = {
  instagram: { name: "Instagram", icon: "IG", color: "#E4405F" },
  facebook: { name: "Facebook", icon: "FB", color: "#1877F2" },
  twitter: { name: "X (Twitter)", icon: "X", color: "#000000" },
  linkedin: { name: "LinkedIn", icon: "in", color: "#0A66C2" },
  threads: { name: "Threads", icon: "@", color: "#000000" },
  tiktok: { name: "TikTok", icon: "TT", color: "#000000" },
}

export function PostPreview({ platform, content }: PostPreviewProps) {
  const config = platformConfig[platform]

  return (
    <div className="w-[400px] flex flex-col bg-muted/30 overflow-hidden">
      {/* Preview Header */}
      <div className="px-4 py-3 border-b border-border bg-background flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Post Preview</span>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ backgroundColor: config.color }}
          >
            {config.icon}
          </div>
          <span className="text-xs font-medium text-foreground">{config.name}</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-center">
          {platform === "instagram" && <InstagramPreview content={content} />}
          {platform === "facebook" && <FacebookPreview content={content} />}
          {platform === "twitter" && <TwitterPreview content={content} />}
          {platform === "linkedin" && <LinkedInPreview content={content} />}
          {platform === "threads" && <ThreadsPreview content={content} />}
          {platform === "tiktok" && <TikTokPreview content={content} />}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Preview may vary from actual post</span>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
            View full preview
          </Button>
        </div>
      </div>
    </div>
  )
}

function InstagramPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 ring-offset-2 ring-offset-background">
            <AvatarImage src="/generic-brand-logo.png" />
            <AvatarFallback>YB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">yourbrand</p>
            <p className="text-[10px] text-muted-foreground">Sponsored</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Image */}
      <div className="aspect-square bg-muted relative">
        {content.media.length > 0 ? (
          <img src={content.media[0].url || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No media added</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 cursor-pointer hover:text-red-500 transition-colors" />
            <MessageCircle className="h-6 w-6 cursor-pointer" />
            <Send className="h-6 w-6 cursor-pointer" />
          </div>
          <Bookmark className="h-6 w-6 cursor-pointer" />
        </div>

        <p className="text-sm font-semibold mb-1">1,234 likes</p>
        <p className="text-sm">
          <span className="font-semibold">yourbrand</span>{" "}
          <span className="text-foreground">{content.text || "Your caption will appear here..."}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">View all 89 comments</p>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase">2 hours ago</p>
      </div>
    </Card>
  )
}

function FacebookPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/generic-brand-logo.png" />
            <AvatarFallback>YB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Your Brand</p>
            <p className="text-xs text-muted-foreground">2h · 🌎</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Text */}
      <div className="px-3 pb-2">
        <p className="text-sm text-foreground">{content.text || "Your post content will appear here..."}</p>
      </div>

      {/* Image */}
      {content.media.length > 0 && (
        <div className="aspect-video bg-muted">
          <img src={content.media[0].url || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <Heart className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <span>1.2K</span>
        </div>
        <span>89 comments · 23 shares</span>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-2 py-1 flex items-center justify-around">
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </Card>
  )
}

function TwitterPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden rounded-xl p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/generic-brand-logo.png" />
          <AvatarFallback>YB</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-semibold text-sm text-foreground">Your Brand</span>
            <span className="text-sm text-muted-foreground">@yourbrand · 2h</span>
          </div>
          <p className="text-sm text-foreground mb-3">{content.text || "Your tweet will appear here..."}</p>

          {content.media.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-3">
              <img src={content.media[0].url || "/placeholder.svg"} alt="Post" className="w-full object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">89</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">234</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <Heart className="h-4 w-4" />
              <span className="text-xs">1.2K</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <Eye className="h-4 w-4" />
              <span className="text-xs">45K</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function LinkedInPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/generic-brand-logo.png" />
            <AvatarFallback>YB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Your Brand</p>
            <p className="text-xs text-muted-foreground">10,234 followers</p>
            <p className="text-xs text-muted-foreground">2h · 🌐</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Text */}
      <div className="px-3 pb-3">
        <p className="text-sm text-foreground">{content.text || "Your LinkedIn post will appear here..."}</p>
      </div>

      {/* Image */}
      {content.media.length > 0 && (
        <div className="aspect-video bg-muted">
          <img src={content.media[0].url || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex -space-x-1">
          <div className="w-4 h-4 rounded-full bg-blue-600" />
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <div className="w-4 h-4 rounded-full bg-red-500" />
        </div>
        <span>1,234 · 89 comments · 23 reposts</span>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-2 py-1 flex items-center justify-around">
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <Repeat2 className="h-4 w-4" />
          Repost
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>
    </Card>
  )
}

function ThreadsPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden rounded-xl p-4">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/generic-brand-logo.png" />
            <AvatarFallback>YB</AvatarFallback>
          </Avatar>
          <div className="w-0.5 flex-1 bg-border mt-2" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-foreground">yourbrand</span>
              <span className="text-sm text-muted-foreground">· 2h</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-foreground mb-3">{content.text || "Your thread will appear here..."}</p>

          {content.media.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-3">
              <img src={content.media[0].url || "/placeholder.svg"} alt="Post" className="w-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 text-muted-foreground">
            <Heart className="h-5 w-5 cursor-pointer" />
            <MessageCircle className="h-5 w-5 cursor-pointer" />
            <Repeat2 className="h-5 w-5 cursor-pointer" />
            <Send className="h-5 w-5 cursor-pointer" />
          </div>

          <p className="text-xs text-muted-foreground mt-2">89 replies · 234 likes</p>
        </div>
      </div>
    </Card>
  )
}

function TikTokPreview({ content }: { content: PostContent }) {
  return (
    <Card className="w-full max-w-[280px] overflow-hidden rounded-xl bg-black relative aspect-[9/16]">
      {/* Video/Image Background */}
      {content.media.length > 0 ? (
        <img
          src={content.media[0].url || "/placeholder.svg"}
          alt="Post"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
          <p className="text-sm text-gray-400">No media added</p>
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Right Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-white">1.2K</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-white">89</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-white">234</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-white">Share</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-3 right-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm text-white">@yourbrand</span>
        </div>
        <p className="text-xs text-white line-clamp-2">{content.text || "Your caption will appear here..."}</p>
      </div>
    </Card>
  )
}
