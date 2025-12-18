"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plug,
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Webhook,
  Code2,
  Settings2,
  Shield,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow, format } from "date-fns"
import type { ConnectedIntegration, ApiKey } from "@/app/settings/page"

interface IntegrationSettingsProps {
  integrations: ConnectedIntegration[]
  apiKeys: ApiKey[]
  onIntegrationsUpdate: (integrations: ConnectedIntegration[]) => void
  onApiKeysUpdate: (apiKeys: ApiKey[]) => void
}

const availableIntegrations = [
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect SocialFlow with 5,000+ apps",
    icon: "⚡",
    category: "Automation",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications in your Slack workspace",
    icon: "💬",
    category: "Communication",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync content calendar with Notion",
    icon: "📝",
    category: "Productivity",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic from social posts",
    icon: "📊",
    category: "Analytics",
  },
  {
    id: "canva",
    name: "Canva",
    description: "Design graphics directly in SocialFlow",
    icon: "🎨",
    category: "Design",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Access media files from Dropbox",
    icon: "📦",
    category: "Storage",
  },
]

export function IntegrationSettings({
  integrations,
  apiKeys,
  onIntegrationsUpdate,
  onApiKeysUpdate,
}: IntegrationSettingsProps) {
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState("read")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleDeleteKey = (keyId: string) => {
    onApiKeysUpdate(apiKeys.filter((k) => k.id !== keyId))
  }

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `sf_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      lastUsed: null,
      permissions: newKeyPermissions as "read" | "write" | "full",
    }
    onApiKeysUpdate([...apiKeys, newKey])
    setNewKeyName("")
    setNewKeyPermissions("read")
    setIsNewKeyDialogOpen(false)
  }

  const handleDisconnectIntegration = (integrationId: string) => {
    onIntegrationsUpdate(integrations.filter((i) => i.id !== integrationId))
  }

  const handleToggleIntegration = (integrationId: string, enabled: boolean) => {
    onIntegrationsUpdate(
      integrations.map((i) =>
        i.id === integrationId ? { ...i, status: enabled ? "active" : "inactive" } : i
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect third-party apps and manage API access
        </p>
      </div>

      {/* Connected Integrations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Plug className="w-4 h-4" />
            Connected Apps
          </h3>
          <Badge variant="secondary">{integrations.length} connected</Badge>
        </div>

        {integrations.length > 0 ? (
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl border">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{integration.name}</p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          integration.status === "active"
                            ? "bg-green-500/10 text-green-600"
                            : integration.status === "error"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {integration.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {integration.status === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Connected {formatDistanceToNow(integration.connectedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={integration.status === "active"}
                    onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDisconnectIntegration(integration.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No apps connected</p>
            <p className="text-xs text-muted-foreground">
              Connect your favorite apps to supercharge your workflow
            </p>
          </div>
        )}
      </Card>

      {/* Available Integrations */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Available Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIntegrations
            .filter((ai) => !integrations.find((i) => i.id === ai.id))
            .map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                    {integration.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl shrink-0"
                  onClick={() => {
                    const newIntegration: ConnectedIntegration = {
                      id: integration.id,
                      name: integration.name,
                      icon: integration.icon,
                      status: "active",
                      connectedAt: new Date(),
                    }
                    onIntegrationsUpdate([...integrations, newIntegration])
                  }}
                >
                  Connect
                </Button>
              </div>
            ))}
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Manage API keys for programmatic access
            </p>
          </div>
          <Dialog open={isNewKeyDialogOpen} onOpenChange={setIsNewKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl gap-2">
                <Plus className="w-4 h-4" />
                Create Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key to access the SocialFlow API.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production Server"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permissions">Permissions</Label>
                  <Select value={newKeyPermissions} onValueChange={setNewKeyPermissions}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read Only</SelectItem>
                      <SelectItem value="write">Read & Write</SelectItem>
                      <SelectItem value="full">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {newKeyPermissions === "read" && "Can only read data, cannot make changes"}
                    {newKeyPermissions === "write" && "Can read and write data, but cannot delete"}
                    {newKeyPermissions === "full" && "Full access to all API endpoints"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewKeyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
                  Create Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {apiKeys.length > 0 ? (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 rounded-xl bg-muted/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{key.name}</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        key.permissions === "full"
                          ? "bg-red-500/10 text-red-600"
                          : key.permissions === "write"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-green-500/10 text-green-600"
                      )}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {key.permissions}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDeleteKey(key.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <code className="flex-1 text-xs bg-background px-3 py-2 rounded-lg font-mono text-muted-foreground">
                    {showApiKey === key.id ? key.key : "sf_live_••••••••••••••••••••••••"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                  >
                    {showApiKey === key.id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKey(key.id, key.key)}
                  >
                    {copiedKey === key.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Created {format(key.createdAt, "MMM d, yyyy")}
                  </span>
                  {key.lastUsed && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Last used {formatDistanceToNow(key.lastUsed, { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No API keys</p>
            <p className="text-xs text-muted-foreground">
              Create an API key to start using the SocialFlow API
            </p>
          </div>
        )}
      </Card>

      {/* Webhooks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Receive real-time notifications via HTTP callbacks
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Add Webhook
          </Button>
        </div>
        <div className="text-center py-8">
          <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No webhooks configured</p>
          <p className="text-xs text-muted-foreground">
            Set up webhooks to receive event notifications
          </p>
        </div>
      </Card>

      {/* API Documentation Link */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">API Documentation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Explore our comprehensive API documentation to integrate SocialFlow into your applications.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 shrink-0">
            <ExternalLink className="w-4 h-4" />
            View Docs
          </Button>
        </div>
      </Card>
    </div>
  )
}
