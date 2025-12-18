"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  Zap,
  MessageSquare,
  Calendar,
  Twitter,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactSupportProps {}

const supportChannels = [
  {
    id: "chat",
    name: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: MessageCircle,
    color: "bg-green-500/10 text-green-600",
    availability: "Available 24/7",
    responseTime: "< 2 min",
    recommended: true,
  },
  {
    id: "email",
    name: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    color: "bg-blue-500/10 text-blue-600",
    availability: "Mon-Fri, 9am-6pm ET",
    responseTime: "< 4 hours",
    recommended: false,
  },
  {
    id: "phone",
    name: "Phone Support",
    description: "Speak directly with an agent",
    icon: Phone,
    color: "bg-purple-500/10 text-purple-600",
    availability: "Business plans only",
    responseTime: "Immediate",
    recommended: false,
  },
  {
    id: "schedule",
    name: "Schedule a Call",
    description: "Book a time that works for you",
    icon: Calendar,
    color: "bg-orange-500/10 text-orange-600",
    availability: "Mon-Fri, 9am-6pm ET",
    responseTime: "Scheduled",
    recommended: false,
  },
]

const ticketCategories = [
  { value: "technical", label: "Technical Issue" },
  { value: "billing", label: "Billing & Payments" },
  { value: "account", label: "Account Access" },
  { value: "feature", label: "Feature Request" },
  { value: "integration", label: "Integration Help" },
  { value: "other", label: "Other" },
]

const priorityLevels = [
  { value: "low", label: "Low - General question", color: "bg-green-500" },
  { value: "medium", label: "Medium - Need help soon", color: "bg-yellow-500" },
  { value: "high", label: "High - Urgent issue", color: "bg-orange-500" },
  { value: "critical", label: "Critical - Service down", color: "bg-red-500" },
]

export function ContactSupport({}: ContactSupportProps) {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
  })

  const handleSubmitTicket = () => {
    // Mock submission
    setTicketSubmitted(true)
    setTimeout(() => {
      setIsTicketDialogOpen(false)
      setTicketSubmitted(false)
      setFormData({ subject: "", category: "", priority: "medium", description: "" })
    }, 2000)
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Headphones className="w-6 h-6 text-primary" />
          Contact Support
        </h2>
        <p className="text-muted-foreground">
          Get help from our friendly support team
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {supportChannels.map((channel) => {
          const Icon = channel.icon
          return (
            <Card
              key={channel.id}
              className={cn(
                "relative p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                channel.recommended && "border-primary/50 bg-primary/5"
              )}
            >
              {channel.recommended && (
                <Badge className="absolute -top-2 right-4 bg-primary gap-1">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </Badge>
              )}

              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", channel.color)}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-1">
                {channel.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {channel.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {channel.availability}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground font-medium">
                    Response: {channel.responseTime}
                  </span>
                </div>
              </div>

              <Button
                variant={channel.recommended ? "default" : "outline"}
                size="sm"
                className="w-full mt-4 rounded-xl"
              >
                {channel.id === "chat" ? "Start Chat" : channel.id === "phone" ? "Call Now" : channel.id === "schedule" ? "Schedule" : "Send Email"}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Submit Ticket Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Submit a Support Ticket</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Describe your issue in detail and we'll get back to you as soon as possible.
                Include screenshots or error messages if applicable.
              </p>
            </div>
          </div>

          <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-2 shrink-0">
                <Send className="w-4 h-4" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              {ticketSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ticket Submitted!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We've received your request and will respond within 4 hours.
                    Check your email for updates.
                  </p>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Fill out the form below and we'll help you resolve your issue.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {ticketCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", level.color)} />
                                  {level.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="rounded-xl resize-none"
                        rows={5}
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Tips for faster resolution:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>Include your account email</li>
                        <li>Attach screenshots if applicable</li>
                        <li>Describe the expected vs actual behavior</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitTicket}
                      disabled={!formData.subject || !formData.category || !formData.description}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Social & Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Twitter className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Follow us on Twitter</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get product updates, tips, and connect with our team.
              </p>
              <Button variant="outline" size="sm" className="mt-3 rounded-xl gap-2">
                @socialflow
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Community Forum</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Join discussions, share tips, and learn from other users.
              </p>
              <Button variant="outline" size="sm" className="mt-3 rounded-xl gap-2">
                Join Community
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
