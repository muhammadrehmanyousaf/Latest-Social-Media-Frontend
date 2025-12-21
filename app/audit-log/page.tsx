"use client";

import { useState } from "react";
import { usePageHeader } from "@/components/page-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Settings,
  Key,
  Users,
  FileText,
  Send,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Link2,
  Unlink,
  CreditCard,
  Mail,
  Bell,
  Zap,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  MoreVertical,
  ScrollText,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  action: string;
  actionType: "create" | "update" | "delete" | "login" | "logout" | "permission" | "export" | "integration" | "billing" | "security";
  resource: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  location?: string;
  status: "success" | "failure" | "warning";
  severity: "low" | "medium" | "high" | "critical";
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date(),
    user: { id: "1", name: "Sarah Johnson", email: "sarah@company.com", avatar: "SJ", role: "Admin" },
    action: "Published post to Twitter",
    actionType: "create",
    resource: "Post",
    resourceType: "post",
    resourceId: "post_123",
    details: { platform: "twitter", postId: "tw_456", content: "Exciting news! Our new feature is live..." },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
    location: "New York, US",
    status: "success",
    severity: "low",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 300000),
    user: { id: "2", name: "Michael Chen", email: "michael@company.com", avatar: "MC", role: "Editor" },
    action: "Updated team permissions",
    actionType: "permission",
    resource: "Team Settings",
    resourceType: "settings",
    resourceId: "team_abc",
    details: { changedFields: ["canPublish", "canApprove"], previousValues: { canPublish: false }, newValues: { canPublish: true } },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    location: "San Francisco, US",
    status: "success",
    severity: "medium",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 600000),
    user: { id: "3", name: "Emily Davis", email: "emily@company.com", avatar: "ED", role: "Admin" },
    action: "Connected Slack integration",
    actionType: "integration",
    resource: "Integration",
    resourceType: "integration",
    resourceId: "slack_int",
    details: { integration: "Slack", workspace: "Company Workspace" },
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
    location: "Boston, US",
    status: "success",
    severity: "low",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 900000),
    user: { id: "1", name: "Sarah Johnson", email: "sarah@company.com", avatar: "SJ", role: "Admin" },
    action: "Failed login attempt",
    actionType: "login",
    resource: "Authentication",
    resourceType: "auth",
    resourceId: "auth_session",
    details: { reason: "Invalid password", attempts: 3 },
    ipAddress: "203.0.113.50",
    userAgent: "Mozilla/5.0 (Linux; Android 13) Chrome/120.0",
    location: "Unknown",
    status: "failure",
    severity: "high",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1200000),
    user: { id: "4", name: "James Wilson", email: "james@company.com", avatar: "JW", role: "Viewer" },
    action: "Exported analytics report",
    actionType: "export",
    resource: "Report",
    resourceType: "report",
    resourceId: "report_q4",
    details: { format: "PDF", dateRange: "Q4 2024", size: "2.4 MB" },
    ipAddress: "192.168.1.120",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0",
    location: "Chicago, US",
    status: "success",
    severity: "low",
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1800000),
    user: { id: "2", name: "Michael Chen", email: "michael@company.com", avatar: "MC", role: "Editor" },
    action: "Deleted scheduled posts",
    actionType: "delete",
    resource: "Scheduled Posts",
    resourceType: "post",
    resourceId: "batch_del",
    details: { count: 5, platforms: ["twitter", "linkedin"] },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    location: "San Francisco, US",
    status: "success",
    severity: "medium",
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 3600000),
    user: { id: "3", name: "Emily Davis", email: "emily@company.com", avatar: "ED", role: "Admin" },
    action: "Updated billing information",
    actionType: "billing",
    resource: "Billing",
    resourceType: "billing",
    resourceId: "billing_123",
    details: { field: "Payment method", action: "Added new card ending in 4242" },
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
    location: "Boston, US",
    status: "success",
    severity: "high",
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 7200000),
    user: { id: "5", name: "System", email: "system@socialflow.com", avatar: "SY", role: "System" },
    action: "Security alert: Unusual login location",
    actionType: "security",
    resource: "Security",
    resourceType: "security",
    resourceId: "alert_456",
    details: { triggeredBy: "sarah@company.com", newLocation: "Singapore", previousLocation: "New York" },
    ipAddress: "103.12.45.67",
    userAgent: "Unknown",
    location: "Singapore",
    status: "warning",
    severity: "critical",
  },
  {
    id: "9",
    timestamp: new Date(Date.now() - 10800000),
    user: { id: "1", name: "Sarah Johnson", email: "sarah@company.com", avatar: "SJ", role: "Admin" },
    action: "Invited new team member",
    actionType: "create",
    resource: "Team Member",
    resourceType: "user",
    resourceId: "user_new",
    details: { email: "newmember@company.com", role: "Editor" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
    location: "New York, US",
    status: "success",
    severity: "low",
  },
  {
    id: "10",
    timestamp: new Date(Date.now() - 14400000),
    user: { id: "2", name: "Michael Chen", email: "michael@company.com", avatar: "MC", role: "Editor" },
    action: "API key generated",
    actionType: "security",
    resource: "API Key",
    resourceType: "api",
    resourceId: "api_key_789",
    details: { keyPrefix: "sk_live_...", permissions: ["read", "write"] },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    location: "San Francisco, US",
    status: "success",
    severity: "high",
  },
];

const actionTypeIcons: Record<string, React.ReactNode> = {
  create: <Plus className="h-4 w-4 text-green-500" />,
  update: <Edit3 className="h-4 w-4 text-blue-500" />,
  delete: <Trash2 className="h-4 w-4 text-red-500" />,
  login: <LogIn className="h-4 w-4 text-purple-500" />,
  logout: <LogOut className="h-4 w-4 text-gray-500" />,
  permission: <Key className="h-4 w-4 text-yellow-500" />,
  export: <Download className="h-4 w-4 text-cyan-500" />,
  integration: <Link2 className="h-4 w-4 text-orange-500" />,
  billing: <CreditCard className="h-4 w-4 text-pink-500" />,
  security: <Shield className="h-4 w-4 text-red-500" />,
};

const statusConfig = {
  success: { label: "Success", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  failure: { label: "Failed", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  warning: { label: "Warning", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
};

const severityConfig = {
  low: { label: "Low", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  critical: { label: "Critical", color: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export default function AuditLogPage() {
  usePageHeader({
    title: "Audit Log",
    subtitle: "Track all activities",
    icon: ScrollText,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [filterActionType, setFilterActionType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActionType = filterActionType === "all" || log.actionType === filterActionType;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesUser = filterUser === "all" || log.user.id === filterUser;
    return matchesSearch && matchesActionType && matchesStatus && matchesSeverity && matchesUser;
  });

  const uniqueUsers = Array.from(new Set(mockAuditLogs.map(l => l.user.id))).map(
    id => mockAuditLogs.find(l => l.user.id === id)!.user
  );

  const securityAlerts = mockAuditLogs.filter(l => l.severity === "critical" || l.severity === "high").length;
  const failedActions = mockAuditLogs.filter(l => l.status === "failure").length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange === "7d" ? "Last 7 days" : dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setDateRange("7d")}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange("30d")}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange("90d")}>Last 90 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 pt-0">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {dateRange}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
                <div className="text-xs text-muted-foreground">Total Events</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{uniqueUsers.length}</div>
                <div className="text-xs text-muted-foreground">Users Tracked</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Shield className="h-5 w-5 text-orange-500" />
                {securityAlerts > 0 && (
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                    {securityAlerts} alerts
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{securityAlerts}</div>
                <div className="text-xs text-muted-foreground">Security Alerts</div>
              </div>
            </div>
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <XCircle className="h-5 w-5 text-red-500" />
                {failedActions > 0 && (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                    Review
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{failedActions}</div>
                <div className="text-xs text-muted-foreground">Failed Actions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-card/30">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Action Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterActionType("all")}>All Types</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterActionType("create")}>Create</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterActionType("update")}>Update</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterActionType("delete")}>Delete</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterActionType("login")}>Login</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterActionType("permission")}>Permission</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterActionType("security")}>Security</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("success")}>Success</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("failure")}>Failed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("warning")}>Warning</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Severity
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterSeverity("all")}>All Severity</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterSeverity("low")}>Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("high")}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("critical")}>Critical</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  User
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterUser("all")}>All Users</DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueUsers.map(user => (
                  <DropdownMenuItem key={user.id} onClick={() => setFilterUser(user.id)}>
                    {user.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Log Entries */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="space-y-2">
              {filteredLogs.map((log) => {
                const StatusIcon = statusConfig[log.status].icon;
                return (
                  <div
                    key={log.id}
                    className={cn(
                      "bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer",
                      log.severity === "critical" && "border-red-500/30 bg-red-500/5",
                      log.severity === "high" && "border-orange-500/30 bg-orange-500/5"
                    )}
                    onClick={() => setSelectedEntry(log)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {actionTypeIcons[log.actionType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.action}</span>
                          <Badge variant="outline" className={statusConfig[log.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[log.status].label}
                          </Badge>
                          <Badge variant="outline" className={severityConfig[log.severity].color}>
                            {severityConfig[log.severity].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {log.user.avatar}
                            </div>
                            {log.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.location || log.ipAddress}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <div>{format(log.timestamp, "MMM d, yyyy")}</div>
                        <div>{format(log.timestamp, "h:mm:ss a")}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

      {/* Entry Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {actionTypeIcons[selectedEntry.actionType]}
                  {selectedEntry.action}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusConfig[selectedEntry.status].color}>
                    {statusConfig[selectedEntry.status].label}
                  </Badge>
                  <Badge variant="outline" className={severityConfig[selectedEntry.severity].color}>
                    {severityConfig[selectedEntry.severity].label}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedEntry.actionType}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{selectedEntry.user.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{selectedEntry.user.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Role</span>
                        <Badge variant="outline">{selectedEntry.user.role}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Location & Device
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">IP Address</span>
                        <span className="font-mono text-xs">{selectedEntry.ipAddress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{selectedEntry.location || "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timestamp
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <div className="font-medium">{format(selectedEntry.timestamp, "MMMM d, yyyy")}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time</span>
                      <div className="font-medium">{format(selectedEntry.timestamp, "h:mm:ss a z")}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Details
                  </h4>
                  <div className="bg-background rounded-lg p-3 font-mono text-xs overflow-auto">
                    <pre>{JSON.stringify(selectedEntry.details, null, 2)}</pre>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">User Agent</h4>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {selectedEntry.userAgent}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resource
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
