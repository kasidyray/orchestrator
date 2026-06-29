"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import { PageHeader } from "@/components/shared/page-header"
import { WebhookEndpoints } from "@/components/features/setup/webhooks/webhook-endpoints"
import { useDataset } from "@/hooks/use-dataset"
import { useAppStore } from "@/store"

export default function WebhooksSetupPage() {
  const { hasSampleData } = useDataset()
  const setSetupStep = useAppStore((state) => state.setSetupStep)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-12">
      <PageHeader
        title="Add a webhook"
        description="Add one endpoint to start receiving real-time event notifications."
      />

      <div className="flex items-start gap-3 rounded-lg border border-info/20 bg-info/5 px-3.5 py-3 text-sm">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 size-4.5 shrink-0 text-info"
        />
        <p className="text-muted-foreground">
          One endpoint completes this step. You can add more, change events, view
          the signing secret, and inspect delivery logs anytime from your webhook
          settings.
        </p>
      </div>

      <WebhookEndpoints
        initialUrl={
          hasSampleData ? "https://api.kudalite.africa/webhooks/optimus" : ""
        }
        onCreated={() => setSetupStep("webhooks", true)}
      />
    </div>
  )
}
