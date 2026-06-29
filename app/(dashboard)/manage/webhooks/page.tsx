"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { WebhookEndpoints } from "@/components/features/setup/webhooks/webhook-endpoints"
import { WebhookSigningSecret } from "@/components/features/setup/webhooks/webhook-signing-secret"
import { WebhookDeliveryLogs } from "@/components/features/setup/webhooks/webhook-delivery-logs"
import { useDataset } from "@/hooks/use-dataset"

export default function WebhooksPage() {
  const { webhookLogs, hasSampleData } = useDataset()

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Webhooks"
        description="Receive real-time event notifications at your endpoints."
      />
      <WebhookEndpoints
        initialUrl={
          hasSampleData ? "https://api.kudalite.africa/webhooks/optimus" : ""
        }
      />
      <WebhookSigningSecret />
      <WebhookDeliveryLogs logs={webhookLogs} />
    </PageContainer>
  )
}
