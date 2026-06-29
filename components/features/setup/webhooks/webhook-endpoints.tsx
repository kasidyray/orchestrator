"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Globe02Icon,
  PlusSignIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/shared/section-card"
import { EmptyState } from "@/components/shared/empty-state"
import {
  CreateWebhookDialog,
  type NewWebhook,
} from "@/components/features/setup/webhooks/create-webhook-dialog"

interface Endpoint {
  id: string
  url: string
  events: string[]
}

interface WebhookEndpointsProps {
  initialUrl: string
  /** Called whenever an endpoint is added (e.g. to complete a setup step). */
  onCreated?: () => void
}

export function WebhookEndpoints({ initialUrl, onCreated }: WebhookEndpointsProps) {
  const [endpoints, setEndpoints] = React.useState<Endpoint[]>(
    initialUrl ? [{ id: "wh_sample", url: initialUrl, events: [] }] : []
  )
  const [open, setOpen] = React.useState(false)
  const seqRef = React.useRef(0)

  function handleCreated(webhook: NewWebhook) {
    seqRef.current += 1
    setEndpoints((prev) => [
      ...prev,
      { id: `wh_${seqRef.current}`, url: webhook.url, events: webhook.events },
    ])
    onCreated?.()
  }

  function removeEndpoint(id: string) {
    setEndpoints((prev) => prev.filter((endpoint) => endpoint.id !== id))
  }

  return (
    <>
      <SectionCard
        title="Endpoints"
        description="We'll POST event notifications to these URLs over HTTPS."
        actions={
          endpoints.length > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add webhook
            </Button>
          ) : null
        }
        contentClassName={endpoints.length === 0 ? "p-0" : undefined}
      >
        {endpoints.length === 0 ? (
          <EmptyState
            icon={WebhookIcon}
            title="No endpoints yet"
            description="Add an endpoint to start receiving real-time event notifications."
            action={
              <Button onClick={() => setOpen(true)}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                Add webhook
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {endpoints.map((endpoint) => (
              <li
                key={endpoint.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={Globe02Icon} className="size-4.5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-mono text-sm text-foreground">
                    {endpoint.url}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {endpoint.events.length || "all"}{" "}
                    {endpoint.events.length === 1 ? "event" : "events"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeEndpoint(endpoint.id)}
                  aria-label={`Remove ${endpoint.url}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <CreateWebhookDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={handleCreated}
      />
    </>
  )
}
