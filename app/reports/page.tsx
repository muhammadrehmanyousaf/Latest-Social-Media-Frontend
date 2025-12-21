"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import {
  FileText,
  Plus,
  Download,
  Share2,
  Calendar,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Send,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Filter,
  Search,
  Settings,
  Sparkles,
  ChevronRight,
  Star,
  Mail,
  FileDown,
  Presentation,
  Grid,
  List,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  ArrowUpRight,
  Layers,
  Table,
  GripVertical,
  X,
  Check,
  AlertCircle,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import NextLink from "next/link"
import { format, formatDistanceToNow } from "date-fns"

type ReportStatus = "draft" | "published" | "scheduled"
type ReportFrequency = "once" | "daily" | "weekly" | "monthly"
type WidgetType = "metric" | "chart" | "table" | "comparison" | "heatmap"
type ChartType = "line" | "bar" | "pie" | "donut" | "area"

interface ReportWidget {
  id: string
  type: WidgetType
  title: string
  metric?: string
  chartType?: ChartType
  platforms: string[]
  dateRange: string
  size: "small" | "medium" | "large" | "full"
}

interface Report {
  id: string
  name: string
  description?: string
  status: ReportStatus
  widgets: ReportWidget[]
  platforms: string[]
  dateRange: {
    start: Date
    end: Date
    preset?: string
  }
  schedule?: {
    frequency: ReportFrequency
    nextRun?: Date
    recipients: string[]
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isFavorite: boolean
  viewCount: number
  lastViewed?: Date
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  widgets: number
  thumbnail: string
  isPremium: boolean
}

// Mock Data
const mockReports: Report[] = [
  {
    id: "r1",
    name: "Monthly Performance Report",
    description: "Comprehensive overview of social media performance across all platforms",
    status: "published",
    widgets: [
      { id: "w1", type: "metric", title: "Total Followers", metric: "followers", platforms: ["all"], dateRange: "30d", size: "small" },
      { id: "w2", type: "metric", title: "Engagement Rate", metric: "engagement", platforms: ["all"], dateRange: "30d", size: "small" },
      { id: "w3", type: "chart", title: "Follower Growth", chartType: "line", platforms: ["instagram", "twitter"], dateRange: "30d", size: "large" },
      { id: "w4", type: "chart", title: "Platform Distribution", chartType: "pie", platforms: ["all"], dateRange: "30d", size: "medium" },
    ],
    platforms: ["instagram", "twitter", "linkedin", "facebook"],
    dateRange: { start: new Date(2024, 9, 1), end: new Date(2024, 9, 31), preset: "last_month" },
    schedule: { frequency: "monthly", nextRun: new Date(2024, 11, 1), recipients: ["alex@socialflow.io", "sarah@socialflow.io"] },
    createdAt: new Date(2024, 8, 15),
    updatedAt: new Date(2024, 10, 15),
    createdBy: "Alex Johnson",
    isFavorite: true,
    viewCount: 45,
    lastViewed: new Date(Date.now() - 3600000),
  },
  {
    id: "r2",
    name: "Weekly Engagement Analysis",
    description: "Weekly breakdown of engagement metrics and top performing content",
    status: "scheduled",
    widgets: [
      { id: "w5", type: "metric", title: "Total Engagement", metric: "engagement", platforms: ["all"], dateRange: "7d", size: "small" },
      { id: "w6", type: "chart", title: "Engagement by Day", chartType: "bar", platforms: ["all"], dateRange: "7d", size: "large" },
      { id: "w7", type: "table", title: "Top Posts", platforms: ["all"], dateRange: "7d", size: "full" },
    ],
    platforms: ["instagram", "twitter"],
    dateRange: { start: new Date(Date.now() - 604800000), end: new Date(), preset: "last_7_days" },
    schedule: { frequency: "weekly", nextRun: new Date(Date.now() + 259200000), recipients: ["alex@socialflow.io"] },
    createdAt: new Date(2024, 9, 1),
    updatedAt: new Date(2024, 10, 12),
    createdBy: "Alex Johnson",
    isFavorite: true,
    viewCount: 23,
    lastViewed: new Date(Date.now() - 86400000),
  },
  {
    id: "r3",
    name: "Competitor Comparison Q4",
    description: "Quarterly comparison against main competitors",
    status: "draft",
    widgets: [
      { id: "w8", type: "comparison", title: "Follower Comparison", platforms: ["all"], dateRange: "90d", size: "large" },
      { id: "w9", type: "comparison", title: "Engagement Comparison", platforms: ["all"], dateRange: "90d", size: "large" },
    ],
    platforms: ["instagram", "twitter", "linkedin"],
    dateRange: { start: new Date(2024, 9, 1), end: new Date(2024, 11, 31), preset: "this_quarter" },
    createdAt: new Date(2024, 10, 10),
    updatedAt: new Date(2024, 10, 10),
    createdBy: "Sarah Chen",
    isFavorite: false,
    viewCount: 5,
  },
  {
    id: "r4",
    name: "Instagram Deep Dive",
    description: "Detailed analysis of Instagram performance and audience insights",
    status: "published",
    widgets: [
      { id: "w10", type: "metric", title: "Followers", metric: "followers", platforms: ["instagram"], dateRange: "30d", size: "small" },
      { id: "w11", type: "metric", title: "Reach", metric: "reach", platforms: ["instagram"], dateRange: "30d", size: "small" },
      { id: "w12", type: "chart", title: "Story Performance", chartType: "area", platforms: ["instagram"], dateRange: "30d", size: "large" },
      { id: "w13", type: "heatmap", title: "Best Posting Times", platforms: ["instagram"], dateRange: "30d", size: "medium" },
    ],
    platforms: ["instagram"],
    dateRange: { start: new Date(Date.now() - 2592000000), end: new Date(), preset: "last_30_days" },
    createdAt: new Date(2024, 9, 20),
    updatedAt: new Date(2024, 10, 18),
    createdBy: "Alex Johnson",
    isFavorite: false,
    viewCount: 32,
    lastViewed: new Date(Date.now() - 172800000),
  },
]

const mockTemplates: ReportTemplate[] = [
  { id: "t1", name: "Executive Summary", description: "High-level overview for stakeholders", category: "Overview", widgets: 6, thumbnail: "/templates/exec.png", isPremium: false },
  { id: "t2", name: "Engagement Deep Dive", description: "Detailed engagement analysis", category: "Engagement", widgets: 8, thumbnail: "/templates/engagement.png", isPremium: false },
  { id: "t3", name: "Competitor Analysis", description: "Side-by-side competitor comparison", category: "Competitive", widgets: 5, thumbnail: "/templates/competitor.png", isPremium: true },
  { id: "t4", name: "Content Performance", description: "Analyze your best performing content", category: "Content", widgets: 7, thumbnail: "/templates/content.png", isPremium: false },
  { id: "t5", name: "Audience Insights", description: "Demographics and audience behavior", category: "Audience", widgets: 6, thumbnail: "/templates/audience.png", isPremium: true },
  { id: "t6", name: "ROI Report", description: "Track social media ROI", category: "Business", widgets: 8, thumbnail: "/templates/roi.png", isPremium: true },
]

const availableWidgets = [
  { type: "metric", icon: TrendingUp, label: "Metric Card", description: "Single KPI display" },
  { type: "chart", icon: LineChartIcon, label: "Line Chart", description: "Trend over time" },
  { type: "chart", icon: BarChart3, label: "Bar Chart", description: "Compare values" },
  { type: "chart", icon: PieChart, label: "Pie Chart", description: "Distribution view" },
  { type: "table", icon: Table, label: "Data Table", description: "Detailed data view" },
  { type: "comparison", icon: Users, label: "Comparison", description: "Compare metrics" },
  { type: "heatmap", icon: Grid, label: "Heatmap", description: "Time-based patterns" },
]

const statusColors: Record<ReportStatus, string> = {
  draft: "bg-yellow-500/10 text-yellow-600",
  published: "bg-green-500/10 text-green-500",
  scheduled: "bg-blue-500/10 text-blue-500",
}

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
}

export default function ReportsPage() {
  usePageHeader({
    title: "Reports",
    subtitle: "Create custom reports",
    icon: FileText,
  })

  const [reports, setReports] = useState<Report[]>(mockReports)
  const [templates] = useState<ReportTemplate[]>(mockTemplates)
  const [activeTab, setActiveTab] = useState("reports")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: reports.length,
    published: reports.filter((r) => r.status === "published").length,
    scheduled: reports.filter((r) => r.status === "scheduled").length,
    drafts: reports.filter((r) => r.status === "draft").length,
  }

  const toggleFavorite = (id: string) => {
    setReports(reports.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ))
  }

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id))
  }

  const duplicateReport = (report: Report) => {
    const newReport: Report = {
      ...report,
      id: `r_${Date.now()}`,
      name: `${report.name} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      isFavorite: false,
    }
    setReports([newReport, ...reports])
  }

  return (
    <>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-green-500">{stats.published}</p>
                  </div>
                  <Check className="h-8 w-8 text-green-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-500">{stats.scheduled}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
                  </div>
                  <Edit className="h-8 w-8 text-yellow-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="reports">My Reports</TabsTrigger>
                <TabsTrigger value="favorites">
                  Favorites
                  <Badge variant="secondary" className="ml-2">
                    {reports.filter((r) => r.isFavorite).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-[200px]"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | "all")}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Create New Card */}
                  <Card
                    className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors min-h-[200px]"
                    onClick={() => setIsCreating(true)}
                  >
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">Create New Report</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start from scratch or use a template
                      </p>
                    </CardContent>
                  </Card>

                  {/* Report Cards */}
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        {/* Preview Header */}
                        <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 p-4 relative">
                          <div className="flex gap-1">
                            {report.widgets.slice(0, 3).map((widget, i) => (
                              <div
                                key={widget.id}
                                className="w-8 h-6 bg-white/50 rounded"
                              />
                            ))}
                            {report.widgets.length > 3 && (
                              <div className="w-8 h-6 bg-white/30 rounded flex items-center justify-center text-xs">
                                +{report.widgets.length - 3}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                              report.isFavorite ? "text-yellow-500" : "text-white/70"
                            }`}
                            onClick={() => toggleFavorite(report.id)}
                          >
                            <Star className={`h-4 w-4 ${report.isFavorite ? "fill-current" : ""}`} />
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold line-clamp-1">{report.name}</h3>
                            <Badge className={statusColors[report.status]}>
                              {report.status}
                            </Badge>
                          </div>
                          {report.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {report.description}
                            </p>
                          )}

                          {/* Platforms */}
                          <div className="flex items-center gap-1 mb-3">
                            {report.platforms.slice(0, 4).map((platform) => (
                              <span key={platform} className="text-muted-foreground">
                                {platformIcons[platform]}
                              </span>
                            ))}
                            {report.platforms.length > 4 && (
                              <span className="text-xs text-muted-foreground">
                                +{report.platforms.length - 4}
                              </span>
                            )}
                          </div>

                          {/* Meta */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.viewCount} views
                            </span>
                            <span>
                              Updated {formatDistanceToNow(report.updatedAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t p-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Report
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateReport(report)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email Report
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Schedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Presentation className="h-4 w-4 mr-2" />
                                  Export as PPT
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => deleteReport(report.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                      {filteredReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-4 hover:bg-muted/50 transition-colors flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{report.name}</h3>
                              {report.isFavorite && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {report.widgets.length} widgets · {report.platforms.length} platforms
                            </p>
                          </div>
                          <Badge className={statusColors[report.status]}>
                            {report.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground text-right">
                            <p>{formatDistanceToNow(report.updatedAt, { addSuffix: true })}</p>
                            <p className="text-xs">{report.viewCount} views</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.filter((r) => r.isFavorite).map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.widgets.length} widgets
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500"
                        onClick={() => toggleFavorite(report.id)}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Report Templates</h2>
                  <p className="text-sm text-muted-foreground">
                    Start with a pre-built template
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center relative">
                      <Layers className="h-12 w-12 text-muted-foreground/30" />
                      {template.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {template.widgets} widgets
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Scheduled Tab */}
            <TabsContent value="scheduled" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Scheduled Reports</h2>
                  <p className="text-sm text-muted-foreground">
                    Automated report delivery
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {reports
                  .filter((r) => r.schedule)
                  .map((report) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Clock className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">{report.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Runs {report.schedule?.frequency} · Next:{" "}
                                {report.schedule?.nextRun
                                  ? format(report.schedule.nextRun, "MMM d, yyyy")
                                  : "Not scheduled"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm">
                                {report.schedule?.recipients.length} recipient(s)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {report.schedule?.recipients[0]}
                                {(report.schedule?.recipients.length ?? 0) > 1 &&
                                  ` +${(report.schedule?.recipients.length ?? 0) - 1} more`}
                              </p>
                            </div>
                            <Switch defaultChecked />
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Create Report Modal/Section */}
          {isCreating && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Report</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Report Name</Label>
                      <Input placeholder="e.g., Monthly Performance Report" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Input placeholder="Brief description of this report" />
                    </div>
                    <div className="space-y-2">
                      <Label>Platforms</Label>
                      <div className="flex flex-wrap gap-2">
                        {["instagram", "twitter", "linkedin", "facebook", "youtube"].map((platform) => (
                          <Button key={platform} variant="outline" size="sm" className="capitalize">
                            {platformIcons[platform]}
                            <span className="ml-2">{platform}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select defaultValue="last_30_days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_7_days">Last 7 days</SelectItem>
                          <SelectItem value="last_30_days">Last 30 days</SelectItem>
                          <SelectItem value="last_90_days">Last 90 days</SelectItem>
                          <SelectItem value="this_month">This month</SelectItem>
                          <SelectItem value="last_month">Last month</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start from Template (optional)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="h-auto p-3 flex-col">
                          <Layers className="h-6 w-6 mb-1" />
                          <span className="text-xs">Blank</span>
                        </Button>
                        {templates.slice(0, 2).map((t) => (
                          <Button key={t.id} variant="outline" className="h-auto p-3 flex-col">
                            <FileText className="h-6 w-6 mb-1" />
                            <span className="text-xs">{t.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="border-t p-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreating(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* AI Report Generator CTA */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI Report Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI analyze your data and generate insights automatically.
                    Get personalized recommendations and trend analysis.
                  </p>
                </div>
                <div className="flex gap-2">
                  <NextLink href="/ai-assistant">
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </Button>
                  </NextLink>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  )
}
