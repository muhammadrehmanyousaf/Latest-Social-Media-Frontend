"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  Image as ImageIcon,
  Video,
  Upload,
  FolderOpen,
  Grid,
  List,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Copy,
  Edit,
  Star,
  Clock,
  HardDrive,
  Cloud,
  Palette,
  Type,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Sparkles,
  Wand2,
  Sun,
  Contrast,
  Droplets,
  Maximize2,
  Move,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  X,
  Check,
  Plus,
  Play,
  Pause,
  Scissors,
  Volume2,
  VolumeX,
  Music,
  Film,
  Square,
  Circle,
  Triangle,
  Minus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Link,
  Unlink,
  RefreshCw,
  ArrowUpRight,
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
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import NextLink from "next/link"
import { format, formatDistanceToNow } from "date-fns"

type MediaType = "image" | "video" | "gif"
type ViewMode = "grid" | "list"
type EditorTool = "crop" | "adjust" | "filters" | "text" | "elements" | "resize"

interface MediaFile {
  id: string
  name: string
  type: MediaType
  url: string
  thumbnail: string
  size: number
  dimensions: { width: number; height: number }
  duration?: number
  createdAt: Date
  modifiedAt: Date
  tags: string[]
  isFavorite: boolean
  usageCount: number
}

interface Template {
  id: string
  name: string
  platform: string
  dimensions: { width: number; height: number }
  thumbnail: string
}

interface AdjustmentSettings {
  brightness: number
  contrast: number
  saturation: number
  exposure: number
  highlights: number
  shadows: number
  blur: number
  sharpness: number
}

// Mock Data
const mockMediaFiles: MediaFile[] = [
  {
    id: "m1",
    name: "Summer Campaign Banner.png",
    type: "image",
    url: "/media/summer-banner.png",
    thumbnail: "/thumbnails/summer-banner.png",
    size: 2450000,
    dimensions: { width: 1200, height: 628 },
    createdAt: new Date(Date.now() - 86400000),
    modifiedAt: new Date(Date.now() - 3600000),
    tags: ["campaign", "summer", "banner"],
    isFavorite: true,
    usageCount: 12,
  },
  {
    id: "m2",
    name: "Product Showcase Video.mp4",
    type: "video",
    url: "/media/product-video.mp4",
    thumbnail: "/thumbnails/product-video.png",
    size: 15600000,
    dimensions: { width: 1920, height: 1080 },
    duration: 45,
    createdAt: new Date(Date.now() - 172800000),
    modifiedAt: new Date(Date.now() - 86400000),
    tags: ["product", "video", "showcase"],
    isFavorite: true,
    usageCount: 8,
  },
  {
    id: "m3",
    name: "Instagram Story Template.png",
    type: "image",
    url: "/media/story-template.png",
    thumbnail: "/thumbnails/story-template.png",
    size: 890000,
    dimensions: { width: 1080, height: 1920 },
    createdAt: new Date(Date.now() - 259200000),
    modifiedAt: new Date(Date.now() - 172800000),
    tags: ["instagram", "story", "template"],
    isFavorite: false,
    usageCount: 25,
  },
  {
    id: "m4",
    name: "Team Photo.jpg",
    type: "image",
    url: "/media/team-photo.jpg",
    thumbnail: "/thumbnails/team-photo.png",
    size: 3200000,
    dimensions: { width: 2400, height: 1600 },
    createdAt: new Date(Date.now() - 604800000),
    modifiedAt: new Date(Date.now() - 604800000),
    tags: ["team", "photo", "company"],
    isFavorite: false,
    usageCount: 5,
  },
  {
    id: "m5",
    name: "Animated Logo.gif",
    type: "gif",
    url: "/media/animated-logo.gif",
    thumbnail: "/thumbnails/animated-logo.png",
    size: 1200000,
    dimensions: { width: 500, height: 500 },
    createdAt: new Date(Date.now() - 1209600000),
    modifiedAt: new Date(Date.now() - 864000000),
    tags: ["logo", "animation", "brand"],
    isFavorite: true,
    usageCount: 45,
  },
  {
    id: "m6",
    name: "LinkedIn Post Graphic.png",
    type: "image",
    url: "/media/linkedin-post.png",
    thumbnail: "/thumbnails/linkedin-post.png",
    size: 1800000,
    dimensions: { width: 1200, height: 1200 },
    createdAt: new Date(Date.now() - 432000000),
    modifiedAt: new Date(Date.now() - 432000000),
    tags: ["linkedin", "post", "graphic"],
    isFavorite: false,
    usageCount: 3,
  },
]

const mockTemplates: Template[] = [
  { id: "t1", name: "Instagram Post", platform: "instagram", dimensions: { width: 1080, height: 1080 }, thumbnail: "/templates/ig-post.png" },
  { id: "t2", name: "Instagram Story", platform: "instagram", dimensions: { width: 1080, height: 1920 }, thumbnail: "/templates/ig-story.png" },
  { id: "t3", name: "Facebook Post", platform: "facebook", dimensions: { width: 1200, height: 630 }, thumbnail: "/templates/fb-post.png" },
  { id: "t4", name: "Twitter Post", platform: "twitter", dimensions: { width: 1200, height: 675 }, thumbnail: "/templates/tw-post.png" },
  { id: "t5", name: "LinkedIn Post", platform: "linkedin", dimensions: { width: 1200, height: 627 }, thumbnail: "/templates/li-post.png" },
  { id: "t6", name: "TikTok Video", platform: "tiktok", dimensions: { width: 1080, height: 1920 }, thumbnail: "/templates/tt-video.png" },
  { id: "t7", name: "YouTube Thumbnail", platform: "youtube", dimensions: { width: 1280, height: 720 }, thumbnail: "/templates/yt-thumb.png" },
  { id: "t8", name: "Pinterest Pin", platform: "pinterest", dimensions: { width: 1000, height: 1500 }, thumbnail: "/templates/pin.png" },
]

const filters = [
  { id: "none", name: "None", preview: "bg-gray-100" },
  { id: "warm", name: "Warm", preview: "bg-orange-100" },
  { id: "cool", name: "Cool", preview: "bg-blue-100" },
  { id: "vintage", name: "Vintage", preview: "bg-amber-100" },
  { id: "dramatic", name: "Dramatic", preview: "bg-gray-800" },
  { id: "vibrant", name: "Vibrant", preview: "bg-pink-100" },
  { id: "muted", name: "Muted", preview: "bg-stone-200" },
  { id: "noir", name: "Noir", preview: "bg-gray-900" },
]

export default function MediaStudioPage() {
  usePageHeader({
    title: "Media Studio",
    subtitle: "Create and edit your media",
    icon: ImageIcon,
  })

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [templates] = useState<Template[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState("library")
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTool, setActiveTool] = useState<EditorTool>("adjust")
  const [selectedFilter, setSelectedFilter] = useState("none")
  const [adjustments, setAdjustments] = useState<AdjustmentSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    blur: 0,
    sharpness: 0,
  })
  const [zoom, setZoom] = useState(100)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Filter media files
  const filteredMedia = mediaFiles.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === "all" || media.type === selectedType
    return matchesSearch && matchesType
  })

  // Stats
  const stats = {
    total: mediaFiles.length,
    images: mediaFiles.filter((m) => m.type === "image").length,
    videos: mediaFiles.filter((m) => m.type === "video").length,
    totalSize: mediaFiles.reduce((sum, m) => sum + m.size, 0),
  }

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`
    return `${bytes} B`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const toggleFavorite = (id: string) => {
    setMediaFiles(mediaFiles.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    ))
  }

  const deleteMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter((m) => m.id !== id))
    if (selectedMedia?.id === id) {
      setSelectedMedia(null)
      setIsEditing(false)
    }
  }

  const openEditor = (media: MediaFile) => {
    setSelectedMedia(media)
    setIsEditing(true)
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      blur: 0,
      sharpness: 0,
    })
    setSelectedFilter("none")
    setZoom(100)
  }

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      blur: 0,
      sharpness: 0,
    })
    setSelectedFilter("none")
  }

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "gif":
        return <Film className="h-4 w-4" />
    }
  }

  return (
    <>
        {!isEditing ? (
          <>

            {/* Upload Progress */}
            {isUploading && (
              <div className="px-4 lg:px-6 py-3 bg-muted/50 border-b">
                <div className="flex items-center gap-4">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Uploading files...</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsUploading(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Files</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <FolderOpen className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Images</p>
                        <p className="text-2xl font-bold">{stats.images}</p>
                      </div>
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Videos</p>
                        <p className="text-2xl font-bold">{stats.videos}</p>
                      </div>
                      <Video className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Storage Used</p>
                        <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs & Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="library">Media Library</TabsTrigger>
                    <TabsTrigger value="favorites">
                      Favorites
                      <Badge variant="secondary" className="ml-2">
                        {mediaFiles.filter((m) => m.isFavorite).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="ai-generate">
                      AI Generate
                      <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        NEW
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 w-[200px]"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={(v) => setSelectedType(v as MediaType | "all")}>
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="gif">GIFs</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Media Library Tab */}
              {activeTab === "library" && (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Upload Card */}
                    <Card className="aspect-square border-dashed cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleUpload}>
                      <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Upload Media</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Drop files here or click
                        </p>
                      </CardContent>
                    </Card>

                    {/* Media Files */}
                    {filteredMedia.map((media) => (
                      <Card key={media.id} className="group overflow-hidden cursor-pointer" onClick={() => openEditor(media)}>
                        <CardContent className="p-0">
                          <div className="aspect-square relative bg-muted">
                            {/* Thumbnail placeholder */}
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                              {getTypeIcon(media.type)}
                            </div>

                            {/* Type badge */}
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs">
                                {media.type.toUpperCase()}
                              </Badge>
                            </div>

                            {/* Duration for videos */}
                            {media.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                {formatDuration(media.duration)}
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openEditor(media); }}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>

                            {/* Favorite */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                media.isFavorite ? "text-yellow-500 opacity-100" : ""
                              }`}
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); }}
                            >
                              <Star className={`h-4 w-4 ${media.isFavorite ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium truncate">{media.name}</p>
                            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                              <span>{media.dimensions.width} × {media.dimensions.height}</span>
                              <span>{formatFileSize(media.size)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {filteredMedia.map((media) => (
                          <div
                            key={media.id}
                            className="p-4 hover:bg-muted/50 transition-colors flex items-center gap-4 cursor-pointer"
                            onClick={() => openEditor(media)}
                          >
                            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              {getTypeIcon(media.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{media.name}</h3>
                                {media.isFavorite && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">{media.type}</Badge>
                                <span>{media.dimensions.width} × {media.dimensions.height}</span>
                                <span>{formatFileSize(media.size)}</span>
                                {media.duration && <span>{formatDuration(media.duration)}</span>}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground text-right">
                              <p>{formatDistanceToNow(media.modifiedAt, { addSuffix: true })}</p>
                              <p className="text-xs">Used {media.usageCount} times</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); }}>
                                <Star className={`h-4 w-4 ${media.isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditor(media)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <NextLink href="/create-post">
                                    <DropdownMenuItem>
                                      <ArrowUpRight className="h-4 w-4 mr-2" />
                                      Use in Post
                                    </DropdownMenuItem>
                                  </NextLink>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => { e.stopPropagation(); deleteMedia(media.id); }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredMedia.filter((m) => m.isFavorite).map((media) => (
                    <Card key={media.id} className="group overflow-hidden cursor-pointer" onClick={() => openEditor(media)}>
                      <CardContent className="p-0">
                        <div className="aspect-square relative bg-muted">
                          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                            {getTypeIcon(media.type)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-7 w-7 p-0 text-yellow-500"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); }}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{media.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Templates Tab */}
              {activeTab === "templates" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Layers className="h-8 w-8 text-primary/50" />
                        </div>
                        <div className="p-3">
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.dimensions.width} × {template.dimensions.height}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* AI Generate Tab */}
              {activeTab === "ai-generate" && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="h-10 w-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AI Image Generator</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create stunning images from text descriptions using AI. Perfect for social media posts, ads, and more.
                    </p>
                    <div className="max-w-lg mx-auto space-y-4">
                      <Input
                        placeholder="Describe the image you want to create..."
                        className="h-12"
                      />
                      <div className="flex justify-center gap-3">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Image
                        </Button>
                        <NextLink href="/ai-assistant">
                          <Button variant="outline">
                            <Wand2 className="h-4 w-4 mr-2" />
                            AI Assistant
                          </Button>
                        </NextLink>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          /* Editor View */
          <div className="flex flex-col h-full">
            {/* Editor Header */}
            <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="h-4 w-px bg-border" />
                <span className="font-medium">{selectedMedia?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Redo className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 px-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-4 w-px bg-border" />
                <Button variant="outline" size="sm" onClick={resetAdjustments}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <NextLink href="/create-post">
                  <Button size="sm" variant="default">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Use in Post
                  </Button>
                </NextLink>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* Tools Sidebar */}
              <div className="w-14 border-r bg-card flex flex-col items-center py-4 gap-2">
                <Button
                  variant={activeTool === "crop" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("crop")}
                >
                  <Crop className="h-5 w-5" />
                </Button>
                <Button
                  variant={activeTool === "adjust" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("adjust")}
                >
                  <Sun className="h-5 w-5" />
                </Button>
                <Button
                  variant={activeTool === "filters" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("filters")}
                >
                  <Sparkles className="h-5 w-5" />
                </Button>
                <Button
                  variant={activeTool === "text" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("text")}
                >
                  <Type className="h-5 w-5" />
                </Button>
                <Button
                  variant={activeTool === "elements" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("elements")}
                >
                  <Square className="h-5 w-5" />
                </Button>
                <Button
                  variant={activeTool === "resize" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setActiveTool("resize")}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-auto p-8">
                <div
                  className="bg-white shadow-xl rounded-lg overflow-hidden"
                  style={{
                    width: selectedMedia ? selectedMedia.dimensions.width * (zoom / 100) / 3 : 400,
                    height: selectedMedia ? selectedMedia.dimensions.height * (zoom / 100) / 3 : 300,
                    filter: `
                      brightness(${adjustments.brightness}%)
                      contrast(${adjustments.contrast}%)
                      saturate(${adjustments.saturation}%)
                      blur(${adjustments.blur}px)
                    `,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="w-72 border-l bg-card overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-6">
                    {/* Crop Tool */}
                    {activeTool === "crop" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Crop & Transform</h3>
                        <div className="grid grid-cols-4 gap-2">
                          <Button variant="outline" size="sm" className="h-10">
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-10">
                            <FlipHorizontal className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-10">
                            <FlipVertical className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-10">
                            <Crop className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Aspect Ratio</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Free", "1:1", "4:3", "16:9", "9:16", "4:5"].map((ratio) => (
                              <Button key={ratio} variant="outline" size="sm" className="text-xs">
                                {ratio}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Adjust Tool */}
                    {activeTool === "adjust" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Adjustments</h3>
                        {[
                          { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200 },
                          { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200 },
                          { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200 },
                        ].map(({ key, label, icon: Icon, min, max }) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {label}
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                {adjustments[key as keyof AdjustmentSettings]}
                              </span>
                            </div>
                            <Slider
                              value={[adjustments[key as keyof AdjustmentSettings]]}
                              onValueChange={([value]) =>
                                setAdjustments({ ...adjustments, [key]: value })
                              }
                              min={min}
                              max={max}
                              step={1}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Filters Tool */}
                    {activeTool === "filters" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Filters</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {filters.map((filter) => (
                            <button
                              key={filter.id}
                              className={`p-2 rounded-lg border transition-all ${
                                selectedFilter === filter.id
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedFilter(filter.id)}
                            >
                              <div className={`aspect-square rounded mb-1 ${filter.preview}`} />
                              <span className="text-xs">{filter.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Text Tool */}
                    {activeTool === "text" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Add Text</h3>
                        <Button variant="outline" className="w-full">
                          <Type className="h-4 w-4 mr-2" />
                          Add Text Layer
                        </Button>
                        <div className="space-y-2">
                          <Label className="text-sm">Font Family</Label>
                          <Select defaultValue="inter">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="roboto">Roboto</SelectItem>
                              <SelectItem value="poppins">Poppins</SelectItem>
                              <SelectItem value="montserrat">Montserrat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Elements Tool */}
                    {activeTool === "elements" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Elements</h3>
                        <div className="space-y-2">
                          <Label className="text-sm">Shapes</Label>
                          <div className="grid grid-cols-4 gap-2">
                            <Button variant="outline" size="sm" className="h-10">
                              <Square className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-10">
                              <Circle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-10">
                              <Triangle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-10">
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <NextLink href="/brand-kit">
                          <Button variant="outline" className="w-full">
                            <Palette className="h-4 w-4 mr-2" />
                            Import from Brand Kit
                          </Button>
                        </NextLink>
                      </div>
                    )}

                    {/* Resize Tool */}
                    {activeTool === "resize" && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Resize</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Width</Label>
                            <Input
                              type="number"
                              defaultValue={selectedMedia?.dimensions.width}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Height</Label>
                            <Input
                              type="number"
                              defaultValue={selectedMedia?.dimensions.height}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Link className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Lock aspect ratio
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Presets</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {templates.slice(0, 4).map((t) => (
                              <Button
                                key={t.id}
                                variant="outline"
                                size="sm"
                                className="text-xs justify-start"
                              >
                                {t.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
    </>
  )
}
