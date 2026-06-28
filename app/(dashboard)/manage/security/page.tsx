"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SecuritySettings } from "@/components/features/settings/security-settings"

export default function SecurityPage() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="Security"
        description="Update your password and manage two-factor authentication."
      />
      <SecuritySettings />
    </PageContainer>
  )
}
