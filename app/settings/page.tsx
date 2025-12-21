"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Settings } from "lucide-react"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { TeamSettings } from "@/components/settings/team-settings"
import { ContentSettings } from "@/components/settings/content-settings"
import { BillingSettings } from "@/components/settings/billing-settings"
import { DangerZone } from "@/components/settings/danger-zone"

export type SettingsSection =
  | "profile"
  | "appearance"
  | "notifications"
  | "security"
  | "integrations"
  | "team"
  | "content"
  | "billing"
  | "danger"

export type Theme = "light" | "dark" | "system"
export type Language = "en" | "es" | "fr" | "de" | "pt" | "ja" | "zh"

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  company?: string
  website?: string
  timezone: string
  language: Language
  createdAt: Date
}

export interface NotificationPreferences {
  email: {
    marketing: boolean
    productUpdates: boolean
    securityAlerts: boolean
    weeklyDigest: boolean
    teamActivity: boolean
    postPublished: boolean
    commentsMentions: boolean
    scheduledReminders: boolean
  }
  push: {
    enabled: boolean
    postPublished: boolean
    commentsMentions: boolean
    teamActivity: boolean
    scheduledReminders: boolean
  }
  inApp: {
    enabled: boolean
    showBadges: boolean
    playSound: boolean
  }
}

export interface SecurityPreferences {
  twoFactorEnabled: boolean
  twoFactorMethod: "app" | "sms" | "email"
  sessionTimeout: number // minutes
  trustedDevices: {
    id: string
    name: string
    browser: string
    location: string
    lastActive: Date
    isCurrent: boolean
  }[]
  loginHistory: {
    id: string
    device: string
    browser: string
    location: string
    ip: string
    timestamp: Date
    success: boolean
  }[]
}

export interface ConnectedIntegration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  connectedAt?: Date
  status: "active" | "error" | "expired"
  permissions: string[]
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed?: Date
  permissions: string[]
  isActive: boolean
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "editor" | "viewer"
  status: "active" | "pending" | "inactive"
  joinedAt: Date
  lastActive: Date
}

export interface ContentDefaults {
  defaultHashtags: string[]
  hashtagGroups: { name: string; hashtags: string[] }[]
  signatureEnabled: boolean
  signature: string
  autoSaveInterval: number // seconds
  defaultScheduleTime: string // HH:mm
  defaultTimezone: string
  watermarkEnabled: boolean
  watermarkPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  watermarkOpacity: number
}

// Mock Data
const mockProfile: UserProfile = {
  id: "user_1",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex@socialflow.io",
  phone: "+1 (555) 123-4567",
  avatar: "/avatars/alex.jpg",
  bio: "Social media manager passionate about creating engaging content and building communities.",
  company: "SocialFlow Inc.",
  website: "https://alexjohnson.com",
  timezone: "America/New_York",
  language: "en",
  createdAt: new Date(2024, 0, 15),
}

const mockNotifications: NotificationPreferences = {
  email: {
    marketing: false,
    productUpdates: true,
    securityAlerts: true,
    weeklyDigest: true,
    teamActivity: true,
    postPublished: true,
    commentsMentions: true,
    scheduledReminders: true,
  },
  push: {
    enabled: true,
    postPublished: true,
    commentsMentions: true,
    teamActivity: false,
    scheduledReminders: true,
  },
  inApp: {
    enabled: true,
    showBadges: true,
    playSound: false,
  },
}

const mockSecurity: SecurityPreferences = {
  twoFactorEnabled: true,
  twoFactorMethod: "app",
  sessionTimeout: 60,
  trustedDevices: [
    {
      id: "device_1",
      name: "MacBook Pro",
      browser: "Chrome 120",
      location: "New York, US",
      lastActive: new Date(),
      isCurrent: true,
    },
    {
      id: "device_2",
      name: "iPhone 15 Pro",
      browser: "Safari Mobile",
      location: "New York, US",
      lastActive: new Date(Date.now() - 3600000),
      isCurrent: false,
    },
    {
      id: "device_3",
      name: "Windows PC",
      browser: "Firefox 121",
      location: "Boston, US",
      lastActive: new Date(Date.now() - 86400000 * 3),
      isCurrent: false,
    },
  ],
  loginHistory: [
    { id: "log_1", device: "MacBook Pro", browser: "Chrome 120", location: "New York, US", ip: "192.168.1.1", timestamp: new Date(), success: true },
    { id: "log_2", device: "iPhone 15 Pro", browser: "Safari Mobile", location: "New York, US", ip: "192.168.1.2", timestamp: new Date(Date.now() - 3600000), success: true },
    { id: "log_3", device: "Unknown", browser: "Chrome 119", location: "Unknown", ip: "45.33.32.156", timestamp: new Date(Date.now() - 86400000), success: false },
    { id: "log_4", device: "Windows PC", browser: "Firefox 121", location: "Boston, US", ip: "192.168.1.3", timestamp: new Date(Date.now() - 86400000 * 3), success: true },
  ],
}

const mockIntegrations: ConnectedIntegration[] = [
  { id: "int_1", name: "Google Analytics", description: "Track website traffic from social posts", icon: "analytics", connected: true, connectedAt: new Date(2024, 5, 1), status: "active", permissions: ["read:analytics"] },
  { id: "int_2", name: "Canva", description: "Create and import designs directly", icon: "canva", connected: true, connectedAt: new Date(2024, 6, 15), status: "active", permissions: ["read:designs", "write:designs"] },
  { id: "int_3", name: "Dropbox", description: "Access and upload media files", icon: "dropbox", connected: false, status: "active", permissions: [] },
  { id: "int_4", name: "Google Drive", description: "Import files from your Drive", icon: "drive", connected: true, connectedAt: new Date(2024, 4, 20), status: "active", permissions: ["read:files"] },
  { id: "int_5", name: "Slack", description: "Get notifications in Slack", icon: "slack", connected: true, connectedAt: new Date(2024, 7, 1), status: "error", permissions: ["write:messages"] },
  { id: "int_6", name: "Zapier", description: "Automate workflows with Zapier", icon: "zapier", connected: false, status: "active", permissions: [] },
]

const mockApiKeys: ApiKey[] = [
  { id: "key_1", name: "Production API Key", key: "sk_live_***********************1234", createdAt: new Date(2024, 3, 1), lastUsed: new Date(), permissions: ["read", "write"], isActive: true },
  { id: "key_2", name: "Development Key", key: "sk_test_***********************5678", createdAt: new Date(2024, 6, 15), lastUsed: new Date(Date.now() - 86400000 * 7), permissions: ["read"], isActive: true },
  { id: "key_3", name: "Webhook Key", key: "whk_***********************9012", createdAt: new Date(2024, 8, 1), permissions: ["webhook"], isActive: false },
]

const mockTeamMembers: TeamMember[] = [
  { id: "user_1", name: "Alex Johnson", email: "alex@socialflow.io", avatar: "/avatars/alex.jpg", role: "owner", status: "active", joinedAt: new Date(2024, 0, 15), lastActive: new Date() },
  { id: "user_2", name: "Sarah Chen", email: "sarah@socialflow.io", avatar: "/avatars/sarah.jpg", role: "admin", status: "active", joinedAt: new Date(2024, 2, 1), lastActive: new Date(Date.now() - 3600000) },
  { id: "user_3", name: "Mike Wilson", email: "mike@socialflow.io", role: "editor", status: "active", joinedAt: new Date(2024, 4, 10), lastActive: new Date(Date.now() - 86400000) },
  { id: "user_4", name: "Emma Davis", email: "emma@socialflow.io", role: "editor", status: "pending", joinedAt: new Date(2024, 10, 1), lastActive: new Date(2024, 10, 1) },
  { id: "user_5", name: "John Smith", email: "john@example.com", role: "viewer", status: "inactive", joinedAt: new Date(2024, 5, 15), lastActive: new Date(2024, 8, 1) },
]

const mockContentDefaults: ContentDefaults = {
  defaultHashtags: ["socialflow", "socialmedia", "marketing"],
  hashtagGroups: [
    { name: "Marketing", hashtags: ["marketing", "digitalmarketing", "socialmediamarketing", "contentmarketing"] },
    { name: "Tech", hashtags: ["technology", "innovation", "startup", "tech"] },
    { name: "Lifestyle", hashtags: ["lifestyle", "motivation", "inspiration", "mindset"] },
  ],
  signatureEnabled: true,
  signature: "Posted via SocialFlow",
  autoSaveInterval: 30,
  defaultScheduleTime: "09:00",
  defaultTimezone: "America/New_York",
  watermarkEnabled: false,
  watermarkPosition: "bottom-right",
  watermarkOpacity: 50,
}

export default function SettingsPage() {
  usePageHeader({
    title: "Settings",
    subtitle: "Manage your account",
    icon: Settings,
  })

  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [theme, setTheme] = useState<Theme>("system")
  const [notifications, setNotifications] = useState<NotificationPreferences>(mockNotifications)
  const [security, setSecurity] = useState<SecurityPreferences>(mockSecurity)
  const [integrations, setIntegrations] = useState<ConnectedIntegration[]>(mockIntegrations)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [contentDefaults, setContentDefaults] = useState<ContentDefaults>(mockContentDefaults)

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings profile={profile} onUpdate={setProfile} />
      case "appearance":
        return <AppearanceSettings theme={theme} onThemeChange={setTheme} language={profile.language} onLanguageChange={(lang) => setProfile({ ...profile, language: lang })} />
      case "notifications":
        return <NotificationSettings preferences={notifications} onUpdate={setNotifications} />
      case "security":
        return <SecuritySettings preferences={security} onUpdate={setSecurity} />
      case "integrations":
        return <IntegrationSettings integrations={integrations} apiKeys={apiKeys} onIntegrationsUpdate={setIntegrations} onApiKeysUpdate={setApiKeys} />
      case "team":
        return <TeamSettings members={teamMembers} onUpdate={setTeamMembers} />
      case "content":
        return <ContentSettings defaults={contentDefaults} onUpdate={setContentDefaults} />
      case "billing":
        return <BillingSettings />
      case "danger":
        return <DangerZone />
      default:
        return <ProfileSettings profile={profile} onUpdate={setProfile} />
    }
  }

  return (
    <div className="flex-1 flex min-w-0">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
    </div>
  )
}
