"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Link2,
  Copy,
  Check,
  ExternalLink,
  Tag,
  BarChart3,
  Clock,
  Zap,
  Plus,
  Trash2,
  RefreshCw,
  Settings2,
  ChevronDown,
  Globe,
  QrCode,
  Sparkles,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ShortenedLink {
  id: string
  originalUrl: string
  shortUrl: string
  customAlias?: string
  clicks: number
  createdAt: Date
  utmParams?: UTMParams
}

interface UTMParams {
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
}

interface LinkShortenerProps {
  onInsertLink?: (shortUrl: string) => void
  trigger?: React.ReactNode
}

const utmPresets = [
  { label: "Twitter Post", source: "twitter", medium: "social", campaign: "organic" },
  { label: "Instagram Bio", source: "instagram", medium: "social", campaign: "bio_link" },
  { label: "Facebook Ad", source: "facebook", medium: "paid_social", campaign: "fb_ads" },
  { label: "LinkedIn Post", source: "linkedin", medium: "social", campaign: "organic" },
  { label: "Email Newsletter", source: "newsletter", medium: "email", campaign: "weekly_digest" },
  { label: "Google Ads", source: "google", medium: "cpc", campaign: "search_ads" },
]

const recentLinks: ShortenedLink[] = [
  {
    id: "1",
    originalUrl: "https://example.com/blog/ultimate-guide-social-media-marketing-2024",
    shortUrl: "sflow.io/sm-guide",
    clicks: 1247,
    createdAt: new Date(Date.now() - 86400000 * 2),
    utmParams: { source: "twitter", medium: "social", campaign: "blog_promo" },
  },
  {
    id: "2",
    originalUrl: "https://example.com/products/pro-plan",
    shortUrl: "sflow.io/pro",
    clicks: 892,
    createdAt: new Date(Date.now() - 86400000 * 5),
    utmParams: { source: "linkedin", medium: "social", campaign: "product_launch" },
  },
  {
    id: "3",
    originalUrl: "https://example.com/webinar/social-trends-2024",
    shortUrl: "sflow.io/webinar",
    clicks: 456,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
]

export function LinkShortener({ onInsertLink, trigger }: LinkShortenerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("shorten")
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [isShortening, setIsShortening] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [showUTM, setShowUTM] = useState(false)
  const [utmParams, setUtmParams] = useState<UTMParams>({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  })

  const generateShortUrl = async () => {
    if (!url) return

    setIsShortening(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const alias = customAlias || Math.random().toString(36).substring(2, 8)
    const shortUrl = `sflow.io/${alias}`
    setShortenedUrl(shortUrl)
    setIsShortening(false)
  }

  const buildUrlWithUTM = () => {
    if (!url) return url

    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)

    if (utmParams.source) urlObj.searchParams.set("utm_source", utmParams.source)
    if (utmParams.medium) urlObj.searchParams.set("utm_medium", utmParams.medium)
    if (utmParams.campaign) urlObj.searchParams.set("utm_campaign", utmParams.campaign)
    if (utmParams.term) urlObj.searchParams.set("utm_term", utmParams.term)
    if (utmParams.content) urlObj.searchParams.set("utm_content", utmParams.content)

    return urlObj.toString()
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    const linkToInsert = shortenedUrl || (showUTM ? buildUrlWithUTM() : url)
    onInsertLink?.(linkToInsert)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setUrl("")
    setCustomAlias("")
    setShortenedUrl("")
    setUtmParams({ source: "", medium: "", campaign: "", term: "", content: "" })
  }

  const applyPreset = (preset: typeof utmPresets[0]) => {
    setUtmParams({
      ...utmParams,
      source: preset.source,
      medium: preset.medium,
      campaign: preset.campaign,
    })
  }

  const previewUrl = showUTM && url ? buildUrlWithUTM() : url

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Link2 className="w-4 h-4" />
            Link Tools
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            Link Shortener & UTM Builder
          </DialogTitle>
          <DialogDescription>
            Create short, trackable links for your social media posts
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full h-10 bg-muted/50">
              <TabsTrigger value="shorten" className="flex-1 gap-2">
                <Zap className="w-4 h-4" />
                Shorten
              </TabsTrigger>
              <TabsTrigger value="utm" className="flex-1 gap-2">
                <Tag className="w-4 h-4" />
                UTM Builder
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Shorten Tab */}
          <TabsContent value="shorten" className="m-0 p-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Original URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/your-long-url"
                    className="pl-9"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Alias (optional)</Label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center border rounded-lg bg-muted/30">
                    <span className="px-3 text-sm text-muted-foreground">sflow.io/</span>
                    <Input
                      placeholder="my-custom-link"
                      className="border-0 bg-transparent focus-visible:ring-0"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add UTM Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Add UTM Parameters</p>
                    <p className="text-xs text-muted-foreground">Track campaign performance</p>
                  </div>
                </div>
                <Button
                  variant={showUTM ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUTM(!showUTM)}
                >
                  {showUTM ? "Added" : "Add UTM"}
                </Button>
              </div>

              {showUTM && (
                <div className="space-y-3 p-4 rounded-lg border border-dashed bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quick Presets</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {utmPresets.slice(0, 4).map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => applyPreset(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Source *</Label>
                      <Input
                        placeholder="twitter"
                        className="h-8 text-sm"
                        value={utmParams.source}
                        onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Medium *</Label>
                      <Input
                        placeholder="social"
                        className="h-8 text-sm"
                        value={utmParams.medium}
                        onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Campaign *</Label>
                      <Input
                        placeholder="spring_sale"
                        className="h-8 text-sm"
                        value={utmParams.campaign}
                        onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shorten Button & Result */}
              {!shortenedUrl ? (
                <Button
                  className="w-full gap-2"
                  onClick={generateShortUrl}
                  disabled={!url || isShortening}
                >
                  {isShortening ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Shorten Link
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-600">Shortened Link</span>
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <BarChart3 className="w-3 h-3" />
                        Trackable
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-lg font-semibold text-green-600">
                        {shortenedUrl}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleCopy(shortenedUrl)}
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`https://${shortenedUrl}`, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Open link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={resetForm}>
                      Create Another
                    </Button>
                    <Button className="flex-1 gap-2" onClick={handleInsert}>
                      <Plus className="w-4 h-4" />
                      Insert to Post
                    </Button>
                  </div>
                </div>
              )}

              {/* Preview URL */}
              {url && !shortenedUrl && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Preview</p>
                  <p className="text-sm font-mono break-all">{previewUrl}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* UTM Builder Tab */}
          <TabsContent value="utm" className="m-0 p-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Destination URL</Label>
                <Input
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Quick Presets</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {utmPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Source <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., twitter, newsletter"
                    value={utmParams.source}
                    onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Where the traffic comes from</p>
                </div>
                <div className="space-y-2">
                  <Label>
                    Medium <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., social, email, cpc"
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Marketing medium type</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Campaign <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., spring_sale, product_launch"
                  value={utmParams.campaign}
                  onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Campaign name for tracking</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Term (optional)</Label>
                  <Input
                    placeholder="e.g., running+shoes"
                    value={utmParams.term}
                    onChange={(e) => setUtmParams({ ...utmParams, term: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content (optional)</Label>
                  <Input
                    placeholder="e.g., banner_ad"
                    value={utmParams.content}
                    onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
                  />
                </div>
              </div>

              {/* Generated URL */}
              {url && (
                <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Generated URL</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1"
                      onClick={() => handleCopy(buildUrlWithUTM())}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>
                  </div>
                  <code className="block text-xs break-all p-2 rounded bg-background">
                    {buildUrlWithUTM()}
                  </code>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setActiveTab("shorten")}>
                  <Zap className="w-4 h-4 mr-2" />
                  Also Shorten
                </Button>
                <Button className="flex-1" onClick={handleInsert} disabled={!url}>
                  <Plus className="w-4 h-4 mr-2" />
                  Insert to Post
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="m-0">
            <ScrollArea className="h-[400px]">
              <div className="p-6 pt-4 space-y-3">
                {recentLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-xl border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-sm font-semibold text-primary">{link.shortUrl}</code>
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleCopy(link.shortUrl)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <BarChart3 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Analytics</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {link.originalUrl}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BarChart3 className="w-3 h-3" />
                        {link.clicks.toLocaleString()} clicks
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                      {link.utmParams && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          UTM tracked
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Compact version for inline use
export function LinkShortenerInline({ onInsertLink }: { onInsertLink?: (url: string) => void }) {
  const [url, setUrl] = useState("")
  const [isShortening, setIsShortening] = useState(false)
  const [shortUrl, setShortUrl] = useState("")

  const handleShorten = async () => {
    if (!url) return
    setIsShortening(true)
    await new Promise((r) => setTimeout(r, 800))
    const short = `sflow.io/${Math.random().toString(36).substring(2, 8)}`
    setShortUrl(short)
    setIsShortening(false)
    onInsertLink?.(short)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link2 className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Quick Link Shortener</span>
          </div>
          <Input
            placeholder="Paste your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {shortUrl && (
            <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
              <code className="text-sm text-green-600">{shortUrl}</code>
            </div>
          )}
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={handleShorten}
            disabled={!url || isShortening}
          >
            {isShortening ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isShortening ? "Shortening..." : "Shorten & Insert"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
