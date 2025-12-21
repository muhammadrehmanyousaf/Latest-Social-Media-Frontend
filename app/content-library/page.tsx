"use client"

import { useState, useCallback } from "react"
import { usePageHeader } from "@/components/page-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Folder,
  FolderOpen,
  FolderPlus,
  Upload,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Download,
  Trash2,
  Edit3,
  Copy,
  Share2,
  Star,
  StarOff,
  Tag,
  Clock,
  HardDrive,
  Cloud,
  Link2,
  Eye,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  SortAsc,
  SortDesc,
  Calendar,
  Sparkles,
  Wand2,
  Palette,
  Type,
  Hash,
  BookMarked,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Move,
  Info,
  Zap,
  RefreshCw,
  Settings,
  Grid3X3,
  LayoutList,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

// Types
interface MediaItem {
  id: string
  name: string
  type: "image" | "video" | "audio" | "document" | "template" | "caption"
  url: string
  thumbnail?: string
  size: number
  dimensions?: { width: number; height: number }
  duration?: number
  folder: string
  tags: string[]
  starred: boolean
  usageCount: number
  createdAt: Date
  modifiedAt: Date
  createdBy: string
  description?: string
  altText?: string
}

interface Folder {
  id: string
  name: string
  parentId: string | null
  color: string
  itemCount: number
  children?: Folder[]
}

interface SavedCaption {
  id: string
  title: string
  content: string
  category: string
  hashtags: string[]
  usageCount: number
  createdAt: Date
}

// Mock Data
const mockFolders: Folder[] = [
  { id: "all", name: "All Media", parentId: null, color: "#6366f1", itemCount: 156 },
  { id: "images", name: "Images", parentId: null, color: "#10b981", itemCount: 89 },
  { id: "videos", name: "Videos", parentId: null, color: "#f59e0b", itemCount: 34 },
  { id: "templates", name: "Templates", parentId: null, color: "#8b5cf6", itemCount: 23 },
  { id: "brand", name: "Brand Assets", parentId: null, color: "#ec4899", itemCount: 18 },
  { id: "campaigns", name: "Campaigns", parentId: null, color: "#06b6d4", itemCount: 45, children: [
    { id: "q4-launch", name: "Q4 Product Launch", parentId: "campaigns", color: "#06b6d4", itemCount: 12 },
    { id: "holiday", name: "Holiday 2024", parentId: "campaigns", color: "#06b6d4", itemCount: 8 },
    { id: "summer", name: "Summer Sale", parentId: "campaigns", color: "#06b6d4", itemCount: 15 },
  ]},
  { id: "ugc", name: "User Generated", parentId: null, color: "#f97316", itemCount: 28 },
  { id: "archived", name: "Archived", parentId: null, color: "#64748b", itemCount: 67 },
]

const mockMedia: MediaItem[] = [
  {
    id: "1",
    name: "product-hero-shot.jpg",
    type: "image",
    url: "/media/product-hero.jpg",
    thumbnail: "/media/product-hero-thumb.jpg",
    size: 2450000,
    dimensions: { width: 1920, height: 1080 },
    folder: "brand",
    tags: ["product", "hero", "featured"],
    starred: true,
    usageCount: 24,
    createdAt: new Date(Date.now() - 86400000 * 5),
    modifiedAt: new Date(Date.now() - 86400000 * 2),
    createdBy: "Sarah Johnson",
    description: "Main product hero shot for landing page",
    altText: "SocialFlow dashboard on laptop screen",
  },
  {
    id: "2",
    name: "team-culture-video.mp4",
    type: "video",
    url: "/media/team-culture.mp4",
    thumbnail: "/media/team-culture-thumb.jpg",
    size: 45000000,
    dimensions: { width: 1920, height: 1080 },
    duration: 120,
    folder: "videos",
    tags: ["team", "culture", "behind-the-scenes"],
    starred: false,
    usageCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 10),
    modifiedAt: new Date(Date.now() - 86400000 * 10),
    createdBy: "Mike Chen",
    description: "Behind the scenes team culture video",
  },
  {
    id: "3",
    name: "instagram-story-template.psd",
    type: "template",
    url: "/media/ig-story-template.psd",
    thumbnail: "/media/ig-story-thumb.jpg",
    size: 8500000,
    dimensions: { width: 1080, height: 1920 },
    folder: "templates",
    tags: ["instagram", "story", "template"],
    starred: true,
    usageCount: 45,
    createdAt: new Date(Date.now() - 86400000 * 30),
    modifiedAt: new Date(Date.now() - 86400000 * 7),
    createdBy: "Emily Davis",
    description: "Reusable Instagram story template with brand colors",
  },
  {
    id: "4",
    name: "logo-primary.svg",
    type: "image",
    url: "/media/logo-primary.svg",
    size: 12000,
    folder: "brand",
    tags: ["logo", "brand", "primary"],
    starred: true,
    usageCount: 156,
    createdAt: new Date(Date.now() - 86400000 * 90),
    modifiedAt: new Date(Date.now() - 86400000 * 30),
    createdBy: "Ali Smith",
    description: "Primary brand logo - SVG format",
    altText: "SocialFlow logo",
  },
  {
    id: "5",
    name: "customer-testimonial.mp4",
    type: "video",
    url: "/media/testimonial.mp4",
    thumbnail: "/media/testimonial-thumb.jpg",
    size: 28000000,
    dimensions: { width: 1920, height: 1080 },
    duration: 60,
    folder: "videos",
    tags: ["testimonial", "customer", "case-study"],
    starred: false,
    usageCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 15),
    modifiedAt: new Date(Date.now() - 86400000 * 15),
    createdBy: "Sarah Johnson",
  },
  {
    id: "6",
    name: "social-media-tips-carousel.png",
    type: "image",
    url: "/media/tips-carousel.png",
    thumbnail: "/media/tips-carousel-thumb.png",
    size: 1800000,
    dimensions: { width: 1080, height: 1080 },
    folder: "images",
    tags: ["carousel", "tips", "educational"],
    starred: false,
    usageCount: 18,
    createdAt: new Date(Date.now() - 86400000 * 3),
    modifiedAt: new Date(Date.now() - 86400000 * 3),
    createdBy: "Emily Davis",
  },
  {
    id: "7",
    name: "brand-guidelines.pdf",
    type: "document",
    url: "/media/brand-guidelines.pdf",
    size: 5600000,
    folder: "brand",
    tags: ["brand", "guidelines", "documentation"],
    starred: true,
    usageCount: 34,
    createdAt: new Date(Date.now() - 86400000 * 60),
    modifiedAt: new Date(Date.now() - 86400000 * 14),
    createdBy: "Ali Smith",
    description: "Official brand guidelines document",
  },
  {
    id: "8",
    name: "podcast-intro.mp3",
    type: "audio",
    url: "/media/podcast-intro.mp3",
    size: 3200000,
    duration: 15,
    folder: "all",
    tags: ["podcast", "audio", "intro"],
    starred: false,
    usageCount: 52,
    createdAt: new Date(Date.now() - 86400000 * 45),
    modifiedAt: new Date(Date.now() - 86400000 * 45),
    createdBy: "Mike Chen",
  },
]

const mockCaptions: SavedCaption[] = [
  {
    id: "c1",
    title: "Product Launch Announcement",
    content: "🚀 Exciting news! We're thrilled to announce [PRODUCT NAME]. This game-changing solution will help you [BENEFIT]. \n\nKey features:\n✅ Feature 1\n✅ Feature 2\n✅ Feature 3\n\nLink in bio to learn more! 👆",
    category: "Announcements",
    hashtags: ["productlaunch", "newrelease", "innovation"],
    usageCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 20),
  },
  {
    id: "c2",
    title: "Educational Tips Post",
    content: "💡 Pro Tip: [TIP TITLE]\n\nHere's what you need to know:\n\n1️⃣ [Step 1]\n2️⃣ [Step 2]\n3️⃣ [Step 3]\n\nSave this post for later! 📌\n\nWhat's your best tip? Drop it in the comments 👇",
    category: "Educational",
    hashtags: ["tips", "howto", "learnmore"],
    usageCount: 28,
    createdAt: new Date(Date.now() - 86400000 * 15),
  },
  {
    id: "c3",
    title: "Behind the Scenes",
    content: "📸 Behind the scenes at [COMPANY]!\n\nEver wondered what goes into [ACTIVITY]? Here's a sneak peek!\n\n[DESCRIPTION]\n\nWe love sharing our journey with you! 💙",
    category: "Culture",
    hashtags: ["behindthescenes", "teamwork", "companyculture"],
    usageCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: "c4",
    title: "Customer Testimonial",
    content: "⭐ \"[QUOTE FROM CUSTOMER]\"\n\n- [Customer Name], [Title] at [Company]\n\nWe're so grateful for customers like [Name]! 🙏\n\nWant results like this? Link in bio! 👆",
    category: "Social Proof",
    hashtags: ["testimonial", "customerlove", "successstory"],
    usageCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 25),
  },
  {
    id: "c5",
    title: "Flash Sale Promo",
    content: "⚡ FLASH SALE ALERT ⚡\n\n[X]% OFF everything for the next [TIME]!\n\n🔥 Use code: [CODE]\n🔥 Valid until [DATE]\n🔥 Don't miss out!\n\nShop now → Link in bio",
    category: "Promotions",
    hashtags: ["sale", "flashsale", "limitedtime"],
    usageCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
]

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const getFileIcon = (type: MediaItem["type"]) => {
  switch (type) {
    case "image": return FileImage
    case "video": return FileVideo
    case "audio": return FileAudio
    case "template": return Palette
    case "document": return FileText
    default: return File
  }
}

const getTypeColor = (type: MediaItem["type"]) => {
  switch (type) {
    case "image": return "bg-green-500"
    case "video": return "bg-amber-500"
    case "audio": return "bg-purple-500"
    case "template": return "bg-pink-500"
    case "document": return "bg-blue-500"
    default: return "bg-gray-500"
  }
}

export default function ContentLibraryPage() {
  usePageHeader({
    title: "Content Library",
    icon: FolderOpen,
    subtitle: "Manage your media and templates",
  })

  const [activeTab, setActiveTab] = useState("media")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("modified")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["campaigns"])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Filter and sort media
  const filteredMedia = mockMedia
    .filter((item) => {
      const matchesFolder = selectedFolder === "all" || item.folder === selectedFolder
      const matchesType = typeFilter === "all" || item.type === typeFilter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFolder && matchesType && matchesSearch
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "size":
          comparison = a.size - b.size
          break
        case "modified":
          comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime()
          break
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "usage":
          comparison = a.usageCount - b.usageCount
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMedia.map((m) => m.id))
    }
  }

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item)
    setShowPreviewDialog(true)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((f) => f !== folderId)
        : [...prev, folderId]
    )
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      simulateUpload(files)
    }
  }, [])

  const simulateUpload = (files: File[]) => {
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

  const totalStorage = 10 * 1024 * 1024 * 1024 // 10 GB
  const usedStorage = mockMedia.reduce((acc, m) => acc + m.size, 0)
  const storagePercentage = (usedStorage / totalStorage) * 100

  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Folders */}
          <div className="w-[240px] border-r border-border flex flex-col bg-muted/20">
            <div className="p-3 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 justify-start"
                onClick={() => setShowNewFolderDialog(true)}
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockFolders.map((folder) => (
                  <div key={folder.id}>
                    <button
                      onClick={() => {
                        setSelectedFolder(folder.id)
                        if (folder.children) toggleFolder(folder.id)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedFolder === folder.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      {folder.children ? (
                        expandedFolders.includes(folder.id) ? (
                          <ChevronDown className="w-4 h-4 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        )
                      ) : (
                        <span className="w-4" />
                      )}
                      <Folder
                        className="w-4 h-4 shrink-0"
                        style={{ color: folder.color }}
                      />
                      <span className="flex-1 text-left truncate">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">{folder.itemCount}</span>
                    </button>
                    {folder.children && expandedFolders.includes(folder.id) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {folder.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setSelectedFolder(child.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                              selectedFolder === child.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted text-foreground"
                            )}
                          >
                            <Folder className="w-4 h-4 shrink-0" style={{ color: child.color }} />
                            <span className="flex-1 text-left truncate">{child.name}</span>
                            <span className="text-xs text-muted-foreground">{child.itemCount}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Storage Info */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Storage</span>
                <span className="text-xs text-muted-foreground">
                  {storagePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={storagePercentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-2">
                {formatFileSize(usedStorage)} of {formatFileSize(totalStorage)} used
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-border px-6">
                <TabsList className="h-12 bg-transparent p-0 gap-6">
                  <TabsTrigger
                    value="media"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Media Files
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {mockMedia.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="captions"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Saved Captions
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {mockCaptions.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="templates"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger
                    value="hashtags"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 pt-3"
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    Hashtag Sets
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Media Tab */}
              <TabsContent value="media" className="flex-1 flex flex-col m-0 overflow-hidden">
                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-background">
                  <div className="flex items-center gap-3">
                    <div className="relative w-[280px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search files, tags..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="template">Templates</SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setSortBy("modified")}>
                          Date Modified {sortBy === "modified" && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("created")}>
                          Date Created {sortBy === "created" && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("name")}>
                          Name {sortBy === "name" && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("size")}>
                          Size {sortBy === "size" && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("usage")}>
                          Usage {sortBy === "usage" && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                          {sortOrder === "asc" ? "Descending" : "Ascending"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedItems.length > 0 && (
                      <div className="flex items-center gap-2 mr-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedItems.length} selected
                        </span>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Move className="w-4 h-4" />
                          Move
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-r-none"
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => setViewMode("list")}
                      >
                        <LayoutList className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* File Grid/List */}
                <div
                  className={cn(
                    "flex-1 overflow-hidden relative",
                    isDragging && "ring-2 ring-primary ring-inset bg-primary/5"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5 z-10">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-lg font-medium">Drop files to upload</p>
                        <p className="text-sm text-muted-foreground">
                          Images, videos, documents supported
                        </p>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute top-0 left-0 right-0 p-4 bg-background border-b z-10">
                      <div className="flex items-center gap-4">
                        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Uploading files...</p>
                          <Progress value={uploadProgress} className="h-1.5" />
                        </div>
                        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                      </div>
                    </div>
                  )}

                  <ScrollArea className="h-full">
                    {viewMode === "grid" ? (
                      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredMedia.map((item) => {
                          const FileIcon = getFileIcon(item.type)
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg",
                                selectedItems.includes(item.id) && "ring-2 ring-primary"
                              )}
                              onClick={() => handlePreview(item)}
                            >
                              {/* Checkbox */}
                              <div
                                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSelectItem(item.id)
                                }}
                              >
                                <Checkbox checked={selectedItems.includes(item.id)} />
                              </div>

                              {/* Star */}
                              {item.starred && (
                                <div className="absolute top-2 right-2 z-10">
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                </div>
                              )}

                              {/* Thumbnail */}
                              <div className="aspect-square bg-muted flex items-center justify-center relative">
                                <FileIcon className="w-12 h-12 text-muted-foreground" />
                                <Badge
                                  className={cn(
                                    "absolute bottom-2 right-2 text-[10px] text-white",
                                    getTypeColor(item.type)
                                  )}
                                >
                                  {item.type}
                                </Badge>
                                {item.duration && (
                                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
                                    {formatDuration(item.duration)}
                                  </span>
                                )}
                              </div>

                              {/* Info */}
                              <div className="p-3">
                                <p className="font-medium text-sm truncate mb-1">{item.name}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{formatFileSize(item.size)}</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {item.usageCount}
                                  </span>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-center gap-1">
                                  <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                  <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                                    <Share2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {/* Select All Header */}
                        <div className="px-6 py-2 bg-muted/50 flex items-center gap-4 text-sm font-medium text-muted-foreground">
                          <Checkbox
                            checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                          <span className="flex-1">Name</span>
                          <span className="w-24">Size</span>
                          <span className="w-32">Modified</span>
                          <span className="w-20 text-center">Usage</span>
                          <span className="w-20"></span>
                        </div>
                        {filteredMedia.map((item) => {
                          const FileIcon = getFileIcon(item.type)
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "px-6 py-3 flex items-center gap-4 hover:bg-muted/50 cursor-pointer",
                                selectedItems.includes(item.id) && "bg-primary/5"
                              )}
                              onClick={() => handlePreview(item)}
                            >
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getTypeColor(item.type) + "/10")}>
                                  <FileIcon className={cn("w-5 h-5", getTypeColor(item.type).replace("bg-", "text-"))} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">{item.name}</p>
                                    {item.starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="w-24 text-sm text-muted-foreground">{formatFileSize(item.size)}</span>
                              <span className="w-32 text-sm text-muted-foreground">
                                {formatDistanceToNow(item.modifiedAt, { addSuffix: true })}
                              </span>
                              <span className="w-20 text-sm text-center text-muted-foreground">{item.usageCount}</span>
                              <div className="w-20 flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Move className="w-4 h-4 mr-2" />
                                      Move to...
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Edit3 className="w-4 h-4 mr-2" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Tag className="w-4 h-4 mr-2" />
                                      Manage Tags
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Captions Tab */}
              <TabsContent value="captions" className="flex-1 m-0 overflow-hidden">
                <div className="p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative w-[300px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search captions..." className="pl-9" />
                    </div>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Caption
                    </Button>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockCaptions.map((caption) => (
                        <div
                          key={caption.id}
                          className="p-4 rounded-xl border hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{caption.title}</h3>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {caption.category}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-4 mb-3 whitespace-pre-wrap">
                            {caption.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {caption.hashtags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px]">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Used {caption.usageCount}x
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="flex-1 m-0 p-6">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Design Templates</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Create and manage reusable design templates for your social media posts.
                    </p>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Hashtags Tab */}
              <TabsContent value="hashtags" className="flex-1 m-0 p-6">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Hashtag Sets</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Save and organize hashtag collections for quick access when creating posts.
                    </p>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Hashtag Set
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload images, videos, documents, or other media files to your library.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF, MP4, PDF up to 100MB
              </p>
              <input id="file-upload" type="file" multiple className="hidden" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px]">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const FileIcon = getFileIcon(previewItem.type)
                    return <FileIcon className="w-5 h-5" />
                  })()}
                  {previewItem.name}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  {(() => {
                    const FileIcon = getFileIcon(previewItem.type)
                    return <FileIcon className="w-16 h-16 text-muted-foreground" />
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Type</p>
                    <p className="font-medium capitalize">{previewItem.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Size</p>
                    <p className="font-medium">{formatFileSize(previewItem.size)}</p>
                  </div>
                  {previewItem.dimensions && (
                    <div>
                      <p className="text-muted-foreground mb-1">Dimensions</p>
                      <p className="font-medium">{previewItem.dimensions.width} × {previewItem.dimensions.height}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">{format(previewItem.createdAt, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Modified</p>
                    <p className="font-medium">{format(previewItem.modifiedAt, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Usage</p>
                    <p className="font-medium">{previewItem.usageCount} times</p>
                  </div>
                </div>
                {previewItem.description && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-1 text-sm">Description</p>
                    <p className="text-sm">{previewItem.description}</p>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-muted-foreground mb-2 text-sm">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {previewItem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button className="gap-2">
                  <Zap className="w-4 h-4" />
                  Use in Post
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <FolderPlus className="w-4 h-4" />
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
