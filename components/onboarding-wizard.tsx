"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Upload,
  Building2,
  Users,
  Target,
  Zap,
  Calendar,
  BarChart3,
  MessageSquare,
  Crown,
  Rocket,
  Globe,
  CheckCircle2,
  Circle,
  Loader2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

interface SocialAccount {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  connected: boolean
}

interface Goal {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const socialAccounts: SocialAccount[] = [
  { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-black", connected: false },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500", connected: false },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600", connected: false },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", connected: false },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600", connected: false },
]

const goals: Goal[] = [
  { id: "grow", label: "Grow my audience", icon: Users, description: "Increase followers and reach" },
  { id: "engagement", label: "Boost engagement", icon: MessageSquare, description: "Get more likes, comments, shares" },
  { id: "schedule", label: "Schedule content", icon: Calendar, description: "Plan and automate posting" },
  { id: "analytics", label: "Track performance", icon: BarChart3, description: "Monitor metrics and insights" },
  { id: "brand", label: "Build my brand", icon: Crown, description: "Establish consistent presence" },
  { id: "time", label: "Save time", icon: Zap, description: "Streamline social media work" },
]

const steps = [
  { id: 1, title: "Welcome", subtitle: "Let's get you started" },
  { id: 2, title: "Your Profile", subtitle: "Tell us about yourself" },
  { id: 3, title: "Connect Accounts", subtitle: "Link your social profiles" },
  { id: 4, title: "Your Goals", subtitle: "What do you want to achieve?" },
  { id: 5, title: "All Set!", subtitle: "You're ready to go" },
]

export function OnboardingWizard({ open, onOpenChange, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    role: "",
    teamSize: "",
    avatar: "",
  })
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConnectAccount = async (accountId: string) => {
    setIsConnecting(accountId)
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setConnectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    )
    setIsConnecting(null)
  }

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem("onboarding_completed", "true")
    localStorage.setItem("onboarding_data", JSON.stringify({
      ...formData,
      connectedAccounts,
      selectedGoals,
    }))
    onComplete?.()
    onOpenChange(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return formData.fullName.trim().length > 0
      case 3:
        return true // Accounts are optional
      case 4:
        return selectedGoals.length > 0
      case 5:
        return true
      default:
        return true
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 pt-6 px-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 transition-all",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pt-4 min-h-[400px] flex flex-col">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to SocialFlow! 🎉</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                We're excited to have you here. Let's set up your account in just a few steps
                so you can start managing your social media like a pro.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Multi-Platform</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-xs font-medium">AI-Powered</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-xs font-medium">Analytics</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {currentStep === 2 && (
            <div className="flex-1">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-1">{steps[1].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[1].subtitle}</p>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-primary/20">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {formData.fullName.split(" ").map((n) => n[0]).join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company / Brand Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input
                      id="role"
                      placeholder="Marketing Manager"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      placeholder="1-5"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Connect Accounts */}
          {currentStep === 3 && (
            <div className="flex-1">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-1">{steps[2].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[2].subtitle}</p>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                {socialAccounts.map((account) => {
                  const isConnected = connectedAccounts.includes(account.id)
                  const isLoading = isConnecting === account.id
                  return (
                    <button
                      key={account.id}
                      onClick={() => handleConnectAccount(account.id)}
                      disabled={isLoading}
                      className={cn(
                        "w-full p-4 rounded-xl border transition-all flex items-center gap-4",
                        isConnected
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", account.color)}>
                        <account.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left font-medium">{account.name}</span>
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      ) : isConnected ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )
                })}
                <p className="text-xs text-center text-muted-foreground mt-4">
                  You can always connect more accounts later in Settings
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === 4 && (
            <div className="flex-1">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-1">{steps[3].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[3].subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {goals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleToggleGoal(goal.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <goal.icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                      <p className="font-medium text-sm">{goal.label}</p>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're All Set! 🚀</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Your account is ready. Start creating amazing content and growing your social presence.
              </p>
              <div className="bg-muted/50 rounded-2xl p-6 max-w-sm w-full">
                <h3 className="font-semibold mb-4">Quick Summary</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Connected Accounts</span>
                    <span className="font-medium">{connectedAccounts.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Selected Goals</span>
                    <span className="font-medium">{selectedGoals.length}</span>
                  </div>
                  {formData.companyName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Company</span>
                      <span className="font-medium">{formData.companyName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {currentStep === steps.length ? (
            <Button onClick={handleComplete} className="gap-2">
              Get Started
              <Rocket className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to check if onboarding should be shown
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed")
    if (!completed) {
      setShowOnboarding(true)
    }
    setIsLoaded(true)
  }, [])

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed")
    localStorage.removeItem("onboarding_data")
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    setShowOnboarding,
    isLoaded,
    resetOnboarding,
  }
}
