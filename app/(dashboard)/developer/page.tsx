import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Key01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { BaseUrlCard } from "@/components/docs/base-url-card"
import { DeveloperQuickLinks } from "@/components/features/developer/developer-quick-links"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { API_BASE_URL, API_SANDBOX_BASE_URL } from "@/lib/constants"

export default function DeveloperPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Developer"
        description="Keys, base URLs, and the documentation you need to integrate with the Optimus API."
        actions={
          <Button nativeButton={false} render={<Link href="/docs" target="_blank" rel="noopener" />}>
            Open the docs
            <HugeiconsIcon icon={ArrowUpRight01Icon} />
          </Button>
        }
      />

      <SectionCard
        title="Base URLs"
        description="All requests are made over HTTPS and authenticated with a secret key."
      >
        <div className="flex flex-col gap-3">
          <BaseUrlCard label="Live base URL" url={API_BASE_URL} />
          <BaseUrlCard label="Sandbox base URL" url={API_SANDBOX_BASE_URL} />
        </div>
      </SectionCard>

      <SectionCard
        title="API keys"
        description="Create, roll, and revoke the secret keys your integration signs requests with."
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/api-keys" />}
          >
            <HugeiconsIcon icon={Key01Icon} />
            Manage keys
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Test keys (<code className="font-mono text-xs">sk_test_…</code>) work
          against the sandbox; live keys (
          <code className="font-mono text-xs">sk_live_…</code>) move real
          money. Keep live keys server-side, always.
        </p>
      </SectionCard>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-foreground">
            Documentation
          </h2>
          <p className="text-sm text-muted-foreground">
            Guides and the full API reference now live on the standalone docs
            site.
          </p>
        </div>
        <DeveloperQuickLinks />
      </div>
    </PageContainer>
  )
}
