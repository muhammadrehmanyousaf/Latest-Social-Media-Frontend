"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
  Layout,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Check,
  Code,
  Palette,
  Settings,
  ExternalLink,
  Smartphone,
  Monitor,
  Globe,
  MessageSquare,
  Star,
  Users,
  ThumbsUp,
  Heart,
  Share2,
  TrendingUp,
  Activity,
  Zap,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  BarChart3,
  Image,
  Type,
  Layers,
  Grid3X3,
  List,
  Clock,
  Twitter,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

interface SocialWidget {
  id: string;
  name: string;
  type: "feed" | "followers" | "testimonials" | "share_buttons" | "follow_buttons" | "reviews" | "hashtag_feed";
  status: "active" | "paused" | "draft";
  style: {
    theme: "light" | "dark" | "auto";
    primaryColor: string;
    borderRadius: number;
    showBranding: boolean;
  };
  platforms: string[];
  settings: Record<string, unknown>;
  stats: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
  embedCode: string;
  createdAt: Date;
  lastUpdated: Date;
}

const mockWidgets: SocialWidget[] = [
  {
    id: "1",
    name: "Homepage Social Feed",
    type: "feed",
    status: "active",
    style: {
      theme: "light",
      primaryColor: "#6366f1",
      borderRadius: 12,
      showBranding: false,
    },
    platforms: ["twitter", "instagram"],
    settings: { postsCount: 6, showImages: true, autoRefresh: true },
    stats: { impressions: 45200, clicks: 2340, conversions: 156 },
    embedCode: '<script src="https://widgets.socialflow.com/embed.js" data-widget-id="wgt_abc123"></script>',
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date(),
  },
  {
    id: "2",
    name: "Footer Follow Buttons",
    type: "follow_buttons",
    status: "active",
    style: {
      theme: "dark",
      primaryColor: "#10b981",
      borderRadius: 8,
      showBranding: false,
    },
    platforms: ["twitter", "linkedin", "facebook", "instagram", "youtube"],
    settings: { size: "medium", showCount: true, layout: "horizontal" },
    stats: { impressions: 128000, clicks: 8420, conversions: 2100 },
    embedCode: '<script src="https://widgets.socialflow.com/embed.js" data-widget-id="wgt_def456"></script>',
    createdAt: new Date("2024-01-20"),
    lastUpdated: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    name: "Customer Testimonials",
    type: "testimonials",
    status: "active",
    style: {
      theme: "light",
      primaryColor: "#f59e0b",
      borderRadius: 16,
      showBranding: true,
    },
    platforms: ["twitter"],
    settings: { displayMode: "carousel", autoplay: true, interval: 5000 },
    stats: { impressions: 32100, clicks: 1890, conversions: 340 },
    embedCode: '<script src="https://widgets.socialflow.com/embed.js" data-widget-id="wgt_ghi789"></script>',
    createdAt: new Date("2024-02-01"),
    lastUpdated: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    name: "Blog Share Buttons",
    type: "share_buttons",
    status: "active",
    style: {
      theme: "auto",
      primaryColor: "#ec4899",
      borderRadius: 4,
      showBranding: false,
    },
    platforms: ["twitter", "linkedin", "facebook"],
    settings: { position: "floating", showCount: true, includeEmail: true },
    stats: { impressions: 89400, clicks: 4560, conversions: 890 },
    embedCode: '<script src="https://widgets.socialflow.com/embed.js" data-widget-id="wgt_jkl012"></script>',
    createdAt: new Date("2024-02-15"),
    lastUpdated: new Date(Date.now() - 259200000),
  },
  {
    id: "5",
    name: "Hashtag Campaign Feed",
    type: "hashtag_feed",
    status: "paused",
    style: {
      theme: "light",
      primaryColor: "#8b5cf6",
      borderRadius: 12,
      showBranding: true,
    },
    platforms: ["twitter", "instagram"],
    settings: { hashtag: "#OurBrand", columns: 3, moderationEnabled: true },
    stats: { impressions: 12300, clicks: 670, conversions: 89 },
    embedCode: '<script src="https://widgets.socialflow.com/embed.js" data-widget-id="wgt_mno345"></script>',
    createdAt: new Date("2024-03-01"),
    lastUpdated: new Date(Date.now() - 604800000),
  },
];

const widgetTypes = [
  { id: "feed", name: "Social Feed", description: "Display posts from your social accounts", icon: List },
  { id: "follow_buttons", name: "Follow Buttons", description: "Let visitors follow your profiles", icon: Users },
  { id: "share_buttons", name: "Share Buttons", description: "Enable content sharing", icon: Share2 },
  { id: "testimonials", name: "Testimonials", description: "Showcase customer mentions", icon: MessageSquare },
  { id: "hashtag_feed", name: "Hashtag Feed", description: "Aggregate posts by hashtag", icon: Grid3X3 },
  { id: "reviews", name: "Reviews Widget", description: "Display social reviews", icon: Star },
  { id: "followers", name: "Follower Count", description: "Show follower statistics", icon: TrendingUp },
];

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <FaTwitter className="h-4 w-4 text-sky-500" />,
  linkedin: <FaLinkedin className="h-4 w-4 text-blue-600" />,
  facebook: <FaFacebook className="h-4 w-4 text-blue-500" />,
  instagram: <FaInstagram className="h-4 w-4 text-pink-500" />,
  youtube: <FaYoutube className="h-4 w-4 text-red-500" />,
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  paused: { label: "Paused", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  draft: { label: "Draft", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};

export default function WidgetsPage() {
  usePageHeader({
    title: "Widgets",
    subtitle: "Embed social content",
    icon: Layout,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWidget, setSelectedWidget] = useState<SocialWidget | null>(null);
  const [showCreateWidget, setShowCreateWidget] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const activeWidgets = mockWidgets.filter(w => w.status === "active").length;
  const totalImpressions = mockWidgets.reduce((sum, w) => sum + w.stats.impressions, 0);
  const totalClicks = mockWidgets.reduce((sum, w) => sum + w.stats.clicks, 0);
  const avgConversionRate = ((mockWidgets.reduce((sum, w) => sum + w.stats.conversions, 0) / totalClicks) * 100).toFixed(1);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Layout className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {mockWidgets.length} total
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{activeWidgets}</div>
                <div className="text-xs text-muted-foreground">Active Widgets</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Eye className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
                <div className="text-xs text-muted-foreground">Total Impressions</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +24%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(totalClicks)}</div>
                <div className="text-xs text-muted-foreground">Total Clicks</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Zap className="h-5 w-5 text-yellow-500" />
                <Badge variant="outline" className="text-xs">
                  Avg
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{avgConversionRate}%</div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockWidgets.map((widget) => {
                const WidgetIcon = widgetTypes.find(t => t.id === widget.type)?.icon || Layout;
                return (
                  <div key={widget.id} className="bg-card border rounded-lg overflow-hidden">
                    {/* Widget Preview */}
                    <div className="h-48 bg-gradient-to-br from-muted to-muted/50 p-4 relative">
                      <div className={cn(
                        "absolute inset-4 rounded-lg border-2 border-dashed flex items-center justify-center",
                        widget.style.theme === "dark" ? "bg-gray-900" : "bg-white"
                      )}>
                        <div className="text-center">
                          <WidgetIcon className={cn(
                            "h-8 w-8 mx-auto mb-2",
                            widget.style.theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )} />
                          <span className={cn(
                            "text-sm",
                            widget.style.theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}>
                            {widgetTypes.find(t => t.id === widget.type)?.name} Preview
                          </span>
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2" variant="outline">
                        {widget.style.theme}
                      </Badge>
                    </div>

                    {/* Widget Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{widget.name}</h3>
                            <Badge variant="outline" className={statusConfig[widget.status].color}>
                              {statusConfig[widget.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {widgetTypes.find(t => t.id === widget.type)?.description}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedWidget(widget)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyCode(widget.embedCode, widget.id)}>
                              <Code className="h-4 w-4 mr-2" />
                              Copy Embed Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {widget.status === "active" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {widget.platforms.map((platform) => (
                          <span key={platform}>{platformIcons[platform]}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{formatNumber(widget.stats.impressions)}</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{formatNumber(widget.stats.clicks)}</div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{widget.stats.conversions}</div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCode(widget.embedCode, widget.id)}
                        >
                          {copiedId === widget.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Updated {format(widget.lastUpdated, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </ScrollArea>

      {/* Create Widget Dialog */}
      <Dialog open={showCreateWidget} onOpenChange={setShowCreateWidget}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Widget</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Widget Type</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {widgetTypes.map((type) => (
                  <div
                    key={type.id}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <type.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Widget Name</label>
              <Input placeholder="e.g., Homepage Social Feed" className="mt-2" />
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

            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create Widget
              </Button>
              <Button variant="outline" onClick={() => setShowCreateWidget(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Widget Configuration Dialog */}
      <Dialog open={!!selectedWidget} onOpenChange={() => setSelectedWidget(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedWidget && (
            <>
              <DialogHeader>
                <DialogTitle>Configure Widget: {selectedWidget.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                {/* Settings */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Widget Name</label>
                    <Input defaultValue={selectedWidget.name} className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex gap-2 mt-2">
                      <Button variant={selectedWidget.style.theme === "light" ? "secondary" : "outline"} size="sm">
                        Light
                      </Button>
                      <Button variant={selectedWidget.style.theme === "dark" ? "secondary" : "outline"} size="sm">
                        Dark
                      </Button>
                      <Button variant={selectedWidget.style.theme === "auto" ? "secondary" : "outline"} size="sm">
                        Auto
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border cursor-pointer"
                        style={{ backgroundColor: selectedWidget.style.primaryColor }}
                      />
                      <Input defaultValue={selectedWidget.style.primaryColor} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Border Radius</label>
                    <div className="mt-2 flex items-center gap-4">
                      <Slider
                        defaultValue={[selectedWidget.style.borderRadius]}
                        max={24}
                        step={2}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {selectedWidget.style.borderRadius}px
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">Show Branding</div>
                      <div className="text-sm text-muted-foreground">Display "Powered by SocialFlow"</div>
                    </div>
                    <Switch defaultChecked={selectedWidget.style.showBranding} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Platforms</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(platformIcons).map(([platform, icon]) => (
                        <Button
                          key={platform}
                          variant={selectedWidget.platforms.includes(platform) ? "secondary" : "outline"}
                          size="sm"
                          className="gap-2"
                        >
                          {icon}
                          <span className="capitalize">{platform}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Preview</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    previewDevice === "mobile" ? "max-w-[320px] mx-auto" : "w-full"
                  )}>
                    <div className={cn(
                      "p-4 min-h-[300px] flex items-center justify-center",
                      selectedWidget.style.theme === "dark" ? "bg-gray-900" : "bg-white"
                    )}>
                      <div className="text-center">
                        <Layout className={cn(
                          "h-12 w-12 mx-auto mb-3",
                          selectedWidget.style.theme === "dark" ? "text-gray-500" : "text-gray-400"
                        )} />
                        <p className={cn(
                          "text-sm",
                          selectedWidget.style.theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}>
                          Live Preview
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium">Embed Code</label>
                    <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-xs overflow-x-auto">
                      <code>{selectedWidget.embedCode}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleCopyCode(selectedWidget.embedCode, `config_${selectedWidget.id}`)}
                    >
                      {copiedId === `config_${selectedWidget.id}` ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setSelectedWidget(null)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
