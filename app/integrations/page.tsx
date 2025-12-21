"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
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
  Search,
  MoreVertical,
  Settings,
  ExternalLink,
  Check,
  X,
  Zap,
  Star,
  TrendingUp,
  Filter,
  RefreshCw,
  Link2,
  Unlink,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Mail,
  MessageSquare,
  Puzzle,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Calendar,
  Database,
  Cloud,
  Code,
  Smartphone,
  ShoppingCart,
  Headphones,
  BookOpen,
  Target,
  PieChart,
  Video,
  Image,
  Megaphone,
  Building2,
} from "lucide-react";
import {
  FaSlack,
  FaDropbox,
  FaHubspot,
  FaSalesforce,
  FaMailchimp,
  FaWordpress,
  FaShopify,
  FaTrello,
  FaGithub,
  FaStripe,
  FaIntercom,
} from "react-icons/fa";
// Using Lucide icons for brands where react-icons may have inconsistent exports

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: "connected" | "available" | "coming_soon";
  isPremium: boolean;
  isPopular: boolean;
  connectedAt?: Date;
  lastSync?: Date;
  config?: Record<string, unknown>;
  features: string[];
  docsUrl: string;
}

const integrationCategories = [
  { id: "all", name: "All", icon: Globe },
  { id: "productivity", name: "Productivity", icon: Zap },
  { id: "crm", name: "CRM & Sales", icon: Users },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "storage", name: "Storage", icon: Cloud },
  { id: "communication", name: "Communication", icon: MessageSquare },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
  { id: "design", name: "Design", icon: Image },
  { id: "developer", name: "Developer", icon: Code },
];

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Slack",
    description: "Get notifications and share content directly in Slack channels",
    icon: <FaSlack className="h-8 w-8 text-[#4A154B]" />,
    category: "communication",
    status: "connected",
    isPremium: false,
    isPopular: true,
    connectedAt: new Date("2024-01-15"),
    lastSync: new Date(),
    features: ["Channel notifications", "Post approvals", "Team mentions", "Slash commands"],
    docsUrl: "https://docs.example.com/slack",
  },
  {
    id: "2",
    name: "Google Analytics",
    description: "Track social traffic and conversions in Google Analytics",
    icon: <BarChart3 className="h-8 w-8 text-[#F9AB00]" />,
    category: "analytics",
    status: "connected",
    isPremium: false,
    isPopular: true,
    connectedAt: new Date("2024-02-01"),
    lastSync: new Date(Date.now() - 3600000),
    features: ["Traffic tracking", "Conversion goals", "UTM builder", "Custom reports"],
    docsUrl: "https://docs.example.com/ga",
  },
  {
    id: "3",
    name: "HubSpot",
    description: "Sync contacts and track social interactions in HubSpot CRM",
    icon: <FaHubspot className="h-8 w-8 text-[#FF7A59]" />,
    category: "crm",
    status: "connected",
    isPremium: true,
    isPopular: true,
    connectedAt: new Date("2024-01-20"),
    lastSync: new Date(Date.now() - 7200000),
    features: ["Contact sync", "Lead tracking", "Social timeline", "Workflows"],
    docsUrl: "https://docs.example.com/hubspot",
  },
  {
    id: "4",
    name: "Zapier",
    description: "Connect with 5,000+ apps through automated workflows",
    icon: <Zap className="h-8 w-8 text-[#FF4A00]" />,
    category: "productivity",
    status: "available",
    isPremium: false,
    isPopular: true,
    features: ["Custom triggers", "Multi-step zaps", "Scheduled workflows", "Filters"],
    docsUrl: "https://docs.example.com/zapier",
  },
  {
    id: "5",
    name: "Salesforce",
    description: "Integrate social data with Salesforce CRM",
    icon: <FaSalesforce className="h-8 w-8 text-[#00A1E0]" />,
    category: "crm",
    status: "available",
    isPremium: true,
    isPopular: true,
    features: ["Lead sync", "Opportunity tracking", "Social profiles", "Reports"],
    docsUrl: "https://docs.example.com/salesforce",
  },
  {
    id: "6",
    name: "Mailchimp",
    description: "Sync audiences and track email campaign performance",
    icon: <FaMailchimp className="h-8 w-8 text-[#FFE01B]" />,
    category: "marketing",
    status: "available",
    isPremium: false,
    isPopular: true,
    features: ["Audience sync", "Campaign tracking", "Automation triggers", "Tags"],
    docsUrl: "https://docs.example.com/mailchimp",
  },
  {
    id: "7",
    name: "Notion",
    description: "Create content calendars and collaborate in Notion",
    icon: <FileText className="h-8 w-8" />,
    category: "productivity",
    status: "available",
    isPremium: false,
    isPopular: true,
    features: ["Calendar sync", "Database integration", "Team wiki", "Templates"],
    docsUrl: "https://docs.example.com/notion",
  },
  {
    id: "8",
    name: "Google Drive",
    description: "Access and share media files from Google Drive",
    icon: <Cloud className="h-8 w-8 text-[#4285F4]" />,
    category: "storage",
    status: "connected",
    isPremium: false,
    isPopular: false,
    connectedAt: new Date("2024-03-01"),
    lastSync: new Date(),
    features: ["File import", "Folder sync", "Team drives", "Media library"],
    docsUrl: "https://docs.example.com/gdrive",
  },
  {
    id: "9",
    name: "Dropbox",
    description: "Import media and assets from Dropbox",
    icon: <FaDropbox className="h-8 w-8 text-[#0061FF]" />,
    category: "storage",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["File sync", "Shared folders", "Version history", "Media preview"],
    docsUrl: "https://docs.example.com/dropbox",
  },
  {
    id: "10",
    name: "Canva",
    description: "Create and import designs directly from Canva",
    icon: <Image className="h-8 w-8 text-[#00C4CC]" />,
    category: "design",
    status: "available",
    isPremium: false,
    isPopular: true,
    features: ["Design import", "Brand kit sync", "Templates", "Team designs"],
    docsUrl: "https://docs.example.com/canva",
  },
  {
    id: "11",
    name: "Shopify",
    description: "Share products and track social commerce",
    icon: <FaShopify className="h-8 w-8 text-[#96BF48]" />,
    category: "ecommerce",
    status: "available",
    isPremium: true,
    isPopular: true,
    features: ["Product sync", "Shop posts", "Sales tracking", "Inventory alerts"],
    docsUrl: "https://docs.example.com/shopify",
  },
  {
    id: "12",
    name: "WordPress",
    description: "Auto-share blog posts to social media",
    icon: <FaWordpress className="h-8 w-8 text-[#21759B]" />,
    category: "marketing",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Auto-post", "Featured images", "Categories", "Custom excerpts"],
    docsUrl: "https://docs.example.com/wordpress",
  },
  {
    id: "13",
    name: "Microsoft Teams",
    description: "Collaborate and get notifications in Teams",
    icon: <MessageSquare className="h-8 w-8 text-[#6264A7]" />,
    category: "communication",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Channel posts", "Approvals", "Mentions", "Bot commands"],
    docsUrl: "https://docs.example.com/teams",
  },
  {
    id: "14",
    name: "Airtable",
    description: "Manage content in customizable Airtable bases",
    icon: <Database className="h-8 w-8 text-[#18BFFF]" />,
    category: "productivity",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Base sync", "Views", "Automation", "Forms"],
    docsUrl: "https://docs.example.com/airtable",
  },
  {
    id: "15",
    name: "Figma",
    description: "Import designs and assets from Figma",
    icon: <Image className="h-8 w-8 text-[#F24E1E]" />,
    category: "design",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Frame export", "Component sync", "Team library", "Comments"],
    docsUrl: "https://docs.example.com/figma",
  },
  {
    id: "16",
    name: "Zoom",
    description: "Schedule and share webinars and meetings",
    icon: <Video className="h-8 w-8 text-[#2D8CFF]" />,
    category: "communication",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Meeting links", "Webinar promo", "Registration", "Reminders"],
    docsUrl: "https://docs.example.com/zoom",
  },
  {
    id: "17",
    name: "Stripe",
    description: "Track payment conversions from social",
    icon: <FaStripe className="h-8 w-8 text-[#635BFF]" />,
    category: "ecommerce",
    status: "available",
    isPremium: true,
    isPopular: false,
    features: ["Revenue tracking", "Conversion attribution", "Subscription alerts", "Reports"],
    docsUrl: "https://docs.example.com/stripe",
  },
  {
    id: "18",
    name: "Intercom",
    description: "Connect social conversations to support",
    icon: <FaIntercom className="h-8 w-8 text-[#1F8DED]" />,
    category: "communication",
    status: "coming_soon",
    isPremium: true,
    isPopular: false,
    features: ["Conversation sync", "User profiles", "Help articles", "Bots"],
    docsUrl: "https://docs.example.com/intercom",
  },
  {
    id: "19",
    name: "Make (Integromat)",
    description: "Build complex automation scenarios",
    icon: <Zap className="h-8 w-8 text-[#6D00CC]" />,
    category: "productivity",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Scenarios", "Data mapping", "Error handling", "Scheduling"],
    docsUrl: "https://docs.example.com/make",
  },
  {
    id: "20",
    name: "GitHub",
    description: "Auto-share release notes and updates",
    icon: <FaGithub className="h-8 w-8" />,
    category: "developer",
    status: "available",
    isPremium: false,
    isPopular: false,
    features: ["Release posts", "Changelog", "Issue tracking", "PR updates"],
    docsUrl: "https://docs.example.com/github",
  },
];

export default function IntegrationsPage() {
  usePageHeader({
    title: "Integrations",
    subtitle: "Connect your favorite tools",
    icon: Puzzle,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showOnlyConnected, setShowOnlyConnected] = useState(false);
  const [showOnlyPremium, setShowOnlyPremium] = useState(false);

  const connectedCount = mockIntegrations.filter(i => i.status === "connected").length;
  const availableCount = mockIntegrations.filter(i => i.status === "available").length;

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    const matchesConnected = !showOnlyConnected || integration.status === "connected";
    const matchesPremium = !showOnlyPremium || integration.isPremium;
    return matchesSearch && matchesCategory && matchesConnected && matchesPremium;
  });

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "available":
        return (
          <Badge variant="outline">
            Available
          </Badge>
        );
      case "coming_soon":
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        );
    }
  };

  return (
    <>
        {/* Stats */}
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Globe className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  Total
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{mockIntegrations.length}</div>
                <div className="text-xs text-muted-foreground">Integrations</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{connectedCount}</div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Globe className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  Ready
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{availableCount}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <Badge variant="outline" className="text-xs">
                  Today
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">1.2K</div>
                <div className="text-xs text-muted-foreground">API Calls</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-64 border-r p-4 bg-card/30">
            <h3 className="font-semibold mb-3 text-sm">Categories</h3>
            <div className="space-y-1">
              {integrationCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                  {category.id !== "all" && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {mockIntegrations.filter(i => i.category === category.id).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected only</span>
                <Switch checked={showOnlyConnected} onCheckedChange={setShowOnlyConnected} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium only</span>
                <Switch checked={showOnlyPremium} onCheckedChange={setShowOnlyPremium} />
              </div>
            </div>
          </div>

          {/* Integrations Grid */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredIntegrations.length} integrations
                </span>
              </div>

              {/* Popular Integrations */}
              {selectedCategory === "all" && !searchQuery && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Popular Integrations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockIntegrations.filter(i => i.isPopular).slice(0, 4).map((integration) => (
                      <div
                        key={integration.id}
                        className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedIntegration(integration)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {integration.icon}
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            {integration.isPremium && (
                              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={cn(
                      "bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer",
                      integration.status === "coming_soon" && "opacity-75"
                    )}
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {integration.name}
                            {integration.isPremium && (
                              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                                Pro
                              </Badge>
                            )}
                          </h4>
                          <Badge variant="outline" className="text-xs capitalize mt-1">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {integration.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {integration.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{integration.features.length - 3}
                        </Badge>
                      )}
                    </div>
                    {integration.status === "connected" && integration.lastSync && (
                      <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        Last sync: {format(integration.lastSync, "MMM d, h:mm a")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

      {/* Integration Detail Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedIntegration.icon}
                  <span>{selectedIntegration.name}</span>
                  {selectedIntegration.isPremium && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Premium
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedIntegration.status)}
                  <Badge variant="outline" className="capitalize">
                    {selectedIntegration.category}
                  </Badge>
                </div>

                <p className="text-muted-foreground">{selectedIntegration.description}</p>

                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIntegration.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedIntegration.status === "connected" && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Connection Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Connected</span>
                        <span>{selectedIntegration.connectedAt && format(selectedIntegration.connectedAt, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span>{selectedIntegration.lastSync && format(selectedIntegration.lastSync, "MMM d, h:mm a")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-500/10 text-green-500">Healthy</Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedIntegration.status === "connected" ? (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="destructive">
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </>
                  ) : selectedIntegration.status === "available" ? (
                    <>
                      <Button className="flex-1">
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Docs
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="flex-1" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </div>

                {selectedIntegration.isPremium && selectedIntegration.status !== "connected" && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="font-medium text-amber-500">Premium Integration</div>
                      <div className="text-sm text-muted-foreground">
                        This integration requires a Pro or Enterprise plan
                      </div>
                    </div>
                    <Button size="sm" className="ml-auto bg-amber-500 hover:bg-amber-600">
                      Upgrade
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
