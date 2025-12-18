"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Search, MessageSquare, MoreHorizontal, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  return (
    <header className="flex items-center justify-between h-[70px] px-5 lg:px-6 border-b border-border bg-card shrink-0">
      {/* Left side - Welcome message */}
      <div className="ml-12 lg:ml-0">
        <p className="text-xs text-muted-foreground font-medium">{today}</p>
        <h1 className="text-xl font-semibold text-foreground mt-0.5">Welcome Back, Ali!</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search - desktop only */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="h-10 pl-10 pr-14 w-52 lg:w-64 rounded-xl bg-muted/60 border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span>⌘</span>F
          </kbd>
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60"
          >
            <MessageSquare className="w-[18px] h-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 relative"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60"
          >
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </Button>
        </div>

        {/* User avatar - desktop */}
        <div className="hidden lg:flex items-center gap-3 pl-3 ml-1 border-l border-border">
          <Avatar className="w-9 h-9 border-2 border-muted">
            <AvatarImage src="/professional-man-portrait.png" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">AS</AvatarFallback>
          </Avatar>
          <div className="hidden xl:block">
            <p className="text-sm font-semibold text-foreground leading-tight">Ali Smith</p>
            <p className="text-xs text-muted-foreground">@alismith44</p>
          </div>
        </div>

        <Button asChild className="hidden sm:flex h-10 gap-2 px-4 ml-2 rounded-xl shadow-sm font-semibold text-[13px]">
          <Link href="/create-post">
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">New Post</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
