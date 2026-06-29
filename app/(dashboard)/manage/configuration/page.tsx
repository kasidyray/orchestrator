"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ConfigurationTabs } from "@/components/features/configuration/configuration-tabs"
import { useDataset } from "@/hooks/use-dataset"
import { useEnvironment } from "@/hooks/use-environment"
import { WALLET_PRODUCT_CATALOG } from "@/lib/constants"

export default function ConfigurationPage() {
  const { wallets } = useDataset()
  const { environment } = useEnvironment()
  const isLive = environment === "live"

  return (
    <PageContainer width="wide" className="flex-1">
      <PageHeader
        title="Configuration"
        description="Manage the wallet products and verification policies your customers use."
      />

      {isLive ? (
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-3.5 py-3 text-sm">
          <HugeiconsIcon
            icon={Alert02Icon}
            className="mt-0.5 size-4.5 shrink-0 text-warning"
          />
          <p className="text-foreground/80">
            You&apos;re editing{" "}
            <span className="font-medium text-foreground">live</span>{" "}
            configuration. Changes take effect for real customers as soon as you
            save.
          </p>
        </div>
      ) : null}

      <ConfigurationTabs products={WALLET_PRODUCT_CATALOG} wallets={wallets} />
    </PageContainer>
  )
}
