"use client"

import * as React from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalHeader } from "@/components/global-header"
import { PageProvider } from "@/components/page-context"
import { CommandPalette, useCommandPalette } from "@/components/command-palette"
import { OnboardingWizard, useOnboarding } from "@/components/onboarding-wizard"
import { TooltipProvider } from "@/components/ui/tooltip"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { open, setOpen } = useCommandPalette()
  const { showOnboarding, setShowOnboarding, isLoaded } = useOnboarding()

  return (
    <TooltipProvider delayDuration={200}>
      <PageProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <GlobalHeader />
            <main className="flex-1 flex flex-col overflow-hidden">
              {children}
            </main>
          </div>
        </div>
        <CommandPalette open={open} onOpenChange={setOpen} />
        {isLoaded && (
          <OnboardingWizard
            open={showOnboarding}
            onOpenChange={setShowOnboarding}
            onComplete={() => setShowOnboarding(false)}
          />
        )}
      </PageProvider>
    </TooltipProvider>
  )
}
