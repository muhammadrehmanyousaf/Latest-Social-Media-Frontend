"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Eye,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { HelpArticle } from "@/app/help/page"

interface PopularArticlesProps {
  articles: HelpArticle[]
}

const categoryColors: Record<string, string> = {
  "getting-started": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "scheduling": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "analytics": "bg-green-500/10 text-green-600 border-green-500/20",
  "channels": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "team": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "billing": "bg-pink-500/10 text-pink-600 border-pink-500/20",
  "integrations": "bg-teal-500/10 text-teal-600 border-teal-500/20",
  "troubleshooting": "bg-red-500/10 text-red-600 border-red-500/20",
}

const formatViews = (views: number): string => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`
  return views.toString()
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  const featuredArticles = articles.filter((a) => a.featured)
  const regularArticles = articles.filter((a) => !a.featured)

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Popular Articles
          </h2>
          <p className="text-muted-foreground">
            Most viewed and helpful articles
          </p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
          View All Articles
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {featuredArticles.map((article) => (
            <Card
              key={article.id}
              className="group relative overflow-hidden p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
            >
              {/* Featured Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </Badge>
              </div>

              {/* Content */}
              <div className="pr-24">
                <Badge
                  variant="secondary"
                  className={cn(
                    "mb-3 text-[10px] capitalize border",
                    categoryColors[article.category]
                  )}
                >
                  {article.category.replace("-", " ")}
                </Badge>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatViews(article.views)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {article.helpful} found helpful
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Card>
          ))}
        </div>
      )}

      {/* Regular Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regularArticles.map((article) => (
          <Card
            key={article.id}
            className="group p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] capitalize border",
                      categoryColors[article.category]
                    )}
                  >
                    {article.category.replace("-", " ")}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-6 sm:hidden">
        <Button variant="outline" className="w-full rounded-xl gap-2">
          View All Articles
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}
