"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  Folder,
  Plus,
  Download,
  Upload,
  Copy,
  Check,
  Trash2,
  Edit,
  MoreHorizontal,
  Search,
  Star,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  Users,
  Settings,
  Sparkles,
  Grid,
  List,
  ChevronRight,
  ExternalLink,
  Layers,
  PenTool,
  Droplets,
  Square,
  Circle,
  Link,
  RefreshCw,
  Wand2,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import NextLink from "next/link"
import { format } from "date-fns"

interface BrandColor {
  id: string
  name: string
  hex: string
  rgb: { r: number; g: number; b: number }
  usage: string
  isPrimary: boolean
}

interface BrandFont {
  id: string
  name: string
  family: string
  weights: number[]
  usage: string
  previewText: string
  source: "google" | "custom" | "system"
}

interface BrandLogo {
  id: string
  name: string
  type: "primary" | "secondary" | "icon" | "wordmark" | "monochrome"
  url: string
  format: string
  dimensions: { width: number; height: number }
  colorMode: "color" | "black" | "white"
  minSize: number
  clearSpace: number
}

interface BrandTemplate {
  id: string
  name: string
  platform: string
  category: string
  thumbnail: string
  dimensions: { width: number; height: number }
  usageCount: number
  createdAt: Date
}

interface BrandGuideline {
  id: string
  title: string
  category: string
  content: string
  lastUpdated: Date
}

interface BrandAsset {
  id: string
  name: string
  type: "image" | "icon" | "pattern" | "illustration"
  url: string
  tags: string[]
  usageCount: number
}

// Mock Data
const mockColors: BrandColor[] = [
  { id: "c1", name: "Primary Blue", hex: "#2563EB", rgb: { r: 37, g: 99, b: 235 }, usage: "Primary brand color for CTAs, links, and key elements", isPrimary: true },
  { id: "c2", name: "Secondary Purple", hex: "#7C3AED", rgb: { r: 124, g: 58, b: 237 }, usage: "Accent color for highlights and secondary elements", isPrimary: false },
  { id: "c3", name: "Success Green", hex: "#10B981", rgb: { r: 16, g: 185, b: 129 }, usage: "Success states, positive indicators", isPrimary: false },
  { id: "c4", name: "Warning Orange", hex: "#F59E0B", rgb: { r: 245, g: 158, b: 11 }, usage: "Warning states, attention indicators", isPrimary: false },
  { id: "c5", name: "Error Red", hex: "#EF4444", rgb: { r: 239, g: 68, b: 68 }, usage: "Error states, destructive actions", isPrimary: false },
  { id: "c6", name: "Dark Gray", hex: "#1F2937", rgb: { r: 31, g: 41, b: 55 }, usage: "Primary text, headings", isPrimary: false },
  { id: "c7", name: "Light Gray", hex: "#9CA3AF", rgb: { r: 156, g: 163, b: 175 }, usage: "Secondary text, borders", isPrimary: false },
  { id: "c8", name: "Background", hex: "#F9FAFB", rgb: { r: 249, g: 250, b: 251 }, usage: "Page backgrounds, cards", isPrimary: false },
]

const mockFonts: BrandFont[] = [
  { id: "f1", name: "Primary Heading", family: "Inter", weights: [600, 700, 800], usage: "Headlines, titles, and important text", previewText: "The quick brown fox jumps", source: "google" },
  { id: "f2", name: "Body Text", family: "Inter", weights: [400, 500], usage: "Body copy, paragraphs, and general text", previewText: "Lorem ipsum dolor sit amet", source: "google" },
  { id: "f3", name: "Accent Font", family: "Playfair Display", weights: [400, 600], usage: "Special headlines, quotes, emphasis", previewText: "Elegant & Bold", source: "google" },
  { id: "f4", name: "Code/Mono", family: "JetBrains Mono", weights: [400, 500], usage: "Code snippets, technical content", previewText: "const brand = 'awesome'", source: "google" },
]

const mockLogos: BrandLogo[] = [
  { id: "l1", name: "Primary Logo", type: "primary", url: "/logos/primary.svg", format: "SVG", dimensions: { width: 200, height: 50 }, colorMode: "color", minSize: 120, clearSpace: 24 },
  { id: "l2", name: "Logo Icon", type: "icon", url: "/logos/icon.svg", format: "SVG", dimensions: { width: 64, height: 64 }, colorMode: "color", minSize: 32, clearSpace: 8 },
  { id: "l3", name: "Wordmark", type: "wordmark", url: "/logos/wordmark.svg", format: "SVG", dimensions: { width: 180, height: 40 }, colorMode: "color", minSize: 100, clearSpace: 16 },
  { id: "l4", name: "White Logo", type: "monochrome", url: "/logos/white.svg", format: "SVG", dimensions: { width: 200, height: 50 }, colorMode: "white", minSize: 120, clearSpace: 24 },
  { id: "l5", name: "Black Logo", type: "monochrome", url: "/logos/black.svg", format: "SVG", dimensions: { width: 200, height: 50 }, colorMode: "black", minSize: 120, clearSpace: 24 },
]

const mockTemplates: BrandTemplate[] = [
  { id: "t1", name: "Instagram Post - Product", platform: "Instagram", category: "Product", thumbnail: "/templates/ig-product.png", dimensions: { width: 1080, height: 1080 }, usageCount: 45, createdAt: new Date(2024, 8, 15) },
  { id: "t2", name: "Instagram Story - Quote", platform: "Instagram", category: "Quote", thumbnail: "/templates/ig-quote.png", dimensions: { width: 1080, height: 1920 }, usageCount: 32, createdAt: new Date(2024, 9, 1) },
  { id: "t3", name: "LinkedIn Post - Announcement", platform: "LinkedIn", category: "Announcement", thumbnail: "/templates/li-announce.png", dimensions: { width: 1200, height: 627 }, usageCount: 18, createdAt: new Date(2024, 9, 10) },
  { id: "t4", name: "Twitter Header", platform: "Twitter", category: "Header", thumbnail: "/templates/tw-header.png", dimensions: { width: 1500, height: 500 }, usageCount: 5, createdAt: new Date(2024, 10, 1) },
  { id: "t5", name: "Facebook Cover", platform: "Facebook", category: "Cover", thumbnail: "/templates/fb-cover.png", dimensions: { width: 820, height: 312 }, usageCount: 8, createdAt: new Date(2024, 10, 5) },
  { id: "t6", name: "YouTube Thumbnail", platform: "YouTube", category: "Thumbnail", thumbnail: "/templates/yt-thumb.png", dimensions: { width: 1280, height: 720 }, usageCount: 22, createdAt: new Date(2024, 10, 8) },
]

const mockGuidelines: BrandGuideline[] = [
  { id: "g1", title: "Logo Usage Guidelines", category: "Logo", content: "Always maintain minimum clear space around the logo. Never distort, rotate, or alter the logo colors outside of approved variations.", lastUpdated: new Date(2024, 10, 1) },
  { id: "g2", title: "Color Application", category: "Color", content: "Primary blue should be used for main CTAs and important interactive elements. Use accent colors sparingly for emphasis.", lastUpdated: new Date(2024, 9, 15) },
  { id: "g3", title: "Typography Hierarchy", category: "Typography", content: "Use heading font for all titles and headers. Body font should be used for paragraph text. Maintain consistent sizing ratios.", lastUpdated: new Date(2024, 10, 5) },
  { id: "g4", title: "Voice & Tone", category: "Content", content: "Our brand voice is professional yet approachable. We use clear, concise language and avoid jargon. Be helpful and empowering.", lastUpdated: new Date(2024, 10, 10) },
  { id: "g5", title: "Social Media Standards", category: "Social", content: "Maintain consistent visual identity across all platforms. Use approved templates and follow platform-specific best practices.", lastUpdated: new Date(2024, 10, 12) },
]

const mockAssets: BrandAsset[] = [
  { id: "a1", name: "Icon Set", type: "icon", url: "/assets/icons.zip", tags: ["icons", "ui"], usageCount: 89 },
  { id: "a2", name: "Brand Pattern", type: "pattern", url: "/assets/pattern.svg", tags: ["pattern", "background"], usageCount: 34 },
  { id: "a3", name: "Team Illustration", type: "illustration", url: "/assets/team.svg", tags: ["illustration", "team"], usageCount: 12 },
  { id: "a4", name: "Product Mockups", type: "image", url: "/assets/mockups.zip", tags: ["mockup", "product"], usageCount: 56 },
]

export default function BrandKitPage() {
  usePageHeader({
    title: "Brand Kit",
    subtitle: "Manage your brand assets",
    icon: Palette,
  });

  const [colors, setColors] = useState<BrandColor[]>(mockColors)
  const [fonts] = useState<BrandFont[]>(mockFonts)
  const [logos] = useState<BrandLogo[]>(mockLogos)
  const [templates] = useState<BrandTemplate[]>(mockTemplates)
  const [guidelines] = useState<BrandGuideline[]>(mockGuidelines)
  const [assets] = useState<BrandAsset[]>(mockAssets)
  const [activeTab, setActiveTab] = useState("colors")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(id)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const stats = {
    colors: colors.length,
    fonts: fonts.length,
    logos: logos.length,
    templates: templates.length,
    assets: assets.length,
  }

  return (
    <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">Public Brand Kit</span>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <NextLink href="/media-studio">
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Media Studio
                </Button>
              </NextLink>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("colors")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.colors}</p>
                    <p className="text-xs text-muted-foreground">Colors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("typography")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Type className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.fonts}</p>
                    <p className="text-xs text-muted-foreground">Fonts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("logos")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.logos}</p>
                    <p className="text-xs text-muted-foreground">Logos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("templates")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Grid className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.templates}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab("assets")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.assets}</p>
                    <p className="text-xs text-muted-foreground">Assets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full max-w-2xl">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="logos">Logos</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Brand Colors</h2>
                  <p className="text-sm text-muted-foreground">Your brand's color palette</p>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {colors.map((color) => (
                  <Card key={color.id} className="overflow-hidden">
                    <div
                      className="h-24 relative"
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.isPrimary && (
                        <Badge className="absolute top-2 left-2 bg-white/90 text-black">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{color.name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Set as Primary
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">HEX</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 font-mono text-xs"
                            onClick={() => copyToClipboard(color.hex, `${color.id}-hex`)}
                          >
                            {color.hex}
                            {copiedColor === `${color.id}-hex` ? (
                              <Check className="h-3 w-3 ml-1 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">RGB</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 font-mono text-xs"
                            onClick={() =>
                              copyToClipboard(
                                `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
                                `${color.id}-rgb`
                              )
                            }
                          >
                            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                            {copiedColor === `${color.id}-rgb` ? (
                              <Check className="h-3 w-3 ml-1 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">{color.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Typography</h2>
                  <p className="text-sm text-muted-foreground">Brand fonts and type styles</p>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Font
                </Button>
              </div>

              <div className="grid gap-4">
                {fonts.map((font) => (
                  <Card key={font.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{font.name}</h3>
                            <Badge variant="secondary">{font.source}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{font.usage}</p>
                          <div
                            className="text-3xl mb-4"
                            style={{ fontFamily: font.family }}
                          >
                            {font.previewText}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">Family:</span>
                            <span className="font-medium">{font.family}</span>
                            <span className="text-muted-foreground">Weights:</span>
                            <div className="flex gap-1">
                              {font.weights.map((w) => (
                                <Badge key={w} variant="outline">
                                  {w}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Font
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy CSS
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Logos Tab */}
            <TabsContent value="logos" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Logo Assets</h2>
                  <p className="text-sm text-muted-foreground">Official logo variations</p>
                </div>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logos.map((logo) => (
                  <Card key={logo.id}>
                    <CardContent className="p-0">
                      <div
                        className={`h-32 flex items-center justify-center ${
                          logo.colorMode === "white"
                            ? "bg-gray-900"
                            : logo.colorMode === "black"
                            ? "bg-gray-100"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="w-32 h-12 bg-gradient-to-r from-primary/50 to-primary/30 rounded flex items-center justify-center">
                          <Layers className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{logo.name}</h3>
                          <Badge variant="secondary">{logo.type}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Format: {logo.format}</p>
                          <p>Size: {logo.dimensions.width} × {logo.dimensions.height}</p>
                          <p>Min size: {logo.minSize}px</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Brand Templates</h2>
                  <p className="text-sm text-muted-foreground">Pre-designed templates for social media</p>
                </div>
                <div className="flex gap-2">
                  <NextLink href="/templates">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      All Templates
                    </Button>
                  </NextLink>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                      <Grid className="h-8 w-8 text-primary/30" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <NextLink href="/media-studio">
                          <Button size="sm" variant="secondary">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </NextLink>
                        <NextLink href="/create-post">
                          <Button size="sm">
                            Use
                          </Button>
                        </NextLink>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.platform}</Badge>
                          <span>{template.dimensions.width} × {template.dimensions.height}</span>
                        </div>
                        <span>Used {template.usageCount}x</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Brand Assets</h2>
                  <p className="text-sm text-muted-foreground">Icons, patterns, and illustrations</p>
                </div>
                <div className="flex gap-2">
                  <NextLink href="/media-studio">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Media Studio
                    </Button>
                  </NextLink>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <Card key={asset.id}>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                        {asset.type === "icon" && <Square className="h-12 w-12 text-muted-foreground" />}
                        {asset.type === "pattern" && <Grid className="h-12 w-12 text-muted-foreground" />}
                        {asset.type === "illustration" && <PenTool className="h-12 w-12 text-muted-foreground" />}
                        {asset.type === "image" && <ImageIcon className="h-12 w-12 text-muted-foreground" />}
                      </div>
                      <h3 className="font-medium mb-1">{asset.name}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Used {asset.usageCount} times</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Brand Guidelines</h2>
                  <p className="text-sm text-muted-foreground">Documentation and best practices</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Guideline
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {guidelines.map((guideline) => (
                  <Card key={guideline.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{guideline.title}</h3>
                              <Badge variant="outline">{guideline.category}</Badge>
                            </div>
                            <p className="text-muted-foreground">{guideline.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Last updated: {format(guideline.lastUpdated, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Brand Voice */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Wand2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">AI Brand Voice Assistant</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use AI to ensure all your content matches your brand voice and guidelines.
                      </p>
                      <NextLink href="/ai-assistant">
                        <Button size="sm">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Open AI Assistant
                        </Button>
                      </NextLink>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  )
}
