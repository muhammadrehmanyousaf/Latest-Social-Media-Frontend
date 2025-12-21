"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  CalendarRange,
  FileText,
  Share2,
  BarChart3,
  Settings,
  HelpCircle,
  CreditCard,
  Users,
  Inbox,
  Bot,
  Ear,
  UserSearch,
  ImagePlus,
  Palette,
  FileBarChart,
  Target,
  Search,
  Plus,
  Clock,
  Send,
  Sparkles,
  Moon,
  Sun,
  Bell,
  LogOut,
  User,
  Keyboard,
  Zap,
  Hash,
  Link,
  TrendingUp,
  MessageCircle,
  Star,
  Folder,
  Image,
  Video,
  Globe,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CommandAction {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  keywords?: string[]
  category: string
  badge?: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  // Navigation Actions
  const navigationActions: CommandAction[] = [
    { id: "dashboard", label: "Go to Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, shortcut: "G D", action: () => router.push("/"), keywords: ["home", "overview"], category: "Navigation" },
    { id: "create-post", label: "Go to Create Post", icon: <PenSquare className="h-4 w-4" />, shortcut: "G C", action: () => router.push("/create-post"), keywords: ["new", "write", "compose"], category: "Navigation" },
    { id: "schedule", label: "Go to Schedule", icon: <Calendar className="h-4 w-4" />, shortcut: "G S", action: () => router.push("/schedule"), keywords: ["calendar", "plan"], category: "Navigation" },
    { id: "bulk-schedule", label: "Go to Bulk Schedule", icon: <CalendarRange className="h-4 w-4" />, action: () => router.push("/bulk-schedule"), keywords: ["mass", "multiple"], category: "Navigation" },
    { id: "templates", label: "Go to Templates", icon: <FileText className="h-4 w-4" />, shortcut: "G T", action: () => router.push("/templates"), keywords: ["saved", "reusable"], category: "Navigation" },
    { id: "channels", label: "Go to Social Channels", icon: <Share2 className="h-4 w-4" />, action: () => router.push("/channels"), keywords: ["accounts", "connect"], category: "Navigation" },
    { id: "analytics", label: "Go to Analytics", icon: <BarChart3 className="h-4 w-4" />, shortcut: "G A", action: () => router.push("/analytics"), keywords: ["stats", "metrics", "data"], category: "Navigation" },
    { id: "inbox", label: "Go to Inbox", icon: <Inbox className="h-4 w-4" />, shortcut: "G I", action: () => router.push("/inbox"), keywords: ["messages", "dm", "comments"], category: "Navigation" },
    { id: "ai-assistant", label: "Go to AI Assistant", icon: <Bot className="h-4 w-4" />, action: () => router.push("/ai-assistant"), keywords: ["generate", "write", "help"], category: "Navigation", badge: "AI" },
    { id: "listening", label: "Go to Social Listening", icon: <Ear className="h-4 w-4" />, action: () => router.push("/listening"), keywords: ["monitor", "mentions", "brand"], category: "Navigation" },
    { id: "influencers", label: "Go to Influencer Discovery", icon: <UserSearch className="h-4 w-4" />, action: () => router.push("/influencers"), keywords: ["creators", "partners"], category: "Navigation" },
    { id: "media-studio", label: "Go to Media Studio", icon: <ImagePlus className="h-4 w-4" />, action: () => router.push("/media-studio"), keywords: ["edit", "images", "videos"], category: "Navigation" },
    { id: "brand-kit", label: "Go to Brand Kit", icon: <Palette className="h-4 w-4" />, action: () => router.push("/brand-kit"), keywords: ["colors", "fonts", "logo"], category: "Navigation" },
    { id: "reports", label: "Go to Reports Builder", icon: <FileBarChart className="h-4 w-4" />, action: () => router.push("/reports"), keywords: ["export", "pdf"], category: "Navigation" },
    { id: "competitors", label: "Go to Competitors", icon: <Target className="h-4 w-4" />, action: () => router.push("/competitors"), keywords: ["analysis", "benchmark"], category: "Navigation" },
    { id: "workspaces", label: "Go to Workspaces", icon: <Users className="h-4 w-4" />, action: () => router.push("/workspaces"), keywords: ["team", "projects"], category: "Navigation" },
    { id: "settings", label: "Go to Settings", icon: <Settings className="h-4 w-4" />, shortcut: "G ,", action: () => router.push("/settings"), keywords: ["preferences", "config"], category: "Navigation" },
    { id: "billing", label: "Go to Billing", icon: <CreditCard className="h-4 w-4" />, action: () => router.push("/billing"), keywords: ["subscription", "payment", "plan"], category: "Navigation" },
    { id: "help", label: "Go to Help Center", icon: <HelpCircle className="h-4 w-4" />, shortcut: "?", action: () => router.push("/help"), keywords: ["support", "docs", "faq"], category: "Navigation" },
  ]

  // Quick Actions
  const quickActions: CommandAction[] = [
    { id: "new-post", label: "Create New Post", icon: <Plus className="h-4 w-4" />, shortcut: "N", action: () => router.push("/create-post"), keywords: ["add", "write", "compose"], category: "Quick Actions" },
    { id: "schedule-post", label: "Schedule a Post", icon: <Clock className="h-4 w-4" />, action: () => router.push("/schedule"), keywords: ["plan", "later"], category: "Quick Actions" },
    { id: "send-now", label: "Publish Post Now", icon: <Send className="h-4 w-4" />, action: () => router.push("/create-post"), keywords: ["post", "share"], category: "Quick Actions" },
    { id: "ai-generate", label: "Generate with AI", icon: <Sparkles className="h-4 w-4" />, action: () => router.push("/ai-assistant"), keywords: ["write", "create", "magic"], category: "Quick Actions", badge: "AI" },
    { id: "hashtag-gen", label: "Generate Hashtags", icon: <Hash className="h-4 w-4" />, action: () => router.push("/ai-assistant"), keywords: ["tags"], category: "Quick Actions", badge: "AI" },
    { id: "shorten-link", label: "Shorten Link", icon: <Link className="h-4 w-4" />, action: () => router.push("/create-post"), keywords: ["url", "utm"], category: "Quick Actions" },
    { id: "best-time", label: "Find Best Time to Post", icon: <TrendingUp className="h-4 w-4" />, action: () => router.push("/analytics"), keywords: ["optimal", "when"], category: "Quick Actions", badge: "AI" },
    { id: "new-template", label: "Create Template", icon: <FileText className="h-4 w-4" />, action: () => router.push("/templates"), keywords: ["save", "reuse"], category: "Quick Actions" },
    { id: "upload-media", label: "Upload Media", icon: <Image className="h-4 w-4" />, action: () => router.push("/media-studio"), keywords: ["image", "video", "photo"], category: "Quick Actions" },
    { id: "add-competitor", label: "Track Competitor", icon: <Target className="h-4 w-4" />, action: () => router.push("/competitors"), keywords: ["monitor", "add"], category: "Quick Actions" },
    { id: "create-report", label: "Create Report", icon: <FileBarChart className="h-4 w-4" />, action: () => router.push("/reports"), keywords: ["export", "pdf"], category: "Quick Actions" },
    { id: "invite-team", label: "Invite Team Member", icon: <Users className="h-4 w-4" />, action: () => router.push("/settings"), keywords: ["add", "member"], category: "Quick Actions" },
  ]

  // Search specific items (mock data)
  const recentItems: CommandAction[] = [
    { id: "recent-1", label: "Summer Campaign Post", icon: <FileText className="h-4 w-4" />, action: () => router.push("/create-post"), keywords: [], category: "Recent", badge: "Draft" },
    { id: "recent-2", label: "Product Launch Announcement", icon: <Send className="h-4 w-4" />, action: () => router.push("/schedule"), keywords: [], category: "Recent", badge: "Scheduled" },
    { id: "recent-3", label: "Monthly Analytics Report", icon: <BarChart3 className="h-4 w-4" />, action: () => router.push("/reports"), keywords: [], category: "Recent" },
  ]

  const handleSelect = (action: CommandAction) => {
    action.action()
    onOpenChange(false)
    setSearchQuery("")
  }

  // Filter based on search
  const filterActions = (actions: CommandAction[]) => {
    if (!searchQuery) return actions
    const query = searchQuery.toLowerCase()
    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(query) ||
        action.keywords?.some((k) => k.toLowerCase().includes(query))
    )
  }

  const filteredNavigation = filterActions(navigationActions)
  const filteredQuickActions = filterActions(quickActions)
  const filteredRecent = filterActions(recentItems)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No results found.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for pages, actions, or content
            </p>
          </div>
        </CommandEmpty>

        {/* Recent */}
        {filteredRecent.length > 0 && !searchQuery && (
          <>
            <CommandGroup heading="Recent">
              {filteredRecent.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleSelect(action)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                    {action.icon}
                  </div>
                  <span className="flex-1">{action.label}</span>
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Quick Actions */}
        {filteredQuickActions.length > 0 && (
          <>
            <CommandGroup heading="Quick Actions">
              {filteredQuickActions.slice(0, searchQuery ? 10 : 6).map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleSelect(action)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <span className="flex-1">{action.label}</span>
                  {action.badge && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      {action.badge}
                    </Badge>
                  )}
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavigation.map((action) => (
              <CommandItem
                key={action.id}
                onSelect={() => handleSelect(action)}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                  {action.icon}
                </div>
                <span className="flex-1">{action.label}</span>
                {action.badge && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    {action.badge}
                  </Badge>
                )}
                {action.shortcut && (
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      {/* Footer */}
      <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Esc</kbd>
            Close
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>Powered by SocialFlow</span>
        </div>
      </div>
    </CommandDialog>
  )
}

// Global keyboard shortcut hook
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      // Also support "/" for quick search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault()
          setOpen(true)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}
