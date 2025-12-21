"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { format, formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  MoreVertical,
  Key,
  Webhook,
  FileText,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  RefreshCw,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Play,
  Pause,
  Send,
  Terminal,
  Book,
  Zap,
  Globe,
  Lock,
  Settings,
  BarChart3,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Code,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastFour: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  status: "active" | "expired" | "revoked";
  usageCount: number;
  rateLimit: number;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "paused" | "failed";
  secret: string;
  createdAt: Date;
  lastTriggered?: Date;
  successRate: number;
  totalCalls: number;
  failedCalls: number;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: "success" | "failed" | "pending";
  statusCode?: number;
  responseTime: number;
  timestamp: Date;
  payload: Record<string, unknown>;
  response?: string;
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    prefix: "sk_live",
    lastFour: "4a2b",
    permissions: ["read", "write", "delete"],
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date(),
    status: "active",
    usageCount: 15420,
    rateLimit: 1000,
  },
  {
    id: "2",
    name: "Development Key",
    prefix: "sk_test",
    lastFour: "9c3d",
    permissions: ["read", "write"],
    createdAt: new Date("2024-02-01"),
    lastUsed: new Date(Date.now() - 86400000),
    status: "active",
    usageCount: 3250,
    rateLimit: 100,
  },
  {
    id: "3",
    name: "Analytics Read-Only",
    prefix: "sk_live",
    lastFour: "1e5f",
    permissions: ["read"],
    createdAt: new Date("2024-03-01"),
    lastUsed: new Date(Date.now() - 604800000),
    expiresAt: new Date(Date.now() + 86400000 * 30),
    status: "active",
    usageCount: 890,
    rateLimit: 500,
  },
  {
    id: "4",
    name: "Old Integration Key",
    prefix: "sk_live",
    lastFour: "2g6h",
    permissions: ["read", "write"],
    createdAt: new Date("2023-06-01"),
    status: "revoked",
    usageCount: 45000,
    rateLimit: 1000,
  },
];

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    name: "Post Published",
    url: "https://api.myapp.com/webhooks/post-published",
    events: ["post.published", "post.scheduled"],
    status: "active",
    secret: "whsec_abc123def456",
    createdAt: new Date("2024-01-20"),
    lastTriggered: new Date(),
    successRate: 98.5,
    totalCalls: 1250,
    failedCalls: 19,
  },
  {
    id: "2",
    name: "Analytics Sync",
    url: "https://api.myapp.com/webhooks/analytics",
    events: ["analytics.updated"],
    status: "active",
    secret: "whsec_xyz789ghi012",
    createdAt: new Date("2024-02-15"),
    lastTriggered: new Date(Date.now() - 3600000),
    successRate: 100,
    totalCalls: 450,
    failedCalls: 0,
  },
  {
    id: "3",
    name: "Team Changes",
    url: "https://api.myapp.com/webhooks/team",
    events: ["team.member_added", "team.member_removed", "team.role_changed"],
    status: "paused",
    secret: "whsec_jkl345mno678",
    createdAt: new Date("2024-03-01"),
    lastTriggered: new Date(Date.now() - 86400000 * 7),
    successRate: 95.2,
    totalCalls: 84,
    failedCalls: 4,
  },
  {
    id: "4",
    name: "Error Notifications",
    url: "https://hooks.slack.com/services/...",
    events: ["error.api", "error.webhook"],
    status: "failed",
    secret: "whsec_pqr901stu234",
    createdAt: new Date("2024-02-01"),
    lastTriggered: new Date(Date.now() - 3600000 * 2),
    successRate: 72.3,
    totalCalls: 156,
    failedCalls: 43,
  },
];

const mockWebhookLogs: WebhookLog[] = [
  {
    id: "1",
    webhookId: "1",
    event: "post.published",
    status: "success",
    statusCode: 200,
    responseTime: 145,
    timestamp: new Date(),
    payload: { postId: "123", platform: "twitter" },
    response: '{"success": true}',
  },
  {
    id: "2",
    webhookId: "1",
    event: "post.scheduled",
    status: "success",
    statusCode: 200,
    responseTime: 132,
    timestamp: new Date(Date.now() - 300000),
    payload: { postId: "124", scheduledFor: "2024-12-20T10:00:00Z" },
    response: '{"success": true}',
  },
  {
    id: "3",
    webhookId: "4",
    event: "error.webhook",
    status: "failed",
    statusCode: 500,
    responseTime: 5000,
    timestamp: new Date(Date.now() - 7200000),
    payload: { error: "Connection timeout" },
    response: "Internal Server Error",
  },
];

const availableEvents = [
  { category: "Posts", events: ["post.created", "post.published", "post.scheduled", "post.deleted", "post.failed"] },
  { category: "Analytics", events: ["analytics.updated", "analytics.milestone"] },
  { category: "Team", events: ["team.member_added", "team.member_removed", "team.role_changed"] },
  { category: "Channels", events: ["channel.connected", "channel.disconnected", "channel.error"] },
  { category: "Billing", events: ["billing.payment_success", "billing.payment_failed", "billing.subscription_changed"] },
  { category: "Errors", events: ["error.api", "error.webhook", "error.integration"] },
];

const permissionDescriptions: Record<string, string> = {
  read: "Read access to all resources",
  write: "Create and update resources",
  delete: "Delete resources",
  admin: "Full administrative access",
};

export default function DevelopersPage() {
  usePageHeader({
    title: "Developer Portal",
    subtitle: "API keys and documentation",
    icon: Code,
  });

  const [activeTab, setActiveTab] = useState<"api-keys" | "webhooks" | "logs" | "docs">("api-keys");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const activeKeys = mockApiKeys.filter(k => k.status === "active").length;
  const activeWebhooks = mockWebhooks.filter(w => w.status === "active").length;
  const totalApiCalls = mockApiKeys.reduce((sum, k) => sum + k.usageCount, 0);
  const avgSuccessRate = (mockWebhooks.reduce((sum, w) => sum + w.successRate, 0) / mockWebhooks.length).toFixed(1);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Paused</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      case "expired":
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Expired</Badge>;
      case "revoked":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Key className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {mockApiKeys.length} total
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{activeKeys}</div>
                <div className="text-xs text-muted-foreground">Active API Keys</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Webhook className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  {mockWebhooks.length} total
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{activeWebhooks}</div>
                <div className="text-xs text-muted-foreground">Active Webhooks</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{(totalApiCalls / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">API Calls (30d)</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-5 w-5 text-cyan-500" />
                <Badge variant="outline" className="text-xs">
                  Webhooks
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{avgSuccessRate}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {[
              { id: "api-keys", label: "API Keys", icon: Key },
              { id: "webhooks", label: "Webhooks", icon: Webhook },
              { id: "logs", label: "Webhook Logs", icon: FileText },
              { id: "docs", label: "Quick Start", icon: Book },
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
            {/* API Keys Tab */}
            {activeTab === "api-keys" && (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-500">Keep your API keys secure</h4>
                    <p className="text-sm text-muted-foreground">
                      Never share your API keys or commit them to version control. Use environment variables instead.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockApiKeys.map((key) => (
                    <div key={key.id} className="bg-card border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Key className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{key.name}</h3>
                              {getStatusBadge(key.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {key.prefix}_...{key.lastFour}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(`${key.prefix}_...${key.lastFour}`, key.id)}
                              >
                                {copiedId === key.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Regenerate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Revoke
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Permissions</span>
                          <div className="flex gap-1 mt-1">
                            {key.permissions.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created</span>
                          <div className="mt-1">{format(key.createdAt, "MMM d, yyyy")}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Used</span>
                          <div className="mt-1">
                            {key.lastUsed ? formatDistanceToNow(key.lastUsed, { addSuffix: true }) : "Never"}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Usage / Rate Limit</span>
                          <div className="mt-1">
                            {key.usageCount.toLocaleString()} / {key.rateLimit}/min
                          </div>
                        </div>
                      </div>

                      {key.expiresAt && (
                        <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Expires {formatDistanceToNow(key.expiresAt, { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webhooks Tab */}
            {activeTab === "webhooks" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {mockWebhooks.map((webhook) => (
                    <div key={webhook.id} className="bg-card border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            webhook.status === "active" && "bg-green-500/10",
                            webhook.status === "paused" && "bg-yellow-500/10",
                            webhook.status === "failed" && "bg-red-500/10"
                          )}>
                            <Webhook className={cn(
                              "h-5 w-5",
                              webhook.status === "active" && "text-green-500",
                              webhook.status === "paused" && "text-yellow-500",
                              webhook.status === "failed" && "text-red-500"
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{webhook.name}</h3>
                              {getStatusBadge(webhook.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-md truncate">
                                {webhook.url}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(webhook.url, `url_${webhook.id}`)}
                              >
                                {copiedId === `url_${webhook.id}` ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {}}
                          >
                            {webhook.status === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedWebhook(webhook)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Test Webhook
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Success Rate</span>
                          <div className={cn(
                            "mt-1 font-medium",
                            webhook.successRate >= 95 && "text-green-500",
                            webhook.successRate >= 80 && webhook.successRate < 95 && "text-yellow-500",
                            webhook.successRate < 80 && "text-red-500"
                          )}>
                            {webhook.successRate}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Calls</span>
                          <div className="mt-1">{webhook.totalCalls}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Failed</span>
                          <div className="mt-1">{webhook.failedCalls}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Triggered</span>
                          <div className="mt-1">
                            {webhook.lastTriggered ? formatDistanceToNow(webhook.lastTriggered, { addSuffix: true }) : "Never"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span>Secret:</span>
                          <code className="font-mono">
                            {showSecret === webhook.id ? webhook.secret : "whsec_••••••••••••"}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowSecret(showSecret === webhook.id ? null : webhook.id)}
                          >
                            {showSecret === webhook.id ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Created {format(webhook.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === "logs" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div>Event</div>
                    <div>Webhook</div>
                    <div>Status</div>
                    <div>Response Time</div>
                    <div>Timestamp</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {mockWebhookLogs.map((log) => {
                    const webhook = mockWebhooks.find(w => w.id === log.webhookId);
                    return (
                      <div key={log.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center hover:bg-muted/30">
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {log.event}
                          </Badge>
                        </div>
                        <div className="text-sm">{webhook?.name}</div>
                        <div>
                          <Badge className={cn(
                            log.status === "success" && "bg-green-500/10 text-green-500 border-green-500/20",
                            log.status === "failed" && "bg-red-500/10 text-red-500 border-red-500/20",
                            log.status === "pending" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          )}>
                            {log.statusCode && `${log.statusCode} `}{log.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{log.responseTime}ms</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Docs Tab */}
            {activeTab === "docs" && (
              <div className="max-w-3xl space-y-8">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Start
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Get started with the SocialFlow API in just a few minutes.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">1. Get your API key</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Create an API key from the API Keys tab above, or use an existing one.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">2. Make your first request</h3>
                      <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{`curl -X GET "https://api.socialflow.com/v1/posts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">3. Create a post</h3>
                      <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{`curl -X POST "https://api.socialflow.com/v1/posts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Hello from the API!",
    "platforms": ["twitter", "linkedin"],
    "scheduledFor": "2024-12-20T10:00:00Z"
  }'`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">API Reference</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete API documentation with all endpoints
                    </p>
                  </a>
                  <a href="#" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <Webhook className="h-6 w-6 text-purple-500" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Webhooks Guide</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn how to receive real-time events
                    </p>
                  </a>
                  <a href="#" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <Terminal className="h-6 w-6 text-green-500" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">SDKs & Libraries</h3>
                    <p className="text-sm text-muted-foreground">
                      Official SDKs for Node.js, Python, and more
                    </p>
                  </a>
                  <a href="#" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <Shield className="h-6 w-6 text-orange-500" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn about API authentication methods
                    </p>
                  </a>
                </div>
              </div>
            )}
          </div>
          </ScrollArea>
        </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="e.g., Production API Key" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Permissions</label>
              <div className="mt-2 space-y-2">
                {Object.entries(permissionDescriptions).map(([perm, desc]) => (
                  <div key={perm} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{perm}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rate Limit (requests/minute)</label>
              <Input type="number" defaultValue="1000" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Expiration (optional)</label>
              <Input type="date" className="mt-2" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Key className="h-4 w-4 mr-2" />
                Create Key
              </Button>
              <Button variant="outline" onClick={() => setShowCreateKey(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateWebhook} onOpenChange={setShowCreateWebhook}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="e.g., Post Published Notification" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Endpoint URL</label>
              <Input placeholder="https://api.yourapp.com/webhooks" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Events to Subscribe</label>
              <div className="mt-2 max-h-64 overflow-y-auto space-y-4">
                {availableEvents.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{category.category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.events.map((event) => (
                        <div key={event} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Switch id={event} />
                          <label htmlFor={event} className="text-sm cursor-pointer">
                            {event}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Webhook className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowCreateWebhook(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
