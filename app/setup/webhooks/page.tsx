"use client"

import { PageHeader } from "@/components/shared/page-header"
import { WebhookEndpointForm } from "@/components/features/setup/webhooks/webhook-endpoint-form"
import { WebhookSigningSecret } from "@/components/features/setup/webhooks/webhook-signing-secret"
import { WebhookDeliveryLogs } from "@/components/features/setup/webhooks/webhook-delivery-logs"
import { useDataset } from "@/hooks/use-dataset"

export default function WebhooksSetupPage() {
  const { webhookLogs, hasSampleData } = useDataset()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-12">
      <PageHeader
        title="Webhooks"
        description="Receive real-time event notifications at your endpoint."
      />
      <WebhookEndpointForm
        initialUrl={
          hasSampleData ? "https://api.kudalite.africa/webhooks/optimus" : ""
        }
      />
      <WebhookSigningSecret />
      <WebhookDeliveryLogs logs={webhookLogs} />
    </div>
  )
}
