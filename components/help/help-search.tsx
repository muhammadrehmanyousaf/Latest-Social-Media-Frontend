"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Clock,
  Eye,
  ThumbsUp,
  ArrowRight,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { HelpArticle } from "@/app/help/page"

interface HelpSearchProps {
  value: string
  onChange: (value: string) => void
  results: HelpArticle[]
  isSearching: boolean
}

const popularSearches = [
  "connect instagram",
  "schedule posts",
  "analytics export",
  "team permissions",
  "billing",
  "failed posts",
]

const categoryColors: Record<string, string> = {
  "getting-started": "bg-blue-500/10 text-blue-600",
  "scheduling": "bg-purple-500/10 text-purple-600",
  "analytics": "bg-green-500/10 text-green-600",
  "channels": "bg-orange-500/10 text-orange-600",
  "team": "bg-indigo-500/10 text-indigo-600",
  "billing": "bg-pink-500/10 text-pink-600",
  "integrations": "bg-teal-500/10 text-teal-600",
  "troubleshooting": "bg-red-500/10 text-red-600",
}

export function HelpSearch({ value, onChange, results, isSearching }: HelpSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const showDropdown = isFocused && (value.length > 0 || results.length > 0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div
        className={cn(
          "relative rounded-2xl transition-all duration-200",
          isFocused
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
            : "shadow-md hover:shadow-lg"
        )}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for help articles, tutorials, FAQs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border-0 bg-background"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">Clear</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 rounded-2xl bg-background border border-border shadow-xl overflow-hidden">
          {isSearching && results.length === 0 && value.length > 0 ? (
            /* Loading State */
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            /* Search Results */
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="p-2">
                {results.map((article) => (
                  <button
                    key={article.id}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left"
                    onClick={() => {
                      // Navigate to article
                      setIsFocused(false)
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {article.title}
                        </p>
                        {article.featured && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] capitalize",
                            categoryColors[article.category]
                          )}
                        >
                          {article.category.replace("-", " ")}
                        </Badge>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {article.readTime} min
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {(article.views / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-border bg-muted/30">
                <button className="w-full text-center text-sm text-primary hover:underline flex items-center justify-center gap-2">
                  View all results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : value.length > 0 ? (
            /* No Results */
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-foreground mb-1">No results found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for something else or browse our categories
              </p>
            </div>
          ) : (
            /* Popular Searches */
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => onChange(search)}
                    className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Hint */}
      {!isFocused && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
          <kbd className="px-2 py-1 text-[10px] font-mono bg-muted rounded border border-border">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  )
}
