"use client"

import { PageHeader } from "@/components/shared/page-header"
import { ApiKeysManager } from "@/components/features/setup/api-keys/api-keys-manager"
import { useDataset } from "@/hooks/use-dataset"

export default function ApiKeysSetupPage() {
  const { apiKeys } = useDataset()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-12">
      <PageHeader
        title="API keys"
        description="Create and manage the credentials your integration uses."
      />
      <ApiKeysManager initialKeys={apiKeys} />
    </div>
  )
}
