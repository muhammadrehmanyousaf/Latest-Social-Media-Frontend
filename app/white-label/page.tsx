"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  Plus,
  Search,
  MoreVertical,
  Palette,
  Globe,
  Mail,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  Shield,
  Eye,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Image,
  Link2,
  Code,
  Smartphone,
  Monitor,
  Send,
  Edit3,
  Trash2,
  Star,
  Crown,
  Zap,
  TrendingUp,
  DollarSign,
  PieChart,
  UserPlus,
  Key,
  Lock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  FileText,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  email: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "trial" | "suspended" | "pending";
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    faviconUrl?: string;
    customDomain?: string;
    customEmail?: string;
  };
  stats: {
    users: number;
    posts: number;
    channels: number;
    mrr: number;
  };
  features: string[];
  createdAt: Date;
  lastActive: Date;
}

interface BrandingSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customCss: string;
  emailFromName: string;
  emailFromAddress: string;
  customDomain: string;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
}

interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  limits: {
    users: number;
    posts: number;
    channels: number;
    storage: number;
  };
  isDefault: boolean;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Digital Marketing Pro",
    domain: "digitalmarketingpro.com",
    email: "admin@digitalmarketingpro.com",
    plan: "enterprise",
    status: "active",
    branding: {
      primaryColor: "#6366f1",
      secondaryColor: "#818cf8",
      accentColor: "#c7d2fe",
      customDomain: "app.digitalmarketingpro.com",
      customEmail: "noreply@digitalmarketingpro.com",
    },
    stats: {
      users: 45,
      posts: 1250,
      channels: 28,
      mrr: 499,
    },
    features: ["unlimited_posts", "custom_domain", "priority_support", "api_access"],
    createdAt: new Date("2024-01-15"),
    lastActive: new Date(),
  },
  {
    id: "2",
    name: "Social Buzz Agency",
    domain: "socialbuzzagency.io",
    email: "hello@socialbuzzagency.io",
    plan: "professional",
    status: "active",
    branding: {
      primaryColor: "#10b981",
      secondaryColor: "#34d399",
      accentColor: "#a7f3d0",
      customDomain: "dashboard.socialbuzzagency.io",
    },
    stats: {
      users: 18,
      posts: 620,
      channels: 15,
      mrr: 199,
    },
    features: ["unlimited_posts", "custom_domain", "priority_support"],
    createdAt: new Date("2024-02-01"),
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    name: "Growth Hackers Inc",
    domain: "growthhackers.co",
    email: "team@growthhackers.co",
    plan: "professional",
    status: "trial",
    branding: {
      primaryColor: "#f59e0b",
      secondaryColor: "#fbbf24",
      accentColor: "#fde68a",
    },
    stats: {
      users: 5,
      posts: 45,
      channels: 8,
      mrr: 0,
    },
    features: ["unlimited_posts", "basic_support"],
    createdAt: new Date("2024-03-01"),
    lastActive: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    name: "Brand Builders",
    domain: "brandbuilders.agency",
    email: "info@brandbuilders.agency",
    plan: "starter",
    status: "active",
    branding: {
      primaryColor: "#ec4899",
      secondaryColor: "#f472b6",
      accentColor: "#fbcfe8",
    },
    stats: {
      users: 3,
      posts: 120,
      channels: 6,
      mrr: 79,
    },
    features: ["limited_posts", "email_support"],
    createdAt: new Date("2024-02-15"),
    lastActive: new Date(Date.now() - 172800000),
  },
];

const mockPlans: PlanTemplate[] = [
  {
    id: "1",
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: 79,
    billingCycle: "monthly",
    features: ["5 team members", "100 posts/month", "10 social channels", "Email support", "Basic analytics"],
    limits: { users: 5, posts: 100, channels: 10, storage: 5 },
    isDefault: false,
  },
  {
    id: "2",
    name: "Professional",
    description: "For growing agencies and teams",
    price: 199,
    billingCycle: "monthly",
    features: ["25 team members", "Unlimited posts", "25 social channels", "Priority support", "Custom domain", "Advanced analytics", "API access"],
    limits: { users: 25, posts: -1, channels: 25, storage: 25 },
    isDefault: true,
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Full white-label solution for agencies",
    price: 499,
    billingCycle: "monthly",
    features: ["Unlimited team members", "Unlimited posts", "Unlimited channels", "24/7 support", "Custom domain", "Custom branding", "API access", "Dedicated account manager", "SLA guarantee"],
    limits: { users: -1, posts: -1, channels: -1, storage: 100 },
    isDefault: false,
  },
];

const defaultBranding: BrandingSettings = {
  companyName: "SocialFlow",
  tagline: "Social Media Management Made Easy",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  primaryColor: "#6366f1",
  secondaryColor: "#818cf8",
  accentColor: "#c7d2fe",
  customCss: "",
  emailFromName: "SocialFlow",
  emailFromAddress: "noreply@socialflow.com",
  customDomain: "app.socialflow.com",
  supportEmail: "support@socialflow.com",
  termsUrl: "https://socialflow.com/terms",
  privacyUrl: "https://socialflow.com/privacy",
};

const planColors = {
  starter: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  professional: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  enterprise: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  trial: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  suspended: "bg-red-500/10 text-red-500 border-red-500/20",
  pending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function WhiteLabelPage() {
  usePageHeader({
    title: "White Label",
    subtitle: "Customize the platform",
    icon: Palette,
  });

  const [activeTab, setActiveTab] = useState<"clients" | "branding" | "plans" | "domains" | "emails" | "analytics">("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalMRR = mockClients.reduce((sum, c) => sum + c.stats.mrr, 0);
  const totalUsers = mockClients.reduce((sum, c) => sum + c.stats.users, 0);
  const activeClients = mockClients.filter(c => c.status === "active").length;
  const trialClients = mockClients.filter(c => c.status === "trial").length;

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedId(domain);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Building2 className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {trialClients} trials
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{mockClients.length}</div>
                <div className="text-xs text-muted-foreground">Total Clients</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{activeClients}</div>
                <div className="text-xs text-muted-foreground">Active Clients</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="text-xs text-muted-foreground">Total End Users</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">${totalMRR.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Star className="h-5 w-5 text-yellow-500" />
                <Badge variant="outline" className="text-xs">
                  Agency
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {[
              { id: "clients", label: "Clients", icon: Building2 },
              { id: "branding", label: "Branding", icon: Palette },
              { id: "plans", label: "Plans & Pricing", icon: CreditCard },
              { id: "domains", label: "Domains", icon: Globe },
              { id: "emails", label: "Email Templates", icon: Mail },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
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

          {/* Main Content */}
          <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Clients Tab */}
            {activeTab === "clients" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">Client</div>
                    <div>Plan</div>
                    <div>Status</div>
                    <div className="text-right">Users</div>
                    <div className="text-right">MRR</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {mockClients.map((client) => (
                    <div
                      key={client.id}
                      className="grid grid-cols-7 gap-4 p-4 border-t items-center hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: client.branding.primaryColor }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.domain}</div>
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline" className={planColors[client.plan]}>
                          <Crown className="h-3 w-3 mr-1" />
                          {client.plan}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline" className={statusColors[client.status]}>
                          {client.status}
                        </Badge>
                      </div>
                      <div className="text-right">{client.stats.users}</div>
                      <div className="text-right font-medium">${client.stats.mrr}</div>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="h-4 w-4 mr-2" />
                              Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="max-w-4xl space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Image className="h-5 w-5 text-blue-500" />
                      Logo & Identity
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Company Name</label>
                        <Input
                          value={branding.companyName}
                          onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tagline</label>
                        <Input
                          value={branding.tagline}
                          onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Logo</label>
                        <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Drop your logo here or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommended: 200x50px, PNG or SVG
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Favicon</label>
                        <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">32x32px, ICO or PNG</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-500" />
                      Color Scheme
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Primary Color</label>
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-lg border cursor-pointer"
                            style={{ backgroundColor: branding.primaryColor }}
                          />
                          <Input
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Secondary Color</label>
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-lg border cursor-pointer"
                            style={{ backgroundColor: branding.secondaryColor }}
                          />
                          <Input
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Accent Color</label>
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-lg border cursor-pointer"
                            style={{ backgroundColor: branding.accentColor }}
                          />
                          <Input
                            value={branding.accentColor}
                            onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <label className="text-sm font-medium">Preview</label>
                        <div className="mt-2 p-4 rounded-lg border" style={{ backgroundColor: branding.accentColor + "20" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: branding.primaryColor }} />
                            <span className="font-bold" style={{ color: branding.primaryColor }}>
                              {branding.companyName}
                            </span>
                          </div>
                          <Button size="sm" style={{ backgroundColor: branding.primaryColor }}>
                            Sample Button
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    Custom CSS
                  </h3>
                  <Textarea
                    value={branding.customCss}
                    onChange={(e) => setBranding({ ...branding, customCss: e.target.value })}
                    placeholder="/* Add custom CSS here */"
                    className="font-mono text-sm"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Custom CSS will be applied to all client portals
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Legal Pages
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Terms of Service URL</label>
                      <Input
                        value={branding.termsUrl}
                        onChange={(e) => setBranding({ ...branding, termsUrl: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Privacy Policy URL</label>
                      <Input
                        value={branding.privacyUrl}
                        onChange={(e) => setBranding({ ...branding, privacyUrl: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Branding Settings</Button>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === "plans" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Pricing Plans</h2>
                  <Button onClick={() => setShowAddPlan(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={cn(
                        "bg-card border rounded-lg p-6 relative",
                        plan.isDefault && "ring-2 ring-primary"
                      )}
                    >
                      {plan.isDefault && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                          Most Popular
                        </Badge>
                      )}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.billingCycle === "monthly" ? "mo" : "yr"}</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t space-y-2">
                        <Button variant="outline" className="w-full">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Plan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Domains Tab */}
            {activeTab === "domains" && (
              <div className="max-w-3xl space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Default Domain
                  </h3>
                  <div className="flex items-center gap-4">
                    <Input value={branding.customDomain} className="flex-1" readOnly />
                    <Button variant="outline" onClick={() => handleCopyDomain(branding.customDomain)}>
                      {copiedId === branding.customDomain ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-purple-500" />
                    Client Custom Domains
                  </h3>
                  <div className="space-y-4">
                    {mockClients.filter(c => c.branding.customDomain).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: client.branding.primaryColor }}
                          >
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{client.branding.customDomain}</div>
                            <div className="text-xs text-muted-foreground">{client.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    SSL Certificates
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium text-green-500">Auto-SSL Enabled</div>
                        <div className="text-xs text-muted-foreground">
                          All domains are automatically secured with SSL
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">DNS Configuration</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">CNAME Record</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-background rounded text-sm">
                          app → cname.socialflow.com
                        </code>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">TXT Record (Verification)</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-background rounded text-sm">
                          _socialflow-verify → abc123def456
                        </code>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emails Tab */}
            {activeTab === "emails" && (
              <div className="max-w-3xl space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Email Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">From Name</label>
                        <Input
                          value={branding.emailFromName}
                          onChange={(e) => setBranding({ ...branding, emailFromName: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">From Address</label>
                        <Input
                          value={branding.emailFromAddress}
                          onChange={(e) => setBranding({ ...branding, emailFromAddress: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Support Email</label>
                      <Input
                        value={branding.supportEmail}
                        onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Email Templates</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Welcome Email", description: "Sent when a new user signs up", lastEdited: "2 days ago" },
                      { name: "Password Reset", description: "Sent when user requests password reset", lastEdited: "1 week ago" },
                      { name: "Invoice", description: "Monthly billing invoice", lastEdited: "3 days ago" },
                      { name: "Trial Ending", description: "Reminder before trial expires", lastEdited: "5 days ago" },
                      { name: "Feature Announcement", description: "New feature release notifications", lastEdited: "1 day ago" },
                    ].map((template) => (
                      <div key={template.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Edited {template.lastEdited}</span>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Revenue Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-500">${totalMRR}</div>
                        <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold">${totalMRR * 12}</div>
                        <div className="text-sm text-muted-foreground">Annual Revenue</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold">${Math.round(totalMRR / mockClients.length)}</div>
                        <div className="text-sm text-muted-foreground">Avg per Client</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-500">+18%</div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      Plan Distribution
                    </h3>
                    <div className="space-y-4">
                      {[
                        { plan: "Enterprise", count: mockClients.filter(c => c.plan === "enterprise").length, color: "bg-amber-500" },
                        { plan: "Professional", count: mockClients.filter(c => c.plan === "professional").length, color: "bg-purple-500" },
                        { plan: "Starter", count: mockClients.filter(c => c.plan === "starter").length, color: "bg-blue-500" },
                      ].map((item) => (
                        <div key={item.plan}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className={cn("w-3 h-3 rounded-full", item.color)} />
                              {item.plan}
                            </span>
                            <span className="text-muted-foreground">{item.count} clients</span>
                          </div>
                          <Progress value={(item.count / mockClients.length) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      User Growth
                    </h3>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {[45, 52, 68, 75, 82, 91].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-primary/20 rounded-t-lg"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </div>

                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Key Metrics
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: "Client Retention Rate", value: "94%", trend: "+2%" },
                        { label: "Avg Time to Onboard", value: "2.5 days", trend: "-0.5" },
                        { label: "Support Tickets/Client", value: "1.2/mo", trend: "-15%" },
                        { label: "Feature Adoption", value: "78%", trend: "+8%" },
                      ].map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{metric.value}</span>
                            <span className="text-xs text-green-500">{metric.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </ScrollArea>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedClient.branding.primaryColor }}
                  >
                    {selectedClient.name.charAt(0)}
                  </div>
                  {selectedClient.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={planColors[selectedClient.plan]}>
                    <Crown className="h-3 w-3 mr-1" />
                    {selectedClient.plan}
                  </Badge>
                  <Badge variant="outline" className={statusColors[selectedClient.status]}>
                    {selectedClient.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedClient.stats.users}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedClient.stats.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedClient.stats.channels}</div>
                    <div className="text-xs text-muted-foreground">Channels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">${selectedClient.stats.mrr}</div>
                    <div className="text-xs text-muted-foreground">MRR</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedClient.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {selectedClient.domain}
                    </div>
                    {selectedClient.branding.customDomain && (
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        {selectedClient.branding.customDomain}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Branding Colors</label>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedClient.branding.primaryColor }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedClient.branding.secondaryColor }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedClient.branding.accentColor }}
                      title="Accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Features</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedClient.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Dashboard
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Client
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input placeholder="Enter company name" className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="admin@company.com" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Domain</label>
                <Input placeholder="company.com" className="mt-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Plan</label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Starter</Button>
                <Button variant="secondary" size="sm">Professional</Button>
                <Button variant="outline" size="sm">Enterprise</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Brand Color</label>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary border" />
                <Input placeholder="#6366f1" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Send Welcome Email</div>
                <div className="text-sm text-muted-foreground">Invite admin to set up their account</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Client
              </Button>
              <Button variant="outline" onClick={() => setShowAddClient(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
