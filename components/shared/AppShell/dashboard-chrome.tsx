"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { AppShell } from "@/components/shared/AppShell/app-shell"
import { Spinner } from "@/components/shared/spinner"
import { useSession } from "@/hooks/use-session"

/**
 * Auth gate + chrome for the dashboard route group. Reads the (mock) session
 * and renders the AppShell around it; redirects to /login when no one is signed
 * in. The hydration check prevents a redirect flash before the persisted
 * session has loaded.
 *
 * MOCK: when real auth lands, keep this guard but source the session from your
 * auth provider instead of the local store.
 */
export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, org, isAuthenticated, hasHydrated } = useSession()

  React.useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated || !isAuthenticated || !user || !org) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        <Spinner />
      </div>
    )
  }

  return <AppShell>{children}</AppShell>
}
