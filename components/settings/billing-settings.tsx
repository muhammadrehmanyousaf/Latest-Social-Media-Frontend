"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Receipt,
  TrendingUp,
  Zap,
  Check,
  ExternalLink,
  Download,
  Clock,
  AlertCircle,
  Sparkles,
  Users,
  FileText,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Link from "next/link"

interface BillingSettingsProps {
  // Props would come from billing module
}

// Mock current plan data
const currentPlan = {
  name: "Professional",
  price: 49,
  interval: "month",
  features: [
    "10 social accounts",
    "Unlimited posts",
    "Advanced analytics",
    "Team collaboration",
    "Priority support",
  ],
  usage: {
    posts: { used: 847, limit: null },
    accounts: { used: 7, limit: 10 },
    teamMembers: { used: 4, limit: 5 },
    storage: { used: 2.4, limit: 10 },
  },
}

// Mock billing history
const billingHistory = [
  { id: "1", date: new Date(2024, 11, 1), amount: 49, status: "paid", description: "Professional Plan - December 2024" },
  { id: "2", date: new Date(2024, 10, 1), amount: 49, status: "paid", description: "Professional Plan - November 2024" },
  { id: "3", date: new Date(2024, 9, 1), amount: 49, status: "paid", description: "Professional Plan - October 2024" },
]

export function BillingSettings({}: BillingSettingsProps) {
  const nextBillingDate = new Date(2025, 0, 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{currentPlan.name} Plan</h3>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ${currentPlan.price}/{currentPlan.interval} • Renews on{" "}
                {format(nextBillingDate, "MMMM d, yyyy")}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentPlan.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Link href="/billing">
              <Button variant="outline" className="rounded-xl gap-2 w-full sm:w-auto">
                <TrendingUp className="w-4 h-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Link href="/billing">
              <Button className="rounded-xl gap-2 w-full sm:w-auto">
                <ExternalLink className="w-4 h-4" />
                Manage Subscription
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Usage Overview */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Usage This Month
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social Accounts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Social Accounts</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentPlan.usage.accounts.used} / {currentPlan.usage.accounts.limit}
              </span>
            </div>
            <Progress
              value={(currentPlan.usage.accounts.used / currentPlan.usage.accounts.limit!) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {currentPlan.usage.accounts.limit! - currentPlan.usage.accounts.used} accounts remaining
            </p>
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Team Members</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentPlan.usage.teamMembers.used} / {currentPlan.usage.teamMembers.limit}
              </span>
            </div>
            <Progress
              value={(currentPlan.usage.teamMembers.used / currentPlan.usage.teamMembers.limit!) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {currentPlan.usage.teamMembers.limit! - currentPlan.usage.teamMembers.used} seats remaining
            </p>
          </div>

          {/* Storage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Media Storage</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentPlan.usage.storage.used} GB / {currentPlan.usage.storage.limit} GB
              </span>
            </div>
            <Progress
              value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit!) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {(currentPlan.usage.storage.limit! - currentPlan.usage.storage.used).toFixed(1)} GB remaining
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Scheduled Posts</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentPlan.usage.posts.used}
              </span>
            </div>
            <Progress value={100} className="h-2 bg-green-500/20" />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              Unlimited posts included
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </h3>
          <Button variant="outline" size="sm" className="rounded-xl">
            Update
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40">
          <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/2026</p>
          </div>
        </div>
      </Card>

      {/* Billing Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Billing Information
          </h3>
          <Button variant="outline" size="sm" className="rounded-xl">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/40">
            <p className="text-xs text-muted-foreground mb-1">Billing Email</p>
            <p className="text-sm font-medium text-foreground">billing@company.com</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40">
            <p className="text-xs text-muted-foreground mb-1">Company Name</p>
            <p className="text-sm font-medium text-foreground">Acme Inc.</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 md:col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Billing Address</p>
            <p className="text-sm font-medium text-foreground">
              123 Main Street, Suite 100, New York, NY 10001, United States
            </p>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Billing History
          </h3>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </div>
        <div className="space-y-3">
          {billingHistory.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{invoice.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(invoice.date, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">${invoice.amount}.00</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      invoice.status === "paid"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-amber-500/10 text-amber-600"
                    )}
                  >
                    {invoice.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Link href="/billing">
          <Button variant="link" className="w-full mt-4 text-xs">
            View all invoices
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </Card>

      {/* Upgrade CTA */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Need more power?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Upgrade to Business for unlimited team members, advanced analytics, and priority support.
              </p>
            </div>
          </div>
          <Link href="/billing">
            <Button className="rounded-xl gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="w-4 h-4" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </Card>

      {/* Cancel Subscription Notice */}
      <Card className="p-6 bg-muted/40">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground">Cancel Subscription</h4>
            <p className="text-xs text-muted-foreground mt-1">
              If you cancel your subscription, you'll lose access to premium features at the end of
              your billing period. Your data will be preserved for 30 days.
            </p>
            <Button variant="link" className="text-xs text-red-500 hover:text-red-600 p-0 h-auto mt-2">
              Cancel subscription
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
