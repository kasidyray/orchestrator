"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import {
  TeamSettings,
  type TeamSettingsHandle,
} from "@/components/features/settings/team-settings"
import { useDataset } from "@/hooks/use-dataset"

export default function MembersPage() {
  const { teamMembers } = useDataset()
  const teamRef = React.useRef<TeamSettingsHandle>(null)

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Members"
        description="Invite teammates and manage their roles and access."
        actions={
          <Button size="sm" onClick={() => teamRef.current?.openInvite()}>
            <HugeiconsIcon icon={PlusSignIcon} />
            Invite member
          </Button>
        }
      />
      <TeamSettings
        ref={teamRef}
        members={teamMembers}
        showInviteButton={false}
      />
    </PageContainer>
  )
}
