"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Plus, Download, Instagram, Twitter, Facebook, Linkedin, Clock, Edit2 } from "lucide-react"

const scheduledPosts = [
  {
    id: "1",
    content: "Exciting news! Our new product launch is just around the corner. Stay tuned for updates!",
    platform: "instagram",
    scheduledTime: "Today, 2:00 PM",
    status: "scheduled",
    image: "/product-launch-social-media-post.png",
  },
  {
    id: "2",
    content: "5 tips to boost your productivity this week. Thread incoming!",
    platform: "twitter",
    scheduledTime: "Today, 4:30 PM",
    status: "scheduled",
    image: null,
  },
  {
    id: "3",
    content: "Join us for our upcoming webinar on digital marketing trends for 2025.",
    platform: "linkedin",
    scheduledTime: "Tomorrow, 10:00 AM",
    status: "draft",
    image: "/webinar-announcement-professional.jpg",
  },
  {
    id: "4",
    content: "Happy Monday! What are your goals for this week? Let us know in the comments!",
    platform: "facebook",
    scheduledTime: "Mon, Dec 23, 9:00 AM",
    status: "scheduled",
    image: null,
  },
  {
    id: "5",
    content: "Behind the scenes look at our creative process. Swipe to see more!",
    platform: "instagram",
    scheduledTime: "Tue, Dec 24, 12:00 PM",
    status: "pending",
    image: "/behind-the-scenes-creative-studio.jpg",
  },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
}

const platformColors: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  twitter: "bg-[#1DA1F2]",
  facebook: "bg-[#1877F2]",
  linkedin: "bg-[#0A66C2]",
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-success/10 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/15 text-warning border-warning/30",
}

export function ScheduledPosts() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4 px-5 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Scheduled Posts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage your upcoming content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 bg-transparent rounded-lg font-medium">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button size="sm" className="h-9 text-xs gap-1.5 rounded-lg font-semibold shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              New Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-border bg-muted/40">
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10">
                  <Checkbox className="rounded" />
                </th>
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Content
                </th>
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Platform
                </th>
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Scheduled
                </th>
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduledPosts.map((post) => {
                const PlatformIcon = platformIcons[post.platform]
                return (
                  <tr
                    key={post.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <Checkbox className="rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {post.image && (
                          <Avatar className="w-10 h-10 rounded-lg border border-border">
                            <AvatarImage src={post.image || "/placeholder.svg"} className="object-cover" />
                            <AvatarFallback className="rounded-lg bg-muted text-xs">IMG</AvatarFallback>
                          </Avatar>
                        )}
                        <p className="text-sm text-foreground line-clamp-2 max-w-[280px] leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg ${platformColors[post.platform]} flex items-center justify-center shadow-sm`}
                        >
                          <PlatformIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground capitalize">{post.platform}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.scheduledTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold capitalize rounded-md px-2.5 py-0.5 ${statusStyles[post.status]}`}
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">Showing 5 of 128 posts</p>
          <Button variant="link" className="text-sm text-primary font-semibold p-0 h-auto hover:no-underline">
            View all posts →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
