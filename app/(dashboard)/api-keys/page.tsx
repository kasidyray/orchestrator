"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import {
  ApiKeysManager,
  type ApiKeysManagerHandle,
} from "@/components/features/setup/api-keys/api-keys-manager"
import { useDataset } from "@/hooks/use-dataset"

export default function ApiKeysPage() {
  const { apiKeys } = useDataset()
  const managerRef = React.useRef<ApiKeysManagerHandle>(null)

  return (
    <PageContainer width="wide">
      <PageHeader
        title="API keys"
        description="Create and manage the credentials your integration uses."
        actions={
          <Button size="sm" onClick={() => managerRef.current?.openCreate()}>
            <HugeiconsIcon icon={PlusSignIcon} />
            Create key
          </Button>
        }
      />
      <ApiKeysManager
        ref={managerRef}
        initialKeys={apiKeys}
        showCreateButton={false}
      />
    </PageContainer>
  )
}
