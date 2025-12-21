"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  LayoutTemplate,
  Plus,
  Search,
  MoreVertical,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  Clock,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Send,
  Mail,
  Settings,
  Palette,
  Layout,
  Table,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Filter,
  Star,
  Users,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Zap,
  Target,
  DollarSign,
  Globe,
  Image,
  Type,
  Hash,
  Sparkles,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Link2,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  Printer,
  FolderOpen,
  FileText,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "overview" | "engagement" | "growth" | "content" | "competitor" | "custom";
  widgets: Widget[];
  isDefault: boolean;
  lastEdited: Date;
  createdBy: string;
}

interface Widget {
  id: string;
  type: "metric" | "chart" | "table" | "text" | "image";
  title: string;
  dataSource: string;
  chartType?: "line" | "bar" | "pie" | "donut" | "area";
  size: "small" | "medium" | "large" | "full";
  position: { x: number; y: number };
}

interface SavedReport {
  id: string;
  name: string;
  template: string;
  dateRange: { start: Date; end: Date };
  platforms: string[];
  schedule?: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    recipients: string[];
    lastSent?: Date;
    nextSend?: Date;
  };
  status: "draft" | "generated" | "scheduled";
  createdAt: Date;
  lastGenerated?: Date;
  format: "pdf" | "pptx" | "xlsx";
}

interface MetricCard {
  id: string;
  name: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const mockTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Executive Summary",
    description: "High-level overview of social media performance for leadership",
    thumbnail: "/api/placeholder/300/200",
    category: "overview",
    widgets: [],
    isDefault: true,
    lastEdited: new Date(),
    createdBy: "System",
  },
  {
    id: "2",
    name: "Engagement Report",
    description: "Deep dive into engagement metrics across all platforms",
    thumbnail: "/api/placeholder/300/200",
    category: "engagement",
    widgets: [],
    isDefault: true,
    lastEdited: new Date(),
    createdBy: "System",
  },
  {
    id: "3",
    name: "Growth Analytics",
    description: "Track follower growth, reach, and audience expansion",
    thumbnail: "/api/placeholder/300/200",
    category: "growth",
    widgets: [],
    isDefault: true,
    lastEdited: new Date(),
    createdBy: "System",
  },
  {
    id: "4",
    name: "Content Performance",
    description: "Analyze which content types and topics perform best",
    thumbnail: "/api/placeholder/300/200",
    category: "content",
    widgets: [],
    isDefault: true,
    lastEdited: new Date(),
    createdBy: "System",
  },
  {
    id: "5",
    name: "Competitor Analysis",
    description: "Compare your performance against competitors",
    thumbnail: "/api/placeholder/300/200",
    category: "competitor",
    widgets: [],
    isDefault: true,
    lastEdited: new Date(),
    createdBy: "System",
  },
  {
    id: "6",
    name: "Weekly Client Report",
    description: "Custom weekly report for agency clients",
    thumbnail: "/api/placeholder/300/200",
    category: "custom",
    widgets: [],
    isDefault: false,
    lastEdited: new Date(Date.now() - 86400000 * 2),
    createdBy: "Sarah J.",
  },
];

const mockReports: SavedReport[] = [
  {
    id: "1",
    name: "Q4 2024 Performance Report",
    template: "Executive Summary",
    dateRange: { start: new Date("2024-10-01"), end: new Date("2024-12-31") },
    platforms: ["twitter", "linkedin", "facebook", "instagram"],
    schedule: {
      enabled: true,
      frequency: "weekly",
      recipients: ["ceo@company.com", "marketing@company.com"],
      lastSent: new Date(Date.now() - 86400000 * 7),
      nextSend: new Date(Date.now() + 86400000),
    },
    status: "scheduled",
    createdAt: new Date("2024-10-01"),
    lastGenerated: new Date(Date.now() - 86400000),
    format: "pdf",
  },
  {
    id: "2",
    name: "November Engagement Analysis",
    template: "Engagement Report",
    dateRange: { start: new Date("2024-11-01"), end: new Date("2024-11-30") },
    platforms: ["twitter", "linkedin"],
    status: "generated",
    createdAt: new Date("2024-11-01"),
    lastGenerated: new Date("2024-12-01"),
    format: "pdf",
  },
  {
    id: "3",
    name: "Competitor Benchmark Q4",
    template: "Competitor Analysis",
    dateRange: { start: new Date("2024-10-01"), end: new Date("2024-12-31") },
    platforms: ["twitter", "linkedin", "facebook"],
    status: "generated",
    createdAt: new Date("2024-10-15"),
    lastGenerated: new Date("2024-12-15"),
    format: "pptx",
  },
  {
    id: "4",
    name: "Weekly Client Update - Acme Corp",
    template: "Weekly Client Report",
    dateRange: { start: new Date(Date.now() - 86400000 * 7), end: new Date() },
    platforms: ["twitter", "instagram"],
    schedule: {
      enabled: true,
      frequency: "weekly",
      recipients: ["client@acme.com"],
      lastSent: new Date(Date.now() - 86400000 * 7),
      nextSend: new Date(Date.now() + 86400000 * 7),
    },
    status: "scheduled",
    createdAt: new Date("2024-09-01"),
    lastGenerated: new Date(Date.now() - 86400000 * 7),
    format: "pdf",
  },
];

const availableWidgets = [
  { id: "followers", name: "Follower Count", type: "metric", icon: Users },
  { id: "engagement_rate", name: "Engagement Rate", type: "metric", icon: ThumbsUp },
  { id: "reach", name: "Total Reach", type: "metric", icon: Eye },
  { id: "impressions", name: "Impressions", type: "metric", icon: TrendingUp },
  { id: "clicks", name: "Link Clicks", type: "metric", icon: Link2 },
  { id: "shares", name: "Shares", type: "metric", icon: Share2 },
  { id: "comments", name: "Comments", type: "metric", icon: MessageCircle },
  { id: "growth_chart", name: "Growth Over Time", type: "chart", icon: LineChart },
  { id: "engagement_chart", name: "Engagement Trends", type: "chart", icon: BarChart3 },
  { id: "platform_breakdown", name: "Platform Breakdown", type: "chart", icon: PieChart },
  { id: "top_posts", name: "Top Performing Posts", type: "table", icon: Table },
  { id: "audience_demo", name: "Audience Demographics", type: "chart", icon: PieChart },
  { id: "best_times", name: "Best Posting Times", type: "chart", icon: Clock },
  { id: "hashtag_perf", name: "Hashtag Performance", type: "table", icon: Hash },
  { id: "content_types", name: "Content Type Analysis", type: "chart", icon: PieChart },
  { id: "roi_metrics", name: "ROI Metrics", type: "metric", icon: DollarSign },
];

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <FaTwitter className="h-4 w-4 text-sky-500" />,
  linkedin: <FaLinkedin className="h-4 w-4 text-blue-600" />,
  facebook: <FaFacebook className="h-4 w-4 text-blue-500" />,
  instagram: <FaInstagram className="h-4 w-4 text-pink-500" />,
};

const categoryColors: Record<string, string> = {
  overview: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  engagement: "bg-green-500/10 text-green-500 border-green-500/20",
  growth: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  content: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  competitor: "bg-red-500/10 text-red-500 border-red-500/20",
  custom: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  generated: "bg-green-500/10 text-green-500 border-green-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function ReportBuilderPage() {
  usePageHeader({
    title: "Report Builder",
    subtitle: "Build custom reports",
    icon: LayoutTemplate,
  });

  const [activeTab, setActiveTab] = useState<"templates" | "reports" | "builder" | "scheduled">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [builderWidgets, setBuilderWidgets] = useState<Widget[]>([]);

  const scheduledReports = mockReports.filter(r => r.schedule?.enabled).length;
  const totalReports = mockReports.length;

  return (
    <>
        {/* Stats */}
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {mockTemplates.filter(t => !t.isDefault).length} custom
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{mockTemplates.length}</div>
                <div className="text-xs text-muted-foreground">Templates</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{totalReports}</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Calendar className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{scheduledReports}</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Mail className="h-5 w-5 text-orange-500" />
                <Badge variant="outline" className="text-xs">
                  This month
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">Reports Sent</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {[
              { id: "templates", label: "Templates", icon: Layout },
              { id: "reports", label: "My Reports", icon: FileText },
              { id: "builder", label: "Builder", icon: Sparkles },
              { id: "scheduled", label: "Scheduled", icon: Clock },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Templates Tab */}
            {activeTab === "templates" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Category
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterCategory("overview")}>Overview</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("engagement")}>Engagement</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("growth")}>Growth</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("content")}>Content</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("competitor")}>Competitor</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("custom")}>Custom</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTemplates
                    .filter(t => filterCategory === "all" || t.category === filterCategory)
                    .map((template) => (
                    <div
                      key={template.id}
                      className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                        <FileText className="h-16 w-16 text-primary/30" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={categoryColors[template.category]}>
                            {template.category}
                          </Badge>
                          {template.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                          <span>by {template.createdBy}</span>
                          <span>Updated {format(template.lastEdited, "MMM d")}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Create Custom Template */}
                  <div
                    className="bg-card border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 cursor-pointer transition-colors min-h-[280px]"
                    onClick={() => setActiveTab("builder")}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Create Custom Template</h3>
                    <p className="text-sm text-muted-foreground">
                      Build your own report template with our drag-and-drop builder
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">Report</div>
                    <div>Date Range</div>
                    <div>Platforms</div>
                    <div>Status</div>
                    <div>Format</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {mockReports.map((report) => (
                    <div
                      key={report.id}
                      className="grid grid-cols-7 gap-4 p-4 border-t items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="col-span-2">
                        <div className="font-medium">{report.name}</div>
                        <div className="text-xs text-muted-foreground">{report.template}</div>
                      </div>
                      <div className="text-sm">
                        {format(report.dateRange.start, "MMM d")} - {format(report.dateRange.end, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        {report.platforms.map((p) => (
                          <span key={p}>{platformIcons[p]}</span>
                        ))}
                      </div>
                      <div>
                        <Badge variant="outline" className={statusColors[report.status]}>
                          {report.status}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline" className="uppercase text-xs">
                          {report.format}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Regenerate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowScheduleDialog(true)}>
                              <Clock className="h-4 w-4 mr-2" />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Builder Tab */}
            {activeTab === "builder" && (
              <div className="grid grid-cols-4 gap-6 h-[calc(100vh-280px)]">
                {/* Widget Library */}
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Widgets
                  </h3>
                  <ScrollArea className="h-[calc(100%-40px)]">
                    <div className="space-y-2 pr-2">
                      {availableWidgets.map((widget) => (
                        <div
                          key={widget.id}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-grab hover:bg-muted transition-colors"
                          draggable
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <widget.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{widget.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {widget.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Canvas */}
                <div className="col-span-2 bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Report Canvas</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm">
                        Save Template
                      </Button>
                    </div>
                  </div>
                  <div className="border-2 border-dashed rounded-lg h-[calc(100%-60px)] p-4 bg-muted/20">
                    {builderWidgets.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <Layout className="h-12 w-12 text-muted-foreground mb-4" />
                        <h4 className="font-medium mb-2">Start Building Your Report</h4>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Drag widgets from the left panel and drop them here to build your custom report
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {builderWidgets.map((widget) => (
                          <div
                            key={widget.id}
                            className="bg-background border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{widget.title}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="h-24 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">{widget.type} widget</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Properties Panel */}
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Properties
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Report Title</label>
                      <Input placeholder="My Custom Report" className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Report description..." className="mt-2" rows={3} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Theme</label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {["#6366f1", "#10b981", "#f59e0b", "#ec4899"].map((color) => (
                          <div
                            key={color}
                            className="w-full aspect-square rounded-lg cursor-pointer ring-2 ring-transparent hover:ring-primary/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Page Size</label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="secondary" size="sm">A4</Button>
                        <Button variant="outline" size="sm">Letter</Button>
                        <Button variant="outline" size="sm">16:9</Button>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">Include Branding</div>
                          <div className="text-xs text-muted-foreground">Add your logo and colors</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduled Tab */}
            {activeTab === "scheduled" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Scheduled Reports
                  </h2>
                  <Button onClick={() => setShowScheduleDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockReports.filter(r => r.schedule?.enabled).map((report) => (
                    <div key={report.id} className="bg-card border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">{report.template}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <Play className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Frequency</span>
                          <Badge variant="outline" className="capitalize">
                            {report.schedule?.frequency}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Recipients</span>
                          <span>{report.schedule?.recipients.length} recipient(s)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next Send</span>
                          <span>{report.schedule?.nextSend ? format(report.schedule.nextSend, "MMM d, yyyy") : "-"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Sent</span>
                          <span>{report.schedule?.lastSent ? format(report.schedule.lastSent, "MMM d, yyyy") : "-"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {report.platforms.map((p) => (
                          <span key={p}>{platformIcons[p]}</span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" className="flex-1" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

      {/* Create Report Dialog */}
      <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Report Name</label>
              <Input placeholder="e.g., Monthly Performance Report" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Template</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {mockTemplates.slice(0, 6).map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="text-sm font-medium">{template.name}</div>
                    <Badge variant="outline" className={cn("mt-1 text-xs", categoryColors[template.category])}>
                      {template.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" className="mt-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Platforms</label>
              <div className="flex gap-2 mt-2">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <Button key={platform} variant="outline" size="sm" className="gap-2">
                    {icon}
                    <span className="capitalize">{platform}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Export Format</label>
              <div className="flex gap-2 mt-2">
                <Button variant="secondary" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PPTX
                </Button>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  XLSX
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" onClick={() => setShowCreateReport(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Daily</Button>
                <Button variant="secondary" size="sm">Weekly</Button>
                <Button variant="outline" size="sm">Monthly</Button>
                <Button variant="outline" size="sm">Quarterly</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Send On</label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Mon</Button>
                <Button variant="secondary" size="sm">Tue</Button>
                <Button variant="outline" size="sm">Wed</Button>
                <Button variant="outline" size="sm">Thu</Button>
                <Button variant="outline" size="sm">Fri</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input type="time" defaultValue="09:00" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Recipients</label>
              <Textarea
                placeholder="Enter email addresses, one per line..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Include Personal Message</div>
                <div className="text-sm text-muted-foreground">Add a note with each report</div>
              </div>
              <Switch />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedTemplate.description}</p>

                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Template Preview</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {
                    setSelectedTemplate(null);
                    setShowCreateReport(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                  {!selectedTemplate.isDefault && (
                    <Button variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Template
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
