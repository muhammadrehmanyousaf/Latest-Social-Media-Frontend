"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Play,
  Clock,
  Eye,
  ArrowRight,
  Video,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { HelpVideo } from "@/app/help/page"

interface VideoTutorialsProps {
  videos: HelpVideo[]
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

const formatViews = (views: number): string => {
  if (views >= 1000) return `${(views / 1000).toFixed(0)}k`
  return views.toString()
}

export function VideoTutorials({ videos }: VideoTutorialsProps) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  const featuredVideos = videos.filter((v) => v.featured)
  const regularVideos = videos.filter((v) => !v.featured)

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Video className="w-6 h-6 text-red-500" />
            Video Tutorials
          </h2>
          <p className="text-muted-foreground">
            Learn SocialFlow with step-by-step video guides
          </p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
          <ExternalLink className="w-4 h-4" />
          YouTube Channel
        </Button>
      </div>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {featuredVideos.map((video) => (
            <Card
              key={video.id}
              className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                {/* Placeholder Thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-muted/80 flex items-center justify-center">
                    <Video className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300",
                    hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </Badge>
                </div>

                {/* Featured Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <Badge
                  variant="secondary"
                  className={cn(
                    "mb-3 text-[10px] capitalize",
                    categoryColors[video.category]
                  )}
                >
                  {video.category.replace("-", " ")}
                </Badge>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatViews(video.views)} views
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regularVideos.map((video) => (
          <Card
            key={video.id}
            className="group overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>

              {/* Play Button */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300",
                  hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white border-0 text-[10px]">
                  {video.duration}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {video.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] capitalize",
                    categoryColors[video.category]
                  )}
                >
                  {video.category.replace("-", " ")}
                </Badge>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatViews(video.views)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 text-center">
        <Button variant="outline" className="rounded-xl gap-2">
          View All Tutorials
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}
