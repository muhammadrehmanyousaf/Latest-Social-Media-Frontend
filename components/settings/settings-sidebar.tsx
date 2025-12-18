"use client"

import { Button } from "@/components/ui/button"
import {
  User,
  Palette,
  Bell,
  Shield,
  Plug,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SettingsSection } from "@/app/settings/page"

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

const sections: {
  id: SettingsSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  group: "account" | "preferences" | "workspace" | "other"
}[] = [
  { id: "profile", label: "Profile", icon: User, description: "Your personal information", group: "account" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and display", group: "preferences" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push alerts", group: "preferences" },
  { id: "security", label: "Security", icon: Shield, description: "Password and 2FA", group: "account" },
  { id: "integrations", label: "Integrations", icon: Plug, description: "Connected apps and API", group: "workspace" },
  { id: "team", label: "Team", icon: Users, description: "Manage team members", group: "workspace" },
  { id: "content", label: "Content Defaults", icon: FileText, description: "Posting preferences", group: "workspace" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Subscription and payments", group: "other" },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, description: "Delete account", group: "other" },
]

const groupLabels: Record<string, string> = {
  account: "Account",
  preferences: "Preferences",
  workspace: "Workspace",
  other: "Other",
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.group]) acc[section.group] = []
    acc[section.group].push(section)
    return acc
  }, {} as Record<string, typeof sections>)

  return (
    <aside className="w-72 border-r border-border bg-card shrink-0 hidden lg:flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Settings</h1>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {Object.entries(groupedSections).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {groupLabels[group]}
              </h3>
              <div className="space-y-1">
                {items.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  const isDanger = section.id === "danger"

                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionChange(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                        isActive
                          ? isDanger
                            ? "bg-red-500/10 text-red-600"
                            : "bg-primary/10 text-primary"
                          : isDanger
                          ? "text-red-600/70 hover:text-red-600 hover:bg-red-500/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 shrink-0",
                        isActive && !isDanger && "text-primary",
                        isDanger && "text-red-600"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive && !isDanger && "text-primary",
                          isDanger && "text-red-600"
                        )}>
                          {section.label}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive
                            ? isDanger
                              ? "text-red-600/70"
                              : "text-primary/70"
                            : "text-muted-foreground"
                        )}>
                          {section.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className={cn(
                          "w-4 h-4 shrink-0",
                          isDanger ? "text-red-600" : "text-primary"
                        )} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          SocialFlow v2.0.0
        </p>
      </div>
    </aside>
  )
}
