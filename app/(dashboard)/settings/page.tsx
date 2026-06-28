"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { GeneralSettings } from "@/components/features/settings/general-settings"
import { useSession } from "@/hooks/use-session"

export default function SettingsPage() {
  const { org } = useSession()

  if (!org) return null

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Organisation settings"
        description="Manage your business profile and organisation details."
      />
      <GeneralSettings org={org} />
    </PageContainer>
  )
}
