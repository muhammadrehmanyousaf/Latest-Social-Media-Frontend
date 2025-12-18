"use client"

import { useState } from "react"
import { HelpSearch } from "@/components/help/help-search"
import { HelpCategories } from "@/components/help/help-categories"
import { PopularArticles } from "@/components/help/popular-articles"
import { VideoTutorials } from "@/components/help/video-tutorials"
import { FaqSection } from "@/components/help/faq-section"
import { ContactSupport } from "@/components/help/contact-support"
import { QuickHelp } from "@/components/help/quick-help"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Types
export type HelpCategory =
  | "getting-started"
  | "scheduling"
  | "analytics"
  | "channels"
  | "team"
  | "billing"
  | "integrations"
  | "troubleshooting"

export interface HelpArticle {
  id: string
  title: string
  description: string
  category: HelpCategory
  content?: string
  readTime: number
  views: number
  helpful: number
  updatedAt: Date
  tags: string[]
  featured?: boolean
}

export interface HelpVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  category: HelpCategory
  views: number
  featured?: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: HelpCategory
  helpful: number
}

export interface CategoryInfo {
  id: HelpCategory
  name: string
  description: string
  icon: string
  articleCount: number
  color: string
}

// Mock Data
const categories: CategoryInfo[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: "🚀",
    articleCount: 12,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "scheduling",
    name: "Scheduling & Publishing",
    description: "Schedule, queue, and publish content",
    icon: "📅",
    articleCount: 18,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    description: "Track performance and generate reports",
    icon: "📊",
    articleCount: 15,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "channels",
    name: "Social Channels",
    description: "Connect and manage your social accounts",
    icon: "🔗",
    articleCount: 22,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "team",
    name: "Team & Collaboration",
    description: "Invite team members and set permissions",
    icon: "👥",
    articleCount: 10,
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "billing",
    name: "Billing & Plans",
    description: "Manage subscriptions and payments",
    icon: "💳",
    articleCount: 8,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "integrations",
    name: "Integrations & API",
    description: "Connect third-party apps and use our API",
    icon: "🔌",
    articleCount: 14,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    description: "Fix common issues and errors",
    icon: "🔧",
    articleCount: 20,
    color: "from-red-500 to-orange-500",
  },
]

const popularArticles: HelpArticle[] = [
  {
    id: "1",
    title: "How to connect your Instagram Business account",
    description: "Step-by-step guide to linking your Instagram Business or Creator account to SocialFlow",
    category: "channels",
    readTime: 5,
    views: 15420,
    helpful: 892,
    updatedAt: new Date(2024, 11, 15),
    tags: ["instagram", "connection", "setup"],
    featured: true,
  },
  {
    id: "2",
    title: "Understanding your Analytics Dashboard",
    description: "Learn how to read and interpret your social media performance metrics",
    category: "analytics",
    readTime: 8,
    views: 12350,
    helpful: 756,
    updatedAt: new Date(2024, 11, 10),
    tags: ["analytics", "metrics", "dashboard"],
    featured: true,
  },
  {
    id: "3",
    title: "Best times to post on each platform",
    description: "Discover optimal posting times based on your audience engagement patterns",
    category: "scheduling",
    readTime: 6,
    views: 10890,
    helpful: 634,
    updatedAt: new Date(2024, 11, 12),
    tags: ["scheduling", "timing", "engagement"],
  },
  {
    id: "4",
    title: "Setting up your first content calendar",
    description: "Create and organize your social media content calendar for maximum efficiency",
    category: "scheduling",
    readTime: 7,
    views: 9870,
    helpful: 589,
    updatedAt: new Date(2024, 11, 8),
    tags: ["calendar", "planning", "content"],
  },
  {
    id: "5",
    title: "Inviting team members and assigning roles",
    description: "Learn how to collaborate with your team using roles and permissions",
    category: "team",
    readTime: 4,
    views: 8540,
    helpful: 512,
    updatedAt: new Date(2024, 11, 5),
    tags: ["team", "collaboration", "permissions"],
  },
  {
    id: "6",
    title: "Troubleshooting failed post publishing",
    description: "Common reasons why posts fail and how to fix them",
    category: "troubleshooting",
    readTime: 5,
    views: 7650,
    helpful: 478,
    updatedAt: new Date(2024, 11, 14),
    tags: ["errors", "publishing", "fix"],
  },
]

const videoTutorials: HelpVideo[] = [
  {
    id: "1",
    title: "Complete SocialFlow Walkthrough",
    description: "A comprehensive tour of all SocialFlow features",
    thumbnail: "/api/placeholder/320/180",
    duration: "12:34",
    category: "getting-started",
    views: 45000,
    featured: true,
  },
  {
    id: "2",
    title: "Mastering the Content Calendar",
    description: "Learn to schedule like a pro with our calendar tools",
    thumbnail: "/api/placeholder/320/180",
    duration: "8:45",
    category: "scheduling",
    views: 32000,
    featured: true,
  },
  {
    id: "3",
    title: "Analytics Deep Dive",
    description: "Understanding every metric in your dashboard",
    thumbnail: "/api/placeholder/320/180",
    duration: "15:20",
    category: "analytics",
    views: 28500,
  },
  {
    id: "4",
    title: "Connecting All Your Social Accounts",
    description: "Step-by-step guide to linking Instagram, Facebook, Twitter, and more",
    thumbnail: "/api/placeholder/320/180",
    duration: "10:15",
    category: "channels",
    views: 25000,
  },
  {
    id: "5",
    title: "Team Collaboration Features",
    description: "Work together seamlessly with your team",
    thumbnail: "/api/placeholder/320/180",
    duration: "7:30",
    category: "team",
    views: 18000,
  },
  {
    id: "6",
    title: "Using AI to Write Better Captions",
    description: "Leverage AI assistance for engaging content",
    thumbnail: "/api/placeholder/320/180",
    duration: "6:45",
    category: "getting-started",
    views: 22000,
  },
]

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "How many social accounts can I connect?",
    answer: "The number of social accounts you can connect depends on your plan. Free plans include 3 accounts, Professional plans include 10 accounts, and Business plans include unlimited accounts. You can view your current limits in Settings > Billing.",
    category: "billing",
    helpful: 234,
  },
  {
    id: "2",
    question: "Why did my scheduled post fail to publish?",
    answer: "Posts can fail for several reasons: 1) Your social account connection may have expired - try reconnecting the account. 2) The content may violate platform guidelines. 3) There might be a temporary API issue with the social platform. Check the error message for specific details and try rescheduling.",
    category: "troubleshooting",
    helpful: 189,
  },
  {
    id: "3",
    question: "How do I export my analytics data?",
    answer: "Go to Analytics > Reports and click 'Export Report'. You can choose the date range, metrics to include, and export format (PDF, CSV, or Excel). Team members with Editor or Admin roles can export reports.",
    category: "analytics",
    helpful: 156,
  },
  {
    id: "4",
    question: "Can I schedule posts to multiple platforms at once?",
    answer: "Yes! When creating a post, you can select multiple connected accounts to publish to simultaneously. Each platform will receive an optimized version of your content. You can also customize the caption for each platform if needed.",
    category: "scheduling",
    helpful: 298,
  },
  {
    id: "5",
    question: "How do I cancel my subscription?",
    answer: "Go to Settings > Billing and click 'Cancel Subscription'. Your access will continue until the end of your current billing period. You can reactivate anytime. Note: Your data is preserved for 30 days after cancellation.",
    category: "billing",
    helpful: 87,
  },
  {
    id: "6",
    question: "Is there a mobile app available?",
    answer: "Yes! SocialFlow is available on iOS and Android. Download from the App Store or Google Play Store. The mobile app includes scheduling, analytics viewing, and notification management. Full content creation is best done on desktop.",
    category: "getting-started",
    helpful: 312,
  },
  {
    id: "7",
    question: "How does the AI caption generator work?",
    answer: "Our AI analyzes your image/video and past high-performing content to suggest engaging captions. Simply upload your media, click 'Generate Caption', and choose from multiple suggestions. You can adjust the tone (professional, casual, witty) in Settings > Content.",
    category: "getting-started",
    helpful: 267,
  },
  {
    id: "8",
    question: "What happens to scheduled posts if I disconnect an account?",
    answer: "If you disconnect a social account, all pending scheduled posts for that account will be cancelled. You'll receive a notification listing affected posts. We recommend checking your queue before disconnecting any accounts.",
    category: "channels",
    helpful: 145,
  },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // Mock search - filter articles by query
      const results = popularArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
      setSearchResults(results)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs">All systems operational</span>
              <Link href="#" className="text-primary hover:underline text-xs ml-1">
                Status
              </Link>
            </Badge>
          </div>

          {/* Title */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>
          </div>

          {/* Search */}
          <HelpSearch
            value={searchQuery}
            onChange={handleSearch}
            results={searchResults}
            isSearching={isSearching}
          />

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" className="rounded-full text-xs gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              What's New
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Community Forum
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              API Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">
        {/* Quick Help Cards */}
        <QuickHelp />

        {/* Categories */}
        <HelpCategories categories={categories} />

        {/* Popular Articles */}
        <PopularArticles articles={popularArticles} />

        {/* Video Tutorials */}
        <VideoTutorials videos={videoTutorials} />

        {/* FAQ Section */}
        <FaqSection items={faqItems} />

        {/* Contact Support */}
        <ContactSupport />
      </div>
    </div>
  )
}
