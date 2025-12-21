"use client"

import { useState } from "react"
import { usePageHeader } from "@/components/page-context"
import { Briefcase } from "lucide-react"
import { WorkspacesHeader } from "@/components/workspaces/workspaces-header"
import { WorkspacesGrid } from "@/components/workspaces/workspaces-grid"
import { WorkspaceDetails } from "@/components/workspaces/workspace-details"
import { CreateWorkspace } from "@/components/workspaces/create-workspace"
import { WorkspaceSettings } from "@/components/workspaces/workspace-settings"
import { UpgradePrompt } from "@/components/workspaces/upgrade-prompt"

export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer"
export type WorkspaceStatus = "active" | "archived" | "suspended"
export type ViewMode = "grid" | "list"

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: WorkspaceRole
  joinedAt: Date
  lastActive: Date
}

export interface WorkspaceChannel {
  id: string
  platform: string
  username: string
  profileImage?: string
  followers: number
}

export interface Workspace {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  status: WorkspaceStatus
  createdAt: Date
  updatedAt: Date
  ownerId: string
  members: WorkspaceMember[]
  channels: WorkspaceChannel[]
  stats: {
    totalPosts: number
    scheduledPosts: number
    drafts: number
    engagement: number
    reach: number
    followers: number
  }
  settings: {
    defaultTimezone: string
    brandColor: string
    logo?: string
    isPublic: boolean
  }
}

export interface SubscriptionLimits {
  workspaceLimit: number // -1 for unlimited
  currentWorkspaces: number
  planName: string
  planTier: "free" | "pro" | "business" | "enterprise"
}

// Mock subscription data (would come from billing context in real app)
const mockSubscriptionLimits: SubscriptionLimits = {
  workspaceLimit: 3,
  currentWorkspaces: 2,
  planName: "Pro",
  planTier: "pro",
}

// Mock workspaces
const mockWorkspaces: Workspace[] = [
  {
    id: "ws_1",
    name: "Marketing Team",
    description: "Central hub for all marketing campaigns and social media management",
    icon: "megaphone",
    color: "#f97316",
    status: "active",
    createdAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 10, 20),
    ownerId: "user_1",
    members: [
      {
        id: "user_1",
        name: "Alex Johnson",
        email: "alex@socialflow.io",
        avatar: "/avatars/alex.jpg",
        role: "owner",
        joinedAt: new Date(2024, 3, 15),
        lastActive: new Date(),
      },
      {
        id: "user_2",
        name: "Sarah Chen",
        email: "sarah@socialflow.io",
        avatar: "/avatars/sarah.jpg",
        role: "admin",
        joinedAt: new Date(2024, 4, 1),
        lastActive: new Date(Date.now() - 3600000),
      },
      {
        id: "user_3",
        name: "Mike Wilson",
        email: "mike@socialflow.io",
        role: "editor",
        joinedAt: new Date(2024, 5, 10),
        lastActive: new Date(Date.now() - 86400000),
      },
    ],
    channels: [
      { id: "ch_1", platform: "instagram", username: "marketing_team", followers: 125000 },
      { id: "ch_2", platform: "twitter", username: "marketing_official", followers: 89000 },
      { id: "ch_3", platform: "linkedin", username: "marketing-company", followers: 45000 },
    ],
    stats: {
      totalPosts: 1247,
      scheduledPosts: 32,
      drafts: 8,
      engagement: 4.2,
      reach: 2500000,
      followers: 259000,
    },
    settings: {
      defaultTimezone: "America/New_York",
      brandColor: "#f97316",
      isPublic: false,
    },
  },
  {
    id: "ws_2",
    name: "Product Launch",
    description: "Dedicated workspace for our Q4 product launch campaign",
    icon: "rocket",
    color: "#8b5cf6",
    status: "active",
    createdAt: new Date(2024, 8, 1),
    updatedAt: new Date(2024, 10, 18),
    ownerId: "user_1",
    members: [
      {
        id: "user_1",
        name: "Alex Johnson",
        email: "alex@socialflow.io",
        avatar: "/avatars/alex.jpg",
        role: "owner",
        joinedAt: new Date(2024, 8, 1),
        lastActive: new Date(),
      },
      {
        id: "user_4",
        name: "Emma Davis",
        email: "emma@socialflow.io",
        role: "editor",
        joinedAt: new Date(2024, 8, 5),
        lastActive: new Date(Date.now() - 7200000),
      },
    ],
    channels: [
      { id: "ch_4", platform: "instagram", username: "product_launch", followers: 15000 },
      { id: "ch_5", platform: "tiktok", username: "productlaunch", followers: 8500 },
    ],
    stats: {
      totalPosts: 89,
      scheduledPosts: 15,
      drafts: 12,
      engagement: 6.8,
      reach: 450000,
      followers: 23500,
    },
    settings: {
      defaultTimezone: "America/Los_Angeles",
      brandColor: "#8b5cf6",
      isPublic: false,
    },
  },
]

export default function WorkspacesPage() {
  usePageHeader({
    title: "Workspaces",
    subtitle: "Organize your accounts",
    icon: Briefcase,
  })

  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces)
  const [subscriptionLimits] = useState<SubscriptionLimits>(mockSubscriptionLimits)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkspaceStatus | "all">("all")
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Check if user can create more workspaces
  const canCreateWorkspace =
    subscriptionLimits.workspaceLimit === -1 ||
    workspaces.length < subscriptionLimits.workspaceLimit

  const remainingWorkspaces =
    subscriptionLimits.workspaceLimit === -1
      ? -1
      : subscriptionLimits.workspaceLimit - workspaces.length

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ws.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats for header
  const stats = {
    total: workspaces.length,
    active: workspaces.filter((ws) => ws.status === "active").length,
    totalMembers: workspaces.reduce((sum, ws) => sum + ws.members.length, 0),
    totalChannels: workspaces.reduce((sum, ws) => sum + ws.channels.length, 0),
  }

  const handleCreateWorkspace = () => {
    if (canCreateWorkspace) {
      setShowCreateModal(true)
    } else {
      setShowUpgradePrompt(true)
    }
  }

  const handleWorkspaceCreate = (workspace: Omit<Workspace, "id" | "createdAt" | "updatedAt" | "ownerId" | "members" | "channels" | "stats">) => {
    const newWorkspace: Workspace = {
      ...workspace,
      id: `ws_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: "user_1",
      members: [
        {
          id: "user_1",
          name: "Alex Johnson",
          email: "alex@socialflow.io",
          avatar: "/avatars/alex.jpg",
          role: "owner",
          joinedAt: new Date(),
          lastActive: new Date(),
        },
      ],
      channels: [],
      stats: {
        totalPosts: 0,
        scheduledPosts: 0,
        drafts: 0,
        engagement: 0,
        reach: 0,
        followers: 0,
      },
    }
    setWorkspaces((prev) => [...prev, newWorkspace])
    setShowCreateModal(false)
  }

  const handleWorkspaceUpdate = (updatedWorkspace: Workspace) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updatedWorkspace.id ? updatedWorkspace : ws))
    )
    setSelectedWorkspace(updatedWorkspace)
  }

  const handleWorkspaceDelete = (workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId))
    setSelectedWorkspace(null)
    setShowSettingsModal(false)
  }

  const handleWorkspaceArchive = (workspaceId: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, status: ws.status === "archived" ? "active" : "archived" as WorkspaceStatus, updatedAt: new Date() }
          : ws
      )
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
        <WorkspacesHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateWorkspace={handleCreateWorkspace}
          stats={stats}
          subscriptionLimits={subscriptionLimits}
          canCreateWorkspace={canCreateWorkspace}
          remainingWorkspaces={remainingWorkspaces}
        />

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <WorkspacesGrid
            workspaces={filteredWorkspaces}
            viewMode={viewMode}
            onSelectWorkspace={setSelectedWorkspace}
            onSettingsClick={(ws) => {
              setSelectedWorkspace(ws)
              setShowSettingsModal(true)
            }}
            onArchiveClick={handleWorkspaceArchive}
          />
        </div>

      {/* Workspace Details Modal */}
      {selectedWorkspace && !showSettingsModal && (
        <WorkspaceDetails
          workspace={selectedWorkspace}
          onClose={() => setSelectedWorkspace(null)}
          onSettings={() => setShowSettingsModal(true)}
          onArchive={() => handleWorkspaceArchive(selectedWorkspace.id)}
        />
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspace
          onClose={() => setShowCreateModal(false)}
          onCreate={handleWorkspaceCreate}
          remainingWorkspaces={remainingWorkspaces}
        />
      )}

      {/* Workspace Settings Modal */}
      {showSettingsModal && selectedWorkspace && (
        <WorkspaceSettings
          workspace={selectedWorkspace}
          onClose={() => {
            setShowSettingsModal(false)
            setSelectedWorkspace(null)
          }}
          onUpdate={handleWorkspaceUpdate}
          onDelete={handleWorkspaceDelete}
        />
      )}

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <UpgradePrompt
          currentPlan={subscriptionLimits.planName}
          workspaceLimit={subscriptionLimits.workspaceLimit}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  )
}
