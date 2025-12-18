"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BillingHeader } from "@/components/billing/billing-header"
import { PricingCards } from "@/components/billing/pricing-cards"
import { CurrentPlan } from "@/components/billing/current-plan"
import { BillingHistory } from "@/components/billing/billing-history"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { UsageMetrics } from "@/components/billing/usage-metrics"

export type PlanTier = "free" | "pro" | "business" | "enterprise"
export type BillingCycle = "monthly" | "yearly"
export type ViewTab = "plans" | "billing" | "usage"

export interface Plan {
  id: PlanTier
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  workspaceLimit: number // -1 for unlimited
  teamMemberLimit: number // -1 for unlimited
  channelLimit: number // -1 for unlimited
  postsPerMonth: number // -1 for unlimited
  storageGB: number
  analyticsRetention: string
  supportLevel: string
  features: string[]
  color: string
}

export interface Subscription {
  planId: PlanTier
  status: "active" | "canceled" | "past_due" | "trialing"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  billingCycle: BillingCycle
  trialEndsAt?: Date
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank"
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export interface Invoice {
  id: string
  date: Date
  amount: number
  status: "paid" | "pending" | "failed" | "refunded"
  description: string
  downloadUrl: string
}

export interface Usage {
  workspaces: number
  teamMembers: number
  channels: number
  postsThisMonth: number
  storageUsedGB: number
  apiCallsThisMonth: number
  scheduledPosts: number
}

// Plan definitions with workspace limits
const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: { monthly: 0, yearly: 0 },
    workspaceLimit: 1,
    teamMemberLimit: 1,
    channelLimit: 3,
    postsPerMonth: 30,
    storageGB: 1,
    analyticsRetention: "7 days",
    supportLevel: "Community",
    color: "#6b7280",
    features: [
      "Basic analytics",
      "3 social channels",
      "30 posts per month",
      "1 GB storage",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and creators",
    price: { monthly: 29, yearly: 24 },
    workspaceLimit: 3,
    teamMemberLimit: 5,
    channelLimit: 10,
    postsPerMonth: 500,
    storageGB: 10,
    analyticsRetention: "90 days",
    supportLevel: "Email",
    color: "#f97316",
    features: [
      "Advanced analytics",
      "10 social channels",
      "500 posts per month",
      "AI Content Assistant",
      "Team collaboration",
      "10 GB storage",
      "Email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and agencies",
    price: { monthly: 79, yearly: 66 },
    workspaceLimit: 10,
    teamMemberLimit: 20,
    channelLimit: 30,
    postsPerMonth: 2000,
    storageGB: 50,
    analyticsRetention: "1 year",
    supportLevel: "Priority",
    color: "#8b5cf6",
    features: [
      "Premium analytics",
      "30 social channels",
      "2,000 posts per month",
      "AI Content Assistant",
      "20 team members",
      "Custom branding",
      "API access",
      "50 GB storage",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: 199, yearly: 166 },
    workspaceLimit: -1,
    teamMemberLimit: -1,
    channelLimit: -1,
    postsPerMonth: -1,
    storageGB: 500,
    analyticsRetention: "Unlimited",
    supportLevel: "Dedicated",
    color: "#0ea5e9",
    features: [
      "Enterprise analytics",
      "Unlimited channels",
      "Unlimited posts",
      "AI Content Assistant",
      "Unlimited team members",
      "Custom integrations",
      "SSO & SAML",
      "500 GB storage",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
]

// Mock data
const mockSubscription: Subscription = {
  planId: "pro",
  status: "active",
  currentPeriodStart: new Date(2024, 10, 1),
  currentPeriodEnd: new Date(2024, 11, 1),
  cancelAtPeriodEnd: false,
  billingCycle: "monthly",
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expiryMonth: 6,
    expiryYear: 2025,
    isDefault: false,
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    date: new Date(2024, 10, 1),
    amount: 29,
    status: "paid",
    description: "Pro Plan - November 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-002",
    date: new Date(2024, 9, 1),
    amount: 29,
    status: "paid",
    description: "Pro Plan - October 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-003",
    date: new Date(2024, 8, 1),
    amount: 29,
    status: "paid",
    description: "Pro Plan - September 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-004",
    date: new Date(2024, 7, 1),
    amount: 29,
    status: "paid",
    description: "Pro Plan - August 2024",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-005",
    date: new Date(2024, 6, 1),
    amount: 29,
    status: "paid",
    description: "Pro Plan - July 2024",
    downloadUrl: "#",
  },
]

const mockUsage: Usage = {
  workspaces: 2,
  teamMembers: 3,
  channels: 6,
  postsThisMonth: 342,
  storageUsedGB: 4.2,
  apiCallsThisMonth: 12458,
  scheduledPosts: 28,
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>("plans")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [invoices] = useState<Invoice[]>(mockInvoices)
  const [usage] = useState<Usage>(mockUsage)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentPlan = plans.find((p) => p.id === subscription.planId)!

  const handleSelectPlan = (planId: PlanTier) => {
    if (planId === "enterprise") {
      // Open contact sales modal
      console.log("Contact sales for enterprise")
      return
    }

    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setSubscription((prev) => ({
        ...prev,
        planId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }))
      setIsProcessing(false)
    }, 1500)
  }

  const handleCancelPlan = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: true,
    }))
  }

  const handleResumePlan = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: false,
    }))
  }

  const handleAddPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Math.random().toString(36).substring(2, 9)}`,
    }
    setPaymentMethods((prev) => [...prev, newMethod])
  }

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    )
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
  }

  const handleViewInvoice = (invoiceId: string) => {
    console.log("Viewing invoice:", invoiceId)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <BillingHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentPlan={currentPlan}
          subscription={subscription}
        />

        <div className="flex-1 overflow-auto">
          {activeTab === "plans" && (
            <div className="p-4 lg:p-6">
              <PricingCards
                plans={plans}
                currentPlan={currentPlan}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                onSelectPlan={handleSelectPlan}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {activeTab === "billing" && (
            <div className="p-4 lg:p-6 space-y-8">
              <div className="max-w-4xl mx-auto">
                <CurrentPlan
                  currentPlan={currentPlan}
                  subscription={subscription}
                  usage={usage}
                  onManagePlan={() => setActiveTab("plans")}
                  onCancelPlan={handleCancelPlan}
                  onResumePlan={handleResumePlan}
                />
              </div>

              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h2>
                <PaymentMethods
                  paymentMethods={paymentMethods}
                  onAddPaymentMethod={handleAddPaymentMethod}
                  onRemovePaymentMethod={handleRemovePaymentMethod}
                  onSetDefault={handleSetDefaultPaymentMethod}
                />
              </div>

              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold text-foreground mb-4">Billing History</h2>
                <BillingHistory
                  invoices={invoices}
                  onDownloadInvoice={handleDownloadInvoice}
                  onViewInvoice={handleViewInvoice}
                />
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="p-4 lg:p-6 max-w-4xl mx-auto">
              <UsageMetrics
                currentPlan={currentPlan}
                usage={usage}
                onUpgrade={() => setActiveTab("plans")}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
