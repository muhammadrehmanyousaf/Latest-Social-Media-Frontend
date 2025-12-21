"use client"

import { useState, useEffect } from "react"
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
  Bell,
  RefreshCw,
  Search,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Calendar,
  HelpCircle,
  LogOut,
  User,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DashboardHeaderProps {
  onRefresh: () => void
  refreshing: boolean
}

export function DashboardHeader({ onRefresh, refreshing }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [currentTime])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Greeting */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {greeting}, Alex
              </h1>
              <span className="text-xl">👋</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")} • Here's your social media overview
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl">
            <Search className="w-4 h-4" />
          </Button>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>

          {/* AI Assistant */}
          <Button variant="ghost" size="sm" className="hidden md:flex rounded-xl gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium">AI Assistant</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  5
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Notifications</h4>
                  <Badge variant="secondary" className="text-[10px]">5 new</Badge>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  { title: "New milestone reached!", desc: "125K followers on Instagram", time: "30m ago", type: "success" },
                  { title: "Post published", desc: "Your carousel post is live", time: "1h ago", type: "info" },
                  { title: "Engagement spike", desc: "+150% likes in last hour", time: "2h ago", type: "success" },
                  { title: "Scheduled post ready", desc: "Review before publishing", time: "3h ago", type: "warning" },
                  { title: "Weekly report ready", desc: "View your performance summary", time: "5h ago", type: "info" },
                ].map((notif, i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        notif.type === "success" && "bg-green-500",
                        notif.type === "warning" && "bg-amber-500",
                        notif.type === "info" && "bg-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
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

          {/* Help */}
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl">
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl gap-2 pl-2 pr-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">AJ</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">Alex Johnson</p>
                  <p className="text-[10px] text-muted-foreground">Pro Plan</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">alex@company.com</p>
              </div>
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
