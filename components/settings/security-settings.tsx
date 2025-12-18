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
  Shield,
  Smartphone,
  Key,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  LogOut,
  MapPin,
  Fingerprint,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { SecurityPreferences } from "@/app/settings/page"

interface SecuritySettingsProps {
  security: SecurityPreferences
  onUpdate: (security: SecurityPreferences) => void
}

// Mock active sessions data
const activeSessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "New York, US",
    ip: "192.168.1.1",
    lastActive: new Date(),
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "New York, US",
    ip: "192.168.1.2",
    lastActive: new Date(Date.now() - 3600000),
    current: false,
  },
  {
    id: "3",
    device: "Firefox on MacOS",
    location: "Los Angeles, US",
    ip: "10.0.0.1",
    lastActive: new Date(Date.now() - 86400000),
    current: false,
  },
]

// Mock login history
const loginHistory = [
  { date: new Date(), device: "Chrome on Windows", location: "New York, US", status: "success" },
  { date: new Date(Date.now() - 86400000), device: "Safari on iPhone", location: "New York, US", status: "success" },
  { date: new Date(Date.now() - 172800000), device: "Unknown Device", location: "London, UK", status: "failed" },
  { date: new Date(Date.now() - 259200000), device: "Chrome on Windows", location: "New York, US", status: "success" },
]

export function SecuritySettings({ security, onUpdate }: SecuritySettingsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and active sessions
        </p>
      </div>

      {/* Security Score */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              security.twoFactorEnabled ? "bg-green-500/10" : "bg-amber-500/10"
            )}>
              <Shield className={cn(
                "w-8 h-8",
                security.twoFactorEnabled ? "text-green-500" : "text-amber-500"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Security Score</h3>
                <Badge variant={security.twoFactorEnabled ? "default" : "secondary"} className={cn(
                  security.twoFactorEnabled ? "bg-green-500" : "bg-amber-500"
                )}>
                  {security.twoFactorEnabled ? "Strong" : "Moderate"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {security.twoFactorEnabled
                  ? "Your account is well protected"
                  : "Enable 2FA to improve your security"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                {security.twoFactorEnabled ? "90" : "60"}/100
              </p>
              <p className="text-xs text-muted-foreground">Security points</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Password */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Key className="w-4 h-4" />
          Password
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">
                Last changed {formatDistanceToNow(security.lastPasswordChange, { addSuffix: true })}
              </p>
            </div>
          </div>
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10 rounded-xl"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="rounded-xl" />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsPasswordDialogOpen(false)}>
                  Update Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Fingerprint className="w-4 h-4" />
          Two-Factor Authentication
        </h3>
        <div className="flex items-start justify-between p-4 rounded-xl bg-muted/40">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              security.twoFactorEnabled ? "bg-green-500/10" : "bg-muted"
            )}>
              <Smartphone className={cn(
                "w-5 h-5",
                security.twoFactorEnabled ? "text-green-500" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">2FA Authentication</p>
                {security.twoFactorEnabled && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-[10px]">
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {security.twoFactorEnabled
                  ? "Your account is protected with two-factor authentication"
                  : "Add an extra layer of security to your account"
                }
              </p>
            </div>
          </div>
          <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={security.twoFactorEnabled ? "outline" : "default"}
                size="sm"
                className="rounded-xl"
              >
                {security.twoFactorEnabled ? "Manage" : "Enable"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {security.twoFactorEnabled ? "Manage 2FA" : "Enable Two-Factor Authentication"}
                </DialogTitle>
                <DialogDescription>
                  {security.twoFactorEnabled
                    ? "Manage your two-factor authentication settings."
                    : "Scan the QR code with your authenticator app to enable 2FA."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                {!security.twoFactorEnabled ? (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Enter verification code</Label>
                      <Input placeholder="000000" className="text-center text-2xl tracking-widest rounded-xl" maxLength={6} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/40">
                      <p className="text-sm font-medium text-foreground">Recovery Codes</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Download your recovery codes in case you lose access to your authenticator.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-xl">
                        Download Recovery Codes
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full rounded-xl"
                      onClick={() => {
                        onUpdate({ ...security, twoFactorEnabled: false })
                        setIs2FADialogOpen(false)
                      }}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                )}
              </div>
              {!security.twoFactorEnabled && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIs2FADialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    onUpdate({ ...security, twoFactorEnabled: true })
                    setIs2FADialogOpen(false)
                  }}>
                    Verify & Enable
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Additional Security Options */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-foreground">Login notifications</p>
              <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) =>
                onUpdate({ ...security, loginNotifications: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Active Sessions
          </h3>
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-2">
            <RefreshCw className="w-3 h-3" />
            Revoke All Others
          </Button>
        </div>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl",
                session.current ? "bg-primary/5 border border-primary/20" : "bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  {session.device.includes("iPhone") || session.device.includes("Android") ? (
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{session.device}</p>
                    {session.current && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {session.ip}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.current ? "Now" : formatDistanceToNow(session.lastActive, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Login History */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Login History
        </h3>
        <div className="space-y-2">
          {loginHistory.map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                {login.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <div>
                  <p className="text-sm text-foreground">{login.device}</p>
                  <p className="text-xs text-muted-foreground">{login.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(login.date, { addSuffix: true })}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px]",
                    login.status === "success"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  )}
                >
                  {login.status === "success" ? "Successful" : "Failed"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="link" className="w-full mt-4 text-xs">
          View Full History
        </Button>
      </Card>

      {/* Security Tips */}
      <Card className="p-6 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Security Tips</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Use a unique, strong password that you don't use elsewhere</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Review your active sessions regularly</li>
              <li>• Never share your login credentials with anyone</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
