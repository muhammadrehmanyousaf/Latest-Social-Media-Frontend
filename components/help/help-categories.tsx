"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CategoryInfo } from "@/app/help/page"

interface HelpCategoriesProps {
  categories: CategoryInfo[]
}

export function HelpCategories({ categories }: HelpCategoriesProps) {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Browse by Category</h2>
        <p className="text-muted-foreground">
          Find answers organized by topic
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group relative overflow-hidden p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Background */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                category.color
              )}
              style={{ opacity: 0.05 }}
            />

            {/* Content */}
            <div className="relative">
              {/* Icon */}
              <div className="text-4xl mb-4">{category.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  {category.articleCount} articles
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
