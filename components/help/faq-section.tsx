"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Search,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { FaqItem } from "@/app/help/page"

interface FaqSectionProps {
  items: FaqItem[]
}

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

const categories = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting Started" },
  { id: "scheduling", label: "Scheduling" },
  { id: "analytics", label: "Analytics" },
  { id: "channels", label: "Channels" },
  { id: "billing", label: "Billing" },
  { id: "troubleshooting", label: "Troubleshooting" },
]

export function FaqSection({ items }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({})

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory)

  const handleVote = (itemId: string, vote: "up" | "down") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === vote ? null : vote,
    }))
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Quick answers to common questions
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-4 py-2 text-sm rounded-full transition-all",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {filteredItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={cn(index === 0 && "border-t-0")}
            >
              <AccordionTrigger className="text-left hover:no-underline group py-5">
                <div className="flex items-start gap-4 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.question}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mt-2 text-[10px] capitalize",
                        categoryColors[item.category]
                      )}
                    >
                      {item.category.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="ml-12 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>

                  {/* Helpful Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Was this helpful?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(item.id, "up")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                          helpfulVotes[item.id] === "up"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        )}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Yes ({item.helpful + (helpfulVotes[item.id] === "up" ? 1 : 0)})
                      </button>
                      <button
                        onClick={() => handleVote(item.id, "down")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                          helpfulVotes[item.id] === "down"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        )}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium text-foreground mb-1">No FAQs found</p>
            <p className="text-xs text-muted-foreground">
              Try selecting a different category
            </p>
          </div>
        )}
      </Card>

      {/* Can't Find Answer */}
      <Card className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Can't find what you're looking for?
              </h3>
              <p className="text-xs text-muted-foreground">
                Our support team is here to help you
              </p>
            </div>
          </div>
          <Button className="rounded-xl gap-2">
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </section>
  )
}
