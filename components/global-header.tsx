"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  Sparkles,
  Calendar,
  HelpCircle,
  LogOut,
  User,
  CreditCard,
  Command,
  ChevronRight,
  Moon,
  Sun,
  Keyboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePageContext } from "@/components/page-context"
import { useCommandPalette } from "@/components/command-palette"
import { useTheme } from "next-themes"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: "success" | "warning" | "info" | "error"
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: "1", title: "New milestone reached!", description: "125K followers on Instagram", time: "30m ago", type: "success", read: false },
  { id: "2", title: "Post published", description: "Your carousel post is live", time: "1h ago", type: "info", read: false },
  { id: "3", title: "Engagement spike", description: "+150% likes in last hour", time: "2h ago", type: "success", read: false },
  { id: "4", title: "Scheduled post ready", description: "Review before publishing", time: "3h ago", type: "warning", read: true },
  { id: "5", title: "Weekly report ready", description: "View your performance summary", time: "5h ago", type: "info", read: true },
]

export function GlobalHeader() {
  const { title, icon: PageIcon, subtitle, actions, breadcrumbs } = usePageContext()
  const { setOpen: setCommandPaletteOpen } = useCommandPalette()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-green-500"
      case "warning": return "bg-amber-500"
      case "error": return "bg-red-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left Section - Module Name */}
        <div className="flex items-center gap-3 min-w-0">
          {breadcrumbs.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
                </span>
              ))}
            </nav>
          )}

          {!breadcrumbs.length && (
            <div className="flex items-center gap-2 min-w-0">
              {PageIcon && (
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PageIcon className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {title || "Dashboard"}
                </h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>
          )}

          {actions.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-border">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.onClick}
                  className={cn("h-8 gap-1.5", action.className)}
                >
                  {action.icon && <action.icon className="w-3.5 h-3.5" />}
                  <span className="hidden xl:inline">{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Global Actions */}
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex h-8 gap-2 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Search className="w-4 h-4" />
                <span className="text-xs hidden md:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 h-5 text-[10px] font-medium bg-muted rounded border border-border">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Search & Commands</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex h-8 gap-1.5 px-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-medium">AI</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>AI Assistant</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Toggle theme</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8">
                <Keyboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Keyboard shortcuts</p></TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Notifications</h4>
                  {unreadCount > 0 && <Badge variant="secondary" className="text-[10px] h-5">{unreadCount} new</Badge>}
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={markAllAsRead}>Mark all read</Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-3 w-full">
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", getNotificationColor(notif.type), notif.read && "opacity-40")} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm text-foreground", !notif.read && "font-medium")}>{notif.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{notif.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 text-center text-sm text-primary cursor-pointer justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Help & Support</p></TooltipContent>
          </Tooltip>

          <div className="hidden md:block w-px h-6 bg-border mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 pl-1.5 pr-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px]">AJ</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-foreground leading-none">Alex Johnson</p>
                  <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Pro Plan</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Alex Johnson</p>
                    <p className="text-xs text-muted-foreground">alex@company.com</p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings"><User className="w-4 h-4 mr-2" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings"><Settings className="w-4 h-4 mr-2" />Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/billing"><CreditCard className="w-4 h-4 mr-2" />Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/schedule"><Calendar className="w-4 h-4 mr-2" />Schedule</Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10">
                  <LogOut className="w-4 h-4 mr-2" />Log out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
