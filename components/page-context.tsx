"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import type { LucideIcon } from "lucide-react"

interface PageAction {
  id: string
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  className?: string
}

interface PageContextValue {
  title: string
  setTitle: (title: string) => void
  icon: LucideIcon | null
  setIcon: (icon: LucideIcon | null) => void
  subtitle: string
  setSubtitle: (subtitle: string) => void
  actions: PageAction[]
  setActions: (actions: PageAction[]) => void
  breadcrumbs: { label: string; href?: string }[]
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void
}

const PageContext = createContext<PageContextValue | undefined>(undefined)

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("")
  const [icon, setIcon] = useState<LucideIcon | null>(null)
  const [subtitle, setSubtitle] = useState("")
  const [actions, setActions] = useState<PageAction[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href?: string }[]>([])

  return (
    <PageContext.Provider
      value={{
        title,
        setTitle,
        icon,
        setIcon,
        subtitle,
        setSubtitle,
        actions,
        setActions,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export function usePageContext() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider")
  }
  return context
}

export function usePageHeader({
  title,
  icon,
  subtitle,
  actions,
  breadcrumbs,
}: {
  title: string
  icon?: LucideIcon
  subtitle?: string
  actions?: PageAction[]
  breadcrumbs?: { label: string; href?: string }[]
}) {
  const context = usePageContext()

  React.useEffect(() => {
    context.setTitle(title)
    context.setIcon(icon || null)
    context.setSubtitle(subtitle || "")
    context.setActions(actions || [])
    context.setBreadcrumbs(breadcrumbs || [])

    return () => {
      context.setTitle("")
      context.setIcon(null)
      context.setSubtitle("")
      context.setActions([])
      context.setBreadcrumbs([])
    }
  }, [title, icon, subtitle, actions, breadcrumbs])
}

export type { PageAction }
