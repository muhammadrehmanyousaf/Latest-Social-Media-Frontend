"use client"

import { useState, useCallback, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { TemplatesHeader } from "@/components/templates/templates-header"
import { TemplateCategories } from "@/components/templates/template-categories"
import { TemplateGallery } from "@/components/templates/template-gallery"
import { TemplatePreview } from "@/components/templates/template-preview"
import { TemplateBuilder } from "@/components/templates/template-builder"

export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "threads" | "tiktok"

export type TemplateCategory =
  | "all"
  | "product-launch"
  | "engagement"
  | "promotional"
  | "educational"
  | "behind-the-scenes"
  | "announcement"
  | "testimonial"
  | "tips-tricks"
  | "seasonal"
  | "custom"

export type TemplateStyle = "minimal" | "bold" | "elegant" | "playful" | "professional" | "creative"

export interface TemplateVariable {
  key: string
  label: string
  defaultValue: string
  type: "text" | "date" | "number" | "url"
}

export interface Template {
  id: string
  name: string
  description: string
  content: string
  category: TemplateCategory
  style: TemplateStyle
  platforms: Platform[]
  hashtags: string[]
  variables: TemplateVariable[]
  previewImage?: string
  usageCount: number
  rating: number
  isFavorite: boolean
  isCustom: boolean
  isPremium: boolean
  createdAt: Date
  author: string
  color: string
}

export interface Collection {
  id: string
  name: string
  description: string
  templates: string[]
  coverImage?: string
  color: string
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Product Launch Announcement",
    description: "Perfect for announcing new products with excitement and urgency",
    content: "Introducing {product_name}! We've been working on something special, and it's finally here. {product_description}\n\nAvailable now - Link in bio!",
    category: "product-launch",
    style: "bold",
    platforms: ["instagram", "facebook", "twitter"],
    hashtags: ["newproduct", "launch", "exciting", "comingsoon"],
    variables: [
      { key: "product_name", label: "Product Name", defaultValue: "Our New Product", type: "text" },
      { key: "product_description", label: "Description", defaultValue: "The game-changer you've been waiting for.", type: "text" },
    ],
    usageCount: 1234,
    rating: 4.8,
    isFavorite: true,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 1),
    author: "SocialFlow",
    color: "#f97316",
  },
  {
    id: "2",
    name: "Monday Motivation",
    description: "Boost engagement with inspiring Monday content",
    content: "Happy Monday! New week, new opportunities.\n\nWhat's your biggest goal for this week? Drop it in the comments and let's hold each other accountable!",
    category: "engagement",
    style: "playful",
    platforms: ["instagram", "facebook", "linkedin", "threads"],
    hashtags: ["mondaymotivation", "goals", "newweek", "mindset"],
    variables: [],
    usageCount: 2567,
    rating: 4.9,
    isFavorite: false,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 5),
    author: "SocialFlow",
    color: "#22c55e",
  },
  {
    id: "3",
    name: "Flash Sale Alert",
    description: "Create urgency with time-limited offers",
    content: "FLASH SALE! {discount}% OFF everything for the next {hours} hours only!\n\nUse code: {code}\n\nDon't miss out - this won't last long!",
    category: "promotional",
    style: "bold",
    platforms: ["instagram", "facebook", "twitter", "tiktok"],
    hashtags: ["sale", "flashsale", "limitedtime", "discount"],
    variables: [
      { key: "discount", label: "Discount %", defaultValue: "30", type: "number" },
      { key: "hours", label: "Hours", defaultValue: "24", type: "number" },
      { key: "code", label: "Promo Code", defaultValue: "FLASH30", type: "text" },
    ],
    usageCount: 3421,
    rating: 4.7,
    isFavorite: true,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 8),
    author: "SocialFlow",
    color: "#ef4444",
  },
  {
    id: "4",
    name: "Did You Know?",
    description: "Share interesting facts to educate your audience",
    content: "Did you know? {fact}\n\nShare this with someone who needs to know!\n\nFollow us for more {topic} tips.",
    category: "educational",
    style: "minimal",
    platforms: ["instagram", "twitter", "linkedin", "threads"],
    hashtags: ["didyouknow", "facts", "education", "learning"],
    variables: [
      { key: "fact", label: "Interesting Fact", defaultValue: "80% of consumers are more likely to buy from brands they follow on social media.", type: "text" },
      { key: "topic", label: "Topic", defaultValue: "marketing", type: "text" },
    ],
    usageCount: 1876,
    rating: 4.6,
    isFavorite: false,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 10),
    author: "SocialFlow",
    color: "#8b5cf6",
  },
  {
    id: "5",
    name: "Behind the Scenes",
    description: "Give followers a peek into your process",
    content: "Behind the scenes of {project}!\n\nHere's a sneak peek at what we've been working on. The team has been putting in extra hours to make this perfect for you.\n\nStay tuned for the big reveal!",
    category: "behind-the-scenes",
    style: "creative",
    platforms: ["instagram", "tiktok", "facebook"],
    hashtags: ["behindthescenes", "bts", "sneakpeek", "comingsoon"],
    variables: [
      { key: "project", label: "Project Name", defaultValue: "our latest project", type: "text" },
    ],
    usageCount: 987,
    rating: 4.5,
    isFavorite: false,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 12),
    author: "SocialFlow",
    color: "#ec4899",
  },
  {
    id: "6",
    name: "Big Announcement",
    description: "Make important announcements stand out",
    content: "BIG NEWS!\n\n{announcement}\n\nWe're so excited to share this with you. Thank you for being part of our journey!\n\nMore details coming soon.",
    category: "announcement",
    style: "bold",
    platforms: ["instagram", "facebook", "twitter", "linkedin"],
    hashtags: ["announcement", "bignews", "exciting", "update"],
    variables: [
      { key: "announcement", label: "Announcement", defaultValue: "We have something incredible to share...", type: "text" },
    ],
    usageCount: 2134,
    rating: 4.8,
    isFavorite: true,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 14),
    author: "SocialFlow",
    color: "#0ea5e9",
  },
  {
    id: "7",
    name: "Customer Testimonial",
    description: "Share social proof from happy customers",
    content: "\"{testimonial}\"\n\n- {customer_name}\n\nThank you for the kind words! We love hearing from our amazing customers.\n\nReady to experience the difference? Link in bio.",
    category: "testimonial",
    style: "elegant",
    platforms: ["instagram", "facebook", "linkedin"],
    hashtags: ["testimonial", "customerreview", "happycustomer", "thankyou"],
    variables: [
      { key: "testimonial", label: "Testimonial", defaultValue: "This product changed my life! Highly recommend.", type: "text" },
      { key: "customer_name", label: "Customer Name", defaultValue: "Sarah M.", type: "text" },
    ],
    usageCount: 1543,
    rating: 4.7,
    isFavorite: false,
    isCustom: false,
    isPremium: true,
    createdAt: new Date(2024, 10, 16),
    author: "SocialFlow",
    color: "#14b8a6",
  },
  {
    id: "8",
    name: "Quick Tips Thread",
    description: "Share valuable tips in a thread format",
    content: "{count} {topic} tips that will change your life:\n\n1. {tip1}\n2. {tip2}\n3. {tip3}\n\nSave this post for later!\n\nWhich tip are you trying first?",
    category: "tips-tricks",
    style: "professional",
    platforms: ["twitter", "threads", "linkedin"],
    hashtags: ["tips", "advice", "howto", "protips"],
    variables: [
      { key: "count", label: "Number of Tips", defaultValue: "3", type: "number" },
      { key: "topic", label: "Topic", defaultValue: "productivity", type: "text" },
      { key: "tip1", label: "Tip 1", defaultValue: "Start your day with the hardest task", type: "text" },
      { key: "tip2", label: "Tip 2", defaultValue: "Take regular breaks every 90 minutes", type: "text" },
      { key: "tip3", label: "Tip 3", defaultValue: "Review your goals every morning", type: "text" },
    ],
    usageCount: 3210,
    rating: 4.9,
    isFavorite: true,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 18),
    author: "SocialFlow",
    color: "#6366f1",
  },
  {
    id: "9",
    name: "Holiday Greeting",
    description: "Seasonal greetings for any holiday",
    content: "Happy {holiday}!\n\nWishing you and your loved ones a wonderful celebration filled with joy and happiness.\n\nFrom all of us at {brand_name}",
    category: "seasonal",
    style: "elegant",
    platforms: ["instagram", "facebook", "twitter", "linkedin"],
    hashtags: ["holiday", "celebration", "greetings", "happyholidays"],
    variables: [
      { key: "holiday", label: "Holiday Name", defaultValue: "Holidays", type: "text" },
      { key: "brand_name", label: "Brand Name", defaultValue: "Our Team", type: "text" },
    ],
    usageCount: 4521,
    rating: 4.8,
    isFavorite: false,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 20),
    author: "SocialFlow",
    color: "#f59e0b",
  },
  {
    id: "10",
    name: "Question of the Day",
    description: "Spark conversations with engaging questions",
    content: "Question of the day:\n\n{question}\n\nDrop your answer below! We love hearing from you.",
    category: "engagement",
    style: "playful",
    platforms: ["instagram", "facebook", "twitter", "threads"],
    hashtags: ["questionoftheday", "community", "engagement", "letschat"],
    variables: [
      { key: "question", label: "Question", defaultValue: "What's one thing you're grateful for today?", type: "text" },
    ],
    usageCount: 2876,
    rating: 4.6,
    isFavorite: false,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 22),
    author: "SocialFlow",
    color: "#84cc16",
  },
  {
    id: "11",
    name: "Countdown Hype",
    description: "Build anticipation for upcoming launches",
    content: "{days} DAYS TO GO!\n\nThe countdown is on for {event}.\n\nMark your calendars: {date}\n\nTurn on post notifications so you don't miss it!",
    category: "announcement",
    style: "bold",
    platforms: ["instagram", "facebook", "twitter", "tiktok"],
    hashtags: ["countdown", "comingsoon", "staytuned", "exciting"],
    variables: [
      { key: "days", label: "Days Left", defaultValue: "7", type: "number" },
      { key: "event", label: "Event Name", defaultValue: "something amazing", type: "text" },
      { key: "date", label: "Date", defaultValue: "January 1st", type: "text" },
    ],
    usageCount: 1654,
    rating: 4.7,
    isFavorite: false,
    isCustom: false,
    isPremium: true,
    createdAt: new Date(2024, 10, 24),
    author: "SocialFlow",
    color: "#f43f5e",
  },
  {
    id: "12",
    name: "Poll/This or That",
    description: "Interactive poll to boost engagement",
    content: "This or That?\n\n{option_a} vs {option_b}\n\nVote in the comments!\nA = {option_a}\nB = {option_b}",
    category: "engagement",
    style: "playful",
    platforms: ["instagram", "twitter", "threads", "tiktok"],
    hashtags: ["thisorthat", "poll", "vote", "youdecide"],
    variables: [
      { key: "option_a", label: "Option A", defaultValue: "Coffee", type: "text" },
      { key: "option_b", label: "Option B", defaultValue: "Tea", type: "text" },
    ],
    usageCount: 3987,
    rating: 4.9,
    isFavorite: true,
    isCustom: false,
    isPremium: false,
    createdAt: new Date(2024, 10, 26),
    author: "SocialFlow",
    color: "#a855f7",
  },
]

const mockCollections: Collection[] = [
  { id: "1", name: "Product Launch Kit", description: "Everything you need to launch successfully", templates: ["1", "6", "11"], color: "#f97316" },
  { id: "2", name: "Engagement Boosters", description: "Maximize your audience interaction", templates: ["2", "10", "12"], color: "#22c55e" },
  { id: "3", name: "Sales & Promotions", description: "Drive conversions with proven templates", templates: ["3", "7"], color: "#ef4444" },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [collections] = useState<Collection[]>(mockCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle | "all">("all")
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "rating">("popular")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query) ||
          t.hashtags.some((h) => h.toLowerCase().includes(query))
      )
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory)
    }

    // Platforms
    if (selectedPlatforms.length > 0) {
      result = result.filter((t) =>
        selectedPlatforms.some((p) => t.platforms.includes(p))
      )
    }

    // Style
    if (selectedStyle !== "all") {
      result = result.filter((t) => t.style === selectedStyle)
    }

    // Favorites
    if (showFavoritesOnly) {
      result = result.filter((t) => t.isFavorite)
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.usageCount - a.usageCount)
        break
      case "recent":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [templates, searchQuery, selectedCategory, selectedPlatforms, selectedStyle, sortBy, showFavoritesOnly])

  const toggleFavorite = useCallback((id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    )
  }, [])

  const useTemplate = useCallback((id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t))
    )
    // In real app, would navigate to create-post with template content
  }, [])

  const duplicateTemplate = useCallback((template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
      name: `${template.name} (Copy)`,
      isCustom: true,
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date(),
      author: "You",
    }
    setTemplates((prev) => [newTemplate, ...prev])
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const saveTemplate = useCallback((template: Omit<Template, "id" | "usageCount" | "rating" | "createdAt" | "author">) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, ...template }
            : t
        )
      )
    } else {
      const newTemplate: Template = {
        ...template,
        id: Math.random().toString(36).substring(2, 9),
        usageCount: 0,
        rating: 0,
        createdAt: new Date(),
        author: "You",
      }
      setTemplates((prev) => [newTemplate, ...prev])
    }
    setIsBuilderOpen(false)
    setEditingTemplate(null)
  }, [editingTemplate])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: templates.length }
    templates.forEach((t) => {
      stats[t.category] = (stats[t.category] || 0) + 1
    })
    return stats
  }, [templates])

  const favoriteCount = templates.filter((t) => t.isFavorite).length
  const customCount = templates.filter((t) => t.isCustom).length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TemplatesHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesChange={setShowFavoritesOnly}
          onCreateNew={() => {
            setEditingTemplate(null)
            setIsBuilderOpen(true)
          }}
          totalTemplates={filteredTemplates.length}
          favoriteCount={favoriteCount}
        />

        <div className="flex-1 flex overflow-hidden">
          <TemplateCategories
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryStats={categoryStats}
            collections={collections}
            customCount={customCount}
          />

          <TemplateGallery
            templates={filteredTemplates}
            onPreview={setPreviewTemplate}
            onToggleFavorite={toggleFavorite}
            onUse={useTemplate}
            onDuplicate={duplicateTemplate}
            onEdit={(t) => {
              setEditingTemplate(t)
              setIsBuilderOpen(true)
            }}
            onDelete={deleteTemplate}
          />
        </div>

        {previewTemplate && (
          <TemplatePreview
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => {
              useTemplate(previewTemplate.id)
              setPreviewTemplate(null)
            }}
            onToggleFavorite={() => toggleFavorite(previewTemplate.id)}
            onDuplicate={() => {
              duplicateTemplate(previewTemplate)
              setPreviewTemplate(null)
            }}
          />
        )}

        {isBuilderOpen && (
          <TemplateBuilder
            template={editingTemplate}
            onSave={saveTemplate}
            onClose={() => {
              setIsBuilderOpen(false)
              setEditingTemplate(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
