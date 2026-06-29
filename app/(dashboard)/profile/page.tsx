"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ProfileSettings } from "@/components/features/settings/profile-settings"
import { useSession } from "@/hooks/use-session"

export default function ProfilePage() {
  const { user } = useSession()

  if (!user) return null

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Profile settings"
        description="Manage your personal account details and preferences."
      />
      <ProfileSettings user={user} />
    </PageContainer>
  )
}
