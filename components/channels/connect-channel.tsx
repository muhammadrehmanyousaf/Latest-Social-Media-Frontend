"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Zap,
  Youtube,
  CircleDot,
  X,
  Search,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  Calendar,
  Link2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Platform } from "@/app/channels/page"

interface ConnectChannelProps {
  onConnect: (platform: Platform) => void
  onClose: () => void
  connectedPlatforms: Platform[]
}

const platforms: {
  id: Platform
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
  features: string[]
}[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    description: "Connect your Instagram Business or Creator account",
    features: ["Post photos & videos", "Stories & Reels", "Analytics & Insights"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    bgColor: "bg-[#1877F2]",
    description: "Connect your Facebook Page for business posting",
    features: ["Page posts", "Stories", "Audience insights"],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "#000000",
    bgColor: "bg-black",
    description: "Connect your X account for tweets and threads",
    features: ["Tweets & threads", "Media uploads", "Analytics"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    bgColor: "bg-[#0A66C2]",
    description: "Connect your LinkedIn profile or company page",
    features: ["Posts & articles", "Company updates", "Professional network"],
  },
  {
    id: "threads",
    name: "Threads",
    icon: AtSign,
    color: "#000000",
    bgColor: "bg-black",
    description: "Connect your Threads account via Instagram",
    features: ["Text posts", "Conversations", "Cross-posting"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Zap,
    color: "#000000",
    bgColor: "bg-black",
    description: "Connect your TikTok Business account",
    features: ["Video uploads", "Trending content", "Analytics"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    bgColor: "bg-[#FF0000]",
    description: "Connect your YouTube channel",
    features: ["Video uploads", "Shorts", "Community posts"],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: CircleDot,
    color: "#E60023",
    bgColor: "bg-[#E60023]",
    description: "Connect your Pinterest Business account",
    features: ["Pin creation", "Boards", "Audience insights"],
  },
]

export function ConnectChannel({ onConnect, onClose, connectedPlatforms }: ConnectChannelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const filteredPlatforms = platforms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConnect = () => {
    if (!selectedPlatform) return
    setIsConnecting(true)
    // Simulate OAuth flow
    setTimeout(() => {
      onConnect(selectedPlatform)
      setIsConnecting(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Connect a Channel</h2>
              <p className="text-sm text-muted-foreground">Choose a platform to connect</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!selectedPlatform ? (
            <>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search platforms..."
                  className="pl-9 rounded-xl bg-muted/60 border-0"
                />
              </div>

              {/* Platforms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPlatforms.map((platform) => {
                  const Icon = platform.icon
                  const isConnected = connectedPlatforms.includes(platform.id)

                  return (
                    <button
                      key={platform.id}
                      onClick={() => !isConnected && setSelectedPlatform(platform.id)}
                      disabled={isConnected}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all text-left",
                        isConnected
                          ? "border-green-500/30 bg-green-500/5 cursor-not-allowed"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          platform.bgColor
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{platform.name}</h3>
                          {isConnected && (
                            <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {platform.description}
                        </p>
                      </div>
                      {!isConnected && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      )}
                    </button>
                  )
                })}
              </div>

              {filteredPlatforms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No platforms found</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Selected Platform Details */}
              {(() => {
                const platform = platforms.find((p) => p.id === selectedPlatform)!
                const Icon = platform.icon

                return (
                  <div className="space-y-6">
                    {/* Platform Header */}
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center",
                          platform.bgColor
                        )}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <Card className="p-4 bg-muted/40 border-0">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        What you can do
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {platform.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Permissions */}
                    <Card className="p-4 bg-muted/40 border-0">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Permissions required
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">Access to your profile information</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">Create and schedule posts</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">View analytics and insights</span>
                        </div>
                      </div>
                    </Card>

                    {/* Security Note */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Secure Connection</p>
                        <p className="text-xs text-blue-600/80">
                          We use OAuth 2.0 for secure authentication. Your password is never stored or shared with us.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          {selectedPlatform ? (
            <>
              <Button variant="ghost" onClick={() => setSelectedPlatform(null)}>
                Back
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="gap-2 rounded-xl shadow-sm"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Connect {platforms.find((p) => p.id === selectedPlatform)?.name}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {connectedPlatforms.length} of {platforms.length} platforms connected
              </p>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
