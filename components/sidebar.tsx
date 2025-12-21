"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  CalendarClock,
  Layers,
  Share2,
  Building2,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Inbox,
  Radio,
  Users,
  ImagePlus,
  Bot,
  Palette,
  FileBarChart,
  Swords,
  CreditCard,
  Zap,
  Crown,
  TrendingUp,
  CalendarDays,
  UserCheck,
  ClipboardCheck,
  FolderOpen,
  Target,
  FlaskConical,
  Rss,
  Megaphone,
  RefreshCw,
  Building,
  FileText,
  Puzzle,
  History,
  Code,
  Layout,
  Star,
  GripVertical,
  Pin,
  MoreHorizontal,
  ChevronsUpDown,
  Check,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: string | number
  badgeVariant?: "default" | "destructive" | "warning" | "success"
  isNew?: boolean
  isPro?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "Content",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: PenSquare, label: "Create Post", href: "/create-post" },
      { icon: FolderOpen, label: "Content Library", href: "/content-library", isNew: true },
      { icon: ImagePlus, label: "Media Studio", href: "/media-studio" },
      { icon: Bot, label: "AI Assistant", href: "/ai-assistant", isPro: true },
    ],
  },
  {
    title: "Planning",
    items: [
      { icon: Calendar, label: "Schedule", href: "/schedule" },
      { icon: CalendarDays, label: "Calendar", href: "/calendar" },
      { icon: CalendarClock, label: "Bulk Schedule", href: "/bulk-schedule" },
      { icon: Layers, label: "Templates", href: "/templates" },
      { icon: Palette, label: "Brand Kit", href: "/brand-kit" },
      { icon: Target, label: "Campaigns", href: "/campaigns", isNew: true },
      { icon: FlaskConical, label: "A/B Testing", href: "/ab-testing", isNew: true, isPro: true },
    ],
  },
  {
    title: "Automation",
    items: [
      { icon: Rss, label: "RSS Feeds", href: "/rss-feeds", isNew: true },
      { icon: RefreshCw, label: "Evergreen Content", href: "/evergreen-content", isNew: true },
    ],
  },
  {
    title: "Engagement",
    items: [
      { icon: Inbox, label: "Inbox", href: "/inbox", badge: 12, badgeVariant: "destructive" },
      { icon: Radio, label: "Social Listening", href: "/listening", isPro: true },
      { icon: Users, label: "Influencers", href: "/influencers" },
      { icon: Megaphone, label: "Employee Advocacy", href: "/employee-advocacy", isNew: true },
    ],
  },
  {
    title: "Management",
    items: [
      { icon: Share2, label: "Social Channels", href: "/channels" },
      { icon: Building2, label: "Workspaces", href: "/workspaces" },
      { icon: UserCheck, label: "Team", href: "/team" },
      { icon: ClipboardCheck, label: "Approvals", href: "/approval-queue", badge: 3, badgeVariant: "warning" },
      { icon: Building, label: "White Label", href: "/white-label", isNew: true, isPro: true },
    ],
  },
  {
    title: "Insights",
    items: [
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
      { icon: FileText, label: "Report Builder", href: "/report-builder", isNew: true },
      { icon: Swords, label: "Competitors", href: "/competitors", isPro: true },
      { icon: History, label: "Audit Log", href: "/audit-log", isNew: true },
    ],
  },
  {
    title: "Developer",
    items: [
      { icon: Puzzle, label: "Integrations", href: "/integrations", isNew: true },
      { icon: Code, label: "API & Webhooks", href: "/developers", isNew: true },
      { icon: Layout, label: "Widgets", href: "/widgets", isNew: true },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: CreditCard, label: "Billing", href: "/billing" },
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: HelpCircle, label: "Help Center", href: "/help" },
    ],
  },
]

// Get all menu items flattened for keyboard navigation
const getAllMenuItems = () => menuSections.flatMap(s => s.items)

// Workspaces data
interface Workspace {
  id: string
  name: string
  logo?: string
  plan: "free" | "pro" | "enterprise"
  role: "owner" | "admin" | "member"
}

const workspaces: Workspace[] = [
  { id: "1", name: "Acme Corporation", plan: "enterprise", role: "owner" },
  { id: "2", name: "Marketing Team", plan: "pro", role: "admin" },
  { id: "3", name: "Personal Brand", plan: "free", role: "owner" },
  { id: "4", name: "Client - TechStart", plan: "pro", role: "member" },
]

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const [isResizing, setIsResizing] = useState(false)
  const [pinnedItems, setPinnedItems] = useState<string[]>([])
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(workspaces[0])

  const pathname = usePathname()
  const sidebarRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)

  // Load persisted state
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    const savedWidth = localStorage.getItem("sidebar-width")
    const savedPinned = localStorage.getItem("sidebar-pinned")

    if (savedCollapsed !== null) setIsCollapsed(JSON.parse(savedCollapsed))
    if (savedWidth !== null) setSidebarWidth(JSON.parse(savedWidth))
    if (savedPinned !== null) setPinnedItems(JSON.parse(savedPinned))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navRef.current) return

      // Only handle if sidebar is focused
      if (!sidebarRef.current?.contains(document.activeElement)) return

      const allItems = getAllMenuItems()

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex(prev => Math.min(prev + 1, allItems.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex(prev => Math.max(prev - 1, 0))
          break
        case "Enter":
          if (focusedIndex >= 0 && focusedIndex < allItems.length) {
            window.location.href = allItems[focusedIndex].href
          }
          break
        case "Escape":
          setFocusedIndex(-1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex])

  // Resize handler
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.min(Math.max(200, e.clientX), 400)
      setSidebarWidth(newWidth)
      localStorage.setItem("sidebar-width", JSON.stringify(newWidth))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

  const toggleSection = (title: string) => {
    setCollapsedSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const togglePin = (href: string) => {
    setPinnedItems(prev => {
      const updated = prev.includes(href)
        ? prev.filter(p => p !== href)
        : [...prev, href]
      localStorage.setItem("sidebar-pinned", JSON.stringify(updated))
      return updated
    })
  }

  const getBadgeVariant = (variant?: string) => {
    switch (variant) {
      case "destructive":
        return "bg-destructive text-destructive-foreground"
      case "warning":
        return "bg-amber-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  // Get pinned menu items
  const pinnedMenuItems = getAllMenuItems().filter(item => pinnedItems.includes(item.href))

  // Filter items based on search
  const filterItems = (items: MenuItem[]) => {
    if (!searchQuery) return items
    return items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const renderMenuItem = (item: MenuItem, index: number, showContextMenu = true) => {
    const isActive = pathname === item.href
    const isPinned = pinnedItems.includes(item.href)
    const isFocused = focusedIndex === getAllMenuItems().findIndex(i => i.href === item.href)

    if (isCollapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center justify-center w-full p-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-sidebar-foreground hover:bg-muted/80 hover:scale-105",
                isFocused && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
              {/* Badge dot */}
              {(item.badge || item.isNew) && (
                <span className={cn(
                  "absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse",
                  item.badgeVariant === "destructive" ? "bg-destructive" :
                  item.badgeVariant === "warning" ? "bg-amber-500" :
                  item.isNew ? "bg-green-500" : "bg-primary"
                )} />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.label}</span>
            {item.badge && (
              <span className={cn("px-1.5 py-0.5 text-[10px] font-bold rounded", getBadgeVariant(item.badgeVariant))}>
                {item.badge}
              </span>
            )}
            {item.isNew && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-500 text-white rounded">NEW</span>}
            {item.isPro && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded">PRO</span>}
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <div key={item.href} className="group relative">
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center w-full gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 relative",
            isActive
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-sidebar-foreground hover:bg-muted/80",
            isFocused && "ring-2 ring-primary ring-offset-1 ring-offset-background"
          )}
        >
          {/* Active indicator line */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full transition-all" />
          )}

          <item.icon className={cn(
            "w-[18px] h-[18px] shrink-0 transition-all duration-200",
            isActive ? "text-primary" : "group-hover:text-primary group-hover:scale-110"
          )} />

          <span className="flex-1 truncate">{item.label}</span>

          {/* Badges */}
          <div className="flex items-center gap-1.5">
            {isPinned && (
              <Pin className="w-3 h-3 text-muted-foreground fill-muted-foreground" />
            )}
            {item.isNew && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md animate-pulse">
                NEW
              </span>
            )}
            {item.isPro && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5" />
                PRO
              </span>
            )}
            {item.badge && (
              <span className={cn(
                "min-w-[20px] h-[20px] flex items-center justify-center px-1.5 text-[10px] font-bold rounded-full transition-transform hover:scale-110",
                getBadgeVariant(item.badgeVariant),
                item.badgeVariant === "destructive" && "animate-pulse"
              )}>
                {item.badge}
              </span>
            )}
          </div>
        </Link>

        {/* Context menu on hover */}
        {showContextMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => togglePin(item.href)}>
                <Pin className={cn("w-4 h-4 mr-2", isPinned && "fill-current")} />
                {isPinned ? "Unpin from sidebar" : "Pin to sidebar"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(item.href, "_blank")}>
                <Layout className="w-4 h-4 mr-2" />
                Open in new tab
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        style={{ width: isCollapsed ? 72 : sidebarWidth }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300 ease-out",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
          isResizing && "transition-none"
        )}
      >
        {/* Resize handle */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className={cn(
              "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10 group",
              isResizing && "bg-primary"
            )}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Logo & Collapse */}
        <div className="flex items-center justify-between h-[60px] px-3 border-b border-sidebar-border shrink-0">
          <Link href="/" className={cn("flex items-center gap-2.5 group", isCollapsed && "justify-center w-full")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-primary/25 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[17px] font-bold text-sidebar-foreground tracking-tight truncate">
                  SocialFlow
                </span>
                <span className="text-[9px] font-medium text-muted-foreground -mt-0.5">
                  Enterprise Suite
                </span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-muted transition-all hover:scale-105"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-muted transition-all hover:scale-105"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Collapse sidebar</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border shrink-0 hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="w-full p-2 rounded-xl hover:bg-sidebar-accent text-sidebar-muted transition-all flex items-center justify-center hover:scale-105"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Workspace Selector */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {selectedWorkspace.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {selectedWorkspace.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {selectedWorkspace.plan} • {selectedWorkspace.role}
                    </p>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Workspaces
                </div>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{workspace.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {workspace.plan} • {workspace.role}
                        </p>
                      </div>
                      {selectedWorkspace.id === workspace.id && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workspace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Workspaces
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Collapsed Workspace Selector */}
        {isCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="w-full p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all flex items-center justify-center hover:scale-105"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {selectedWorkspace.name.charAt(0)}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-semibold">{selectedWorkspace.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedWorkspace.plan}</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-64">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Workspaces
                </div>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{workspace.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {workspace.plan} • {workspace.role}
                        </p>
                      </div>
                      {selectedWorkspace.id === workspace.id && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workspace
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}


        {/* Navigation */}
        <nav ref={navRef} className="flex-1 px-3 pb-3 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {/* Pinned Items */}
          {pinnedMenuItems.length > 0 && !searchQuery && (
            <div className="mb-4 mt-1">
              {!isCollapsed && (
                <div className="flex items-center gap-2 px-3 mb-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-widest">
                    Pinned
                  </p>
                </div>
              )}
              <div className={cn("space-y-0.5", isCollapsed && "space-y-1")}>
                {pinnedMenuItems.map((item, idx) => renderMenuItem(item, idx, false))}
              </div>
            </div>
          )}


          {/* Main Navigation */}
          {menuSections.map((section, sectionIndex) => {
            const isSectionCollapsed = collapsedSections.includes(section.title)
            const filteredItems = filterItems(section.items)

            if (searchQuery && filteredItems.length === 0) return null

            return (
              <div key={section.title} className={cn("mb-3", sectionIndex === 0 && !pinnedMenuItems.length && "mt-1")}>
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-3 mb-1.5 group"
                    aria-label={`Toggle ${section.title} section`}
                  >
                    <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-widest">
                      {section.title}
                    </p>
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 text-sidebar-muted opacity-0 group-hover:opacity-100 transition-all duration-200",
                        !isSectionCollapsed && "rotate-90"
                      )}
                    />
                  </button>
                )}

                {isCollapsed && sectionIndex > 0 && (
                  <div className="h-px bg-sidebar-border mx-2 mb-2" />
                )}

                <div
                  className={cn(
                    "space-y-0.5 overflow-hidden transition-all duration-200",
                    isCollapsed && "space-y-1",
                    isSectionCollapsed && !isCollapsed && "max-h-0 opacity-0",
                    (!isSectionCollapsed || isCollapsed) && "max-h-[500px] opacity-100"
                  )}
                >
                  {filteredItems.map((item, idx) => renderMenuItem(item, idx))}
                </div>
              </div>
            )
          })}

        </nav>


        {/* Upgrade Card */}
        {!isCollapsed && (
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-sm font-semibold text-foreground truncate">Pro Plan</p>
              </div>
              <Link href="/billing">
                <Button size="sm" className="h-7 px-3 text-[11px] font-semibold rounded-lg">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Collapsed Upgrade */}
        {isCollapsed && (
          <div className="px-3 pb-3 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/billing">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center hover:bg-primary/15 hover:scale-105 transition-all">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Upgrade to Pro</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* User Profile */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-full p-2 rounded-xl hover:bg-muted/60 transition-all cursor-pointer hover:scale-105"
                >
                  <Avatar className="w-9 h-9 border-2 border-primary/20 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <AvatarImage src="/professional-man-portrait.png" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      AS
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <div className="px-2 py-2 border-b border-border">
                  <p className="text-sm font-semibold">Ali Smith</p>
                  <p className="text-xs text-muted-foreground">ali@socialflow.io</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Plans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/team" className="cursor-pointer">
                    <Users className="w-4 h-4 mr-2" />
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-muted/60 transition-all cursor-pointer group hover:scale-[1.01]"
                >
                  <Avatar className="w-10 h-10 border-2 border-primary/20 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    <AvatarImage src="/professional-man-portrait.png" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        Ali Smith
                      </p>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/15 text-primary rounded-md">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      ali@socialflow.io
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-hover:rotate-180 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Plans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/team" className="cursor-pointer">
                    <Users className="w-4 h-4 mr-2" />
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="cursor-pointer">
                    <Building2 className="w-4 h-4 mr-2" />
                    Switch Workspace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
