import type { ReactNode } from "react"

import { DashboardChrome } from "@/components/shared/AppShell/dashboard-chrome"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <DashboardChrome>{children}</DashboardChrome>
}
