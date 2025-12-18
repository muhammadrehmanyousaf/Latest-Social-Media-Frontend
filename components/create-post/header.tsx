"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sparkles, Clock, Send, ChevronDown, X } from "lucide-react"
import Link from "next/link"

interface CreatePostHeaderProps {
  selectedTags: string[]
}

export function CreatePostHeader({ selectedTags }: CreatePostHeaderProps) {
  return (
    <div className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Create Post</h1>
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-1">
              {selectedTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
              {selectedTags.length > 2 && (
                <span className="text-xs text-muted-foreground">+{selectedTags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground bg-transparent">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>

        <div className="h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Clock className="h-4 w-4" />
              Schedule
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Schedule for later</DropdownMenuItem>
            <DropdownMenuItem>Add to queue</DropdownMenuItem>
            <DropdownMenuItem>Save as draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
          <Send className="h-4 w-4" />
          Publish Now
        </Button>

        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
