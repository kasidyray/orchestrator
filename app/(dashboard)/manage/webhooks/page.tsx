"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { WebhookEndpointForm } from "@/components/features/setup/webhooks/webhook-endpoint-form"
import { WebhookSigningSecret } from "@/components/features/setup/webhooks/webhook-signing-secret"
import { WebhookDeliveryLogs } from "@/components/features/setup/webhooks/webhook-delivery-logs"
import { useDataset } from "@/hooks/use-dataset"

export default function WebhooksPage() {
  const { webhookLogs, hasSampleData } = useDataset()

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Webhooks"
        description="Receive real-time event notifications at your endpoint."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} />
            Add endpoint
          </Button>
        }
      />
      <WebhookEndpointForm
        initialUrl={
          hasSampleData ? "https://api.kudalite.africa/webhooks/optimus" : ""
        }
      />
      <WebhookSigningSecret />
      <WebhookDeliveryLogs logs={webhookLogs} />
    </PageContainer>
  )
}
