"use client"

import { useState, useCallback } from "react"
import { usePageHeader } from "@/components/page-context"
import { Layers } from "lucide-react"
import { BulkScheduleHeader } from "@/components/bulk-schedule/bulk-schedule-header"
import { BulkUploadZone } from "@/components/bulk-schedule/bulk-upload-zone"
import { BulkPostEditor } from "@/components/bulk-schedule/bulk-post-editor"
import { BulkQueue } from "@/components/bulk-schedule/bulk-queue"
import { TimeSlotTemplates } from "@/components/bulk-schedule/time-slot-templates"
import { ContentLibrary } from "@/components/bulk-schedule/content-library"

export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok"

export type BulkPostStatus = "draft" | "ready" | "scheduled" | "error"

export interface BulkPost {
  id: string
  content: string
  platforms: Platform[]
  scheduledDate: Date | null
  scheduledTime: string | null
  media: MediaItem[]
  status: BulkPostStatus
  errors: string[]
  hashtags: string[]
  characterCount: Record<Platform, number>
}

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  name: string
  size: number
}

export interface TimeSlot {
  id: string
  name: string
  time: string
  days: string[]
  platforms: Platform[]
  isDefault?: boolean
}

export interface ContentItem {
  id: string
  content: string
  hashtags: string[]
  media: MediaItem[]
  usageCount: number
  createdAt: Date
  category: string
}

export type ViewTab = "editor" | "queue" | "templates" | "library"

const platformLimits: Record<Platform, number> = {
  twitter: 280,
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
  threads: 500,
  tiktok: 2200,
}

export default function BulkSchedulePage() {
  usePageHeader({
    title: "Bulk Schedule",
    subtitle: "Schedule multiple posts at once",
    icon: Layers,
  })

  const [activeTab, setActiveTab] = useState<ViewTab>("editor")
  const [posts, setPosts] = useState<BulkPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", name: "Morning Rush", time: "09:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["instagram", "twitter", "linkedin"], isDefault: true },
    { id: "2", name: "Lunch Break", time: "12:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], platforms: ["instagram", "facebook", "twitter"] },
    { id: "3", name: "Evening Peak", time: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], platforms: ["instagram", "facebook", "tiktok"] },
    { id: "4", name: "Weekend Vibes", time: "10:00", days: ["Sat", "Sun"], platforms: ["instagram", "tiktok", "threads"] },
  ])
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([
    { id: "1", content: "Check out our latest product launch! Link in bio.", hashtags: ["newproduct", "launch", "exciting"], media: [], usageCount: 12, createdAt: new Date(2024, 10, 15), category: "Product" },
    { id: "2", content: "Happy Monday! What are your goals for this week?", hashtags: ["mondaymotivation", "goals", "productivity"], media: [], usageCount: 8, createdAt: new Date(2024, 10, 18), category: "Engagement" },
    { id: "3", content: "Behind the scenes of our creative process...", hashtags: ["behindthescenes", "creative", "teamwork"], media: [], usageCount: 5, createdAt: new Date(2024, 10, 20), category: "Culture" },
  ])
  const [isUploading, setIsUploading] = useState(false)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const calculateCharacterCounts = useCallback((content: string): Record<Platform, number> => {
    const length = content.length
    return {
      twitter: length,
      instagram: length,
      facebook: length,
      linkedin: length,
      threads: length,
      tiktok: length,
    }
  }, [])

  const validatePost = useCallback((post: BulkPost): string[] => {
    const errors: string[] = []

    if (!post.content.trim()) {
      errors.push("Content is required")
    }

    if (post.platforms.length === 0) {
      errors.push("Select at least one platform")
    }

    post.platforms.forEach((platform) => {
      if (post.content.length > platformLimits[platform]) {
        errors.push(`Content exceeds ${platform} limit (${platformLimits[platform]} chars)`)
      }
    })

    if (!post.scheduledDate || !post.scheduledTime) {
      errors.push("Schedule date and time required")
    }

    return errors
  }, [])

  const addPost = useCallback((content: string = "", platforms: Platform[] = ["instagram"], media: MediaItem[] = []) => {
    const newPost: BulkPost = {
      id: generateId(),
      content,
      platforms,
      scheduledDate: null,
      scheduledTime: null,
      media,
      status: "draft",
      errors: [],
      hashtags: [],
      characterCount: calculateCharacterCounts(content),
    }
    setPosts((prev) => [...prev, newPost])
    return newPost.id
  }, [calculateCharacterCounts])

  const updatePost = useCallback((id: string, updates: Partial<BulkPost>) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post
        const updated = { ...post, ...updates }
        if (updates.content !== undefined) {
          updated.characterCount = calculateCharacterCounts(updates.content)
        }
        updated.errors = validatePost(updated)
        updated.status = updated.errors.length === 0 ? "ready" : "draft"
        return updated
      })
    )
  }, [calculateCharacterCounts, validatePost])

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id))
    setSelectedPosts((prev) => prev.filter((postId) => postId !== id))
  }, [])

  const deletePosts = useCallback((ids: string[]) => {
    setPosts((prev) => prev.filter((post) => !ids.includes(post.id)))
    setSelectedPosts((prev) => prev.filter((postId) => !ids.includes(postId)))
  }, [])

  const duplicatePost = useCallback((id: string) => {
    const post = posts.find((p) => p.id === id)
    if (!post) return
    const newPost: BulkPost = {
      ...post,
      id: generateId(),
      status: "draft",
    }
    setPosts((prev) => [...prev, newPost])
  }, [posts])

  const handleCSVImport = useCallback((data: Array<{ content: string; platforms: string; date: string; time: string }>) => {
    const newPosts: BulkPost[] = data.map((row) => {
      const platforms = row.platforms.split(",").map((p) => p.trim().toLowerCase()) as Platform[]
      const content = row.content || ""
      return {
        id: generateId(),
        content,
        platforms: platforms.filter((p) => ["instagram", "facebook", "twitter", "linkedin", "threads", "tiktok"].includes(p)),
        scheduledDate: row.date ? new Date(row.date) : null,
        scheduledTime: row.time || null,
        media: [],
        status: "draft" as BulkPostStatus,
        errors: [],
        hashtags: [],
        characterCount: calculateCharacterCounts(content),
      }
    })
    setPosts((prev) => [...prev, ...newPosts])
  }, [calculateCharacterCounts])

  const applyTimeSlot = useCallback((slotId: string, postIds: string[]) => {
    const slot = timeSlots.find((s) => s.id === slotId)
    if (!slot) return

    const today = new Date()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    postIds.forEach((postId, index) => {
      const daysFromNow = Math.floor(index / slot.days.length)
      const dayIndex = index % slot.days.length
      const targetDay = slot.days[dayIndex]

      let targetDate = new Date(today)
      while (dayNames[targetDate.getDay()] !== targetDay) {
        targetDate.setDate(targetDate.getDate() + 1)
      }
      targetDate.setDate(targetDate.getDate() + daysFromNow * 7)

      updatePost(postId, {
        scheduledDate: targetDate,
        scheduledTime: slot.time,
        platforms: slot.platforms,
      })
    })
  }, [timeSlots, updatePost])

  const scheduleAllReady = useCallback(() => {
    const readyPosts = posts.filter((p) => p.status === "ready")
    readyPosts.forEach((post) => {
      updatePost(post.id, { status: "scheduled" })
    })
  }, [posts, updatePost])

  const addToLibrary = useCallback((post: BulkPost) => {
    const newItem: ContentItem = {
      id: generateId(),
      content: post.content,
      hashtags: post.hashtags,
      media: post.media,
      usageCount: 0,
      createdAt: new Date(),
      category: "Saved",
    }
    setContentLibrary((prev) => [...prev, newItem])
  }, [])

  const useFromLibrary = useCallback((itemId: string) => {
    const item = contentLibrary.find((i) => i.id === itemId)
    if (!item) return

    addPost(item.content, ["instagram"], item.media)
    setContentLibrary((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, usageCount: i.usageCount + 1 } : i))
    )
  }, [contentLibrary, addPost])

  const addTimeSlot = useCallback((slot: Omit<TimeSlot, "id">) => {
    setTimeSlots((prev) => [...prev, { ...slot, id: generateId() }])
  }, [])

  const deleteTimeSlot = useCallback((id: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const readyCount = posts.filter((p) => p.status === "ready").length
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length
  const errorCount = posts.filter((p) => p.errors.length > 0).length

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <BulkScheduleHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalPosts={posts.length}
          readyCount={readyCount}
          scheduledCount={scheduledCount}
          errorCount={errorCount}
          onAddPost={() => addPost()}
          onScheduleAll={scheduleAllReady}
          selectedCount={selectedPosts.length}
          onDeleteSelected={() => deletePosts(selectedPosts)}
        />

        <div className="flex-1 overflow-hidden">
          {activeTab === "editor" && (
            <div className="h-full flex flex-col lg:flex-row">
              <div className="flex-1 overflow-auto p-4 lg:p-6">
                <BulkUploadZone
                  onCSVImport={handleCSVImport}
                  onAddPost={addPost}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
                <BulkPostEditor
                  posts={posts}
                  selectedPosts={selectedPosts}
                  onSelectPosts={setSelectedPosts}
                  onUpdatePost={updatePost}
                  onDeletePost={deletePost}
                  onDuplicatePost={duplicatePost}
                  onAddToLibrary={addToLibrary}
                  platformLimits={platformLimits}
                />
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <BulkQueue
              posts={posts.filter((p) => p.status === "ready" || p.status === "scheduled")}
              onUpdatePost={updatePost}
              onDeletePost={deletePost}
            />
          )}

          {activeTab === "templates" && (
            <TimeSlotTemplates
              timeSlots={timeSlots}
              onAddSlot={addTimeSlot}
              onDeleteSlot={deleteTimeSlot}
              onApplySlot={applyTimeSlot}
              posts={posts}
              selectedPosts={selectedPosts}
            />
          )}

          {activeTab === "library" && (
            <ContentLibrary
              items={contentLibrary}
              onUseItem={useFromLibrary}
              onDeleteItem={(id) => setContentLibrary((prev) => prev.filter((i) => i.id !== id))}
            />
          )}
        </div>
    </div>
  )
}
