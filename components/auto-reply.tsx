"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bot,
  Plus,
  Search,
  MoreHorizontal,
  Zap,
  Clock,
  MessageSquare,
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  Check,
  Tag,
  Filter,
  Play,
  Pause,
  Settings,
  ChevronRight,
  Reply,
  Send,
  Hash,
  AtSign,
  Star,
  Folder,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CannedResponse {
  id: string
  title: string
  content: string
  shortcut: string
  category: string
  usageCount: number
  lastUsed?: Date
  variables?: string[]
}

interface AutoReplyRule {
  id: string
  name: string
  trigger: "keyword" | "mention" | "dm" | "comment" | "all"
  keywords?: string[]
  response: string
  platforms: string[]
  isActive: boolean
  delay: number // seconds
  usageCount: number
}

const cannedResponses: CannedResponse[] = [
  {
    id: "1",
    title: "Thank You Response",
    content: "Thank you so much for your kind words! 🙏 We really appreciate your support. Is there anything else we can help you with?",
    shortcut: "/thanks",
    category: "General",
    usageCount: 156,
    lastUsed: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    title: "Support Redirect",
    content: "Hi {name}! Thanks for reaching out. For the fastest support, please email us at support@socialflow.io or visit our Help Center at help.socialflow.io. We'll get back to you within 24 hours! 💬",
    shortcut: "/support",
    category: "Support",
    usageCount: 89,
    variables: ["name"],
    lastUsed: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    title: "Pricing Info",
    content: "Great question about pricing! 💰 We have plans starting at $29/month. Check out all our options at socialflow.io/pricing. Would you like me to help you choose the right plan?",
    shortcut: "/pricing",
    category: "Sales",
    usageCount: 67,
    lastUsed: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    title: "Feature Request",
    content: "Thanks for the feature suggestion! 💡 We love hearing from our users. I've added this to our feedback board. Our product team reviews all suggestions weekly!",
    shortcut: "/feature",
    category: "Feedback",
    usageCount: 45,
    lastUsed: new Date(Date.now() - 172800000),
  },
  {
    id: "5",
    title: "DM Follow-up",
    content: "Hey {name}! 👋 Thanks for the DM. I wanted to follow up on your question about {topic}. Let me know if you need any more details!",
    shortcut: "/followup",
    category: "General",
    usageCount: 34,
    variables: ["name", "topic"],
  },
]

const autoReplyRules: AutoReplyRule[] = [
  {
    id: "1",
    name: "Welcome New Followers",
    trigger: "dm",
    response: "Hey! 👋 Thanks for following us! We share daily tips on social media growth. Feel free to DM us anytime with questions!",
    platforms: ["twitter", "instagram"],
    isActive: true,
    delay: 60,
    usageCount: 234,
  },
  {
    id: "2",
    name: "FAQ - Pricing",
    trigger: "keyword",
    keywords: ["price", "pricing", "cost", "how much"],
    response: "Great question! 💰 Our plans start at $29/month. Check out socialflow.io/pricing for all details, or DM us for a personalized recommendation!",
    platforms: ["twitter", "instagram", "facebook"],
    isActive: true,
    delay: 30,
    usageCount: 89,
  },
  {
    id: "3",
    name: "After Hours",
    trigger: "all",
    response: "Thanks for reaching out! 🌙 Our team is currently offline but we'll get back to you first thing tomorrow. For urgent issues, email support@socialflow.io",
    platforms: ["twitter", "instagram", "facebook", "linkedin"],
    isActive: false,
    delay: 0,
    usageCount: 156,
  },
  {
    id: "4",
    name: "Mention Thanks",
    trigger: "mention",
    response: "Thanks for the mention! 🙏 We really appreciate it. Let us know if there's anything we can help with!",
    platforms: ["twitter"],
    isActive: true,
    delay: 120,
    usageCount: 67,
  },
]

const categories = ["All", "General", "Support", "Sales", "Feedback", "Marketing"]

interface AutoReplyManagerProps {
  trigger?: React.ReactNode
}

export function AutoReplyManager({ trigger }: AutoReplyManagerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"canned" | "auto">("canned")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCreateCanned, setShowCreateCanned] = useState(false)
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [responses, setResponses] = useState(cannedResponses)
  const [rules, setRules] = useState(autoReplyRules)

  const filteredResponses = responses.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => r.id === ruleId ? { ...r, isActive: !r.isActive } : r)
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Bot className="w-4 h-4" />
            Auto-Reply
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            Auto-Reply & Quick Responses
          </DialogTitle>
          <DialogDescription>
            Manage canned responses and automated reply rules
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-border px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("canned")}
              className={cn(
                "pb-3 pt-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "canned"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Canned Responses
              <Badge variant="secondary" className="ml-2">{responses.length}</Badge>
            </button>
            <button
              onClick={() => setActiveTab("auto")}
              className={cn(
                "pb-3 pt-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "auto"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Auto-Reply Rules
              <Badge variant="secondary" className="ml-2">{rules.filter((r) => r.isActive).length} active</Badge>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "canned" ? (
            <div className="p-6 pt-4 h-[500px] flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search responses or type shortcut..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" className="gap-2" onClick={() => setShowCreateCanned(true)}>
                  <Plus className="w-4 h-4" />
                  New
                </Button>
              </div>

              {/* Response List */}
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-2">
                  {filteredResponses.map((response) => (
                    <div
                      key={response.id}
                      className="p-4 rounded-xl border hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{response.title}</h4>
                          <Badge variant="secondary" className="text-xs">{response.category}</Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {response.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
                          {response.shortcut}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Used {response.usageCount} times
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="p-6 pt-4 h-[500px] flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Automatically respond to messages based on triggers
                </p>
                <Button size="sm" className="gap-2" onClick={() => setShowCreateRule(true)}>
                  <Plus className="w-4 h-4" />
                  New Rule
                </Button>
              </div>

              {/* Rules List */}
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={cn(
                        "p-4 rounded-xl border transition-colors",
                        rule.isActive ? "border-green-500/30 bg-green-500/5" : "border-border"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {rule.trigger}
                              </Badge>
                              {rule.keywords && (
                                <span className="text-xs text-muted-foreground">
                                  Keywords: {rule.keywords.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Rule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 p-2 rounded bg-muted/50">
                        {rule.response}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rule.delay}s delay
                          </span>
                          <div className="flex gap-1">
                            {rule.platforms.map((p) => (
                              <span key={p} className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px]">
                                {p === "twitter" ? "𝕏" : p === "instagram" ? "📸" : p === "facebook" ? "f" : "in"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span>Triggered {rule.usageCount} times</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Create Canned Response Dialog */}
      <Dialog open={showCreateCanned} onOpenChange={setShowCreateCanned}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Canned Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g., Thank You Response" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shortcut</Label>
                <Input placeholder="/thanks" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Response Content</Label>
              <Textarea placeholder="Type your response... Use {name} for variables" className="min-h-[120px]" />
              <p className="text-xs text-muted-foreground">
                Tip: Use {"{name}"}, {"{topic}"} for dynamic variables
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCanned(false)}>Cancel</Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Auto-Reply Rule Dialog */}
      <Dialog open={showCreateRule} onOpenChange={setShowCreateRule}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Auto-Reply Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input placeholder="e.g., Welcome New Followers" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword Match</SelectItem>
                    <SelectItem value="mention">Mention</SelectItem>
                    <SelectItem value="dm">Direct Message</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="all">All Messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delay (seconds)</Label>
                <Input type="number" placeholder="30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input placeholder="price, pricing, cost, how much" />
            </div>
            <div className="space-y-2">
              <Label>Auto-Reply Message</Label>
              <Textarea placeholder="Type your automated response..." className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex gap-2">
                {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((p) => (
                  <Badge key={p} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRule(false)}>Cancel</Button>
            <Button className="gap-2">
              <Zap className="w-4 h-4" />
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

// Quick insert component for inbox
export function QuickResponsePicker({ onSelect }: { onSelect: (content: string) => void }) {
  const [search, setSearch] = useState("")

  const filtered = cannedResponses.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.shortcut.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-[300px]">
      <div className="p-2 border-b">
        <Input
          placeholder="Search or type shortcut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8"
        />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="p-2 space-y-1">
          {filtered.map((response) => (
            <button
              key={response.id}
              onClick={() => onSelect(response.content)}
              className="w-full p-2 rounded-lg text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{response.title}</span>
                <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted">
                  {response.shortcut}
                </code>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {response.content}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
