"use client"

import { useState } from "react"
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
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  PanelLeftClose,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: PenSquare, label: "Create Post", href: "/create-post" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: CalendarClock, label: "Bulk Schedule", href: "/bulk-schedule" },
  { icon: Layers, label: "Templates", href: "/templates" },
  { icon: Share2, label: "Social Channels", href: "/social-channels" },
]

const moreMenuItems = [
  { icon: Building2, label: "Workspaces", href: "/workspaces" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
]

const generalMenuItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help Center", href: "/help" },
]

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card border border-border shadow-sm"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border w-[260px] h-screen transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo & Collapse */}
        <div className="flex items-center justify-between h-[60px] px-5 border-b border-sidebar-border shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[17px] font-semibold text-sidebar-foreground tracking-tight">SocialFlow</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-muted transition-colors">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-muted" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/60 border-0 text-sm placeholder:text-sidebar-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="flex-1 px-3 pb-4 overflow-y-auto scrollbar-none">
          {/* Main Menu */}
          <div className="mb-6">
            <p className="px-3 mb-2 text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest">
              Main Menu
            </p>
            <div className="space-y-0.5">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-muted/60",
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] shrink-0", pathname === item.href && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* More */}
          <div className="mb-6">
            <p className="px-3 mb-2 text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest">More</p>
            <div className="space-y-0.5">
              {moreMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-muted/60",
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] shrink-0", pathname === item.href && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* General */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest">General</p>
            <div className="space-y-0.5">
              {generalMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-muted/60",
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] shrink-0", pathname === item.href && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-destructive hover:bg-destructive/10 transition-all duration-200">
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Upgrade Plan Card */}
        <div className="px-3 pb-3 shrink-0">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50">
            <p className="text-sm font-semibold text-foreground">Starter Plan</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Upgrade now to boost performance with enhanced features.
            </p>
            <Button className="w-full mt-4 h-9 text-[13px] font-semibold rounded-xl shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src="/professional-man-avatar.png" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">Nanda</p>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-md">
                  Admin
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">nanda@example.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
          {/* Profile Completion */}
          <div className="mt-3 px-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[64%] bg-gradient-to-r from-primary to-primary/70 rounded-full" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">64%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Complete your profile</p>
          </div>
        </div>
      </aside>
    </>
  )
}
