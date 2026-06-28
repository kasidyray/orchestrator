"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Globe02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionCard } from "@/components/shared/section-card"
import { Spinner } from "@/components/shared/spinner"

export function WebhookEndpointForm({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = React.useState(initialUrl)
  const [error, setError] = React.useState<string | undefined>()
  const [saving, setSaving] = React.useState(false)

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()

    if (!url.trim()) {
      setError("Enter your webhook endpoint URL")
      return
    }
    if (!url.startsWith("https://")) {
      setError("HTTPS required — your URL must start with https://")
      return
    }
    setError(undefined)

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    toast.success("Webhook endpoint saved")
  }

  return (
    <SectionCard
      title="Endpoint URL"
      description="We'll POST event notifications to this URL over HTTPS."
    >
      <form onSubmit={handleSave} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="webhook-url">Endpoint URL</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
              <HugeiconsIcon icon={Globe02Icon} className="size-4" />
            </span>
            <Input
              id="webhook-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://api.yourdomain.com/webhooks"
              aria-invalid={Boolean(error)}
              className="pl-8.5 font-mono text-sm"
            />
          </div>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              "Save endpoint"
            )}
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}
