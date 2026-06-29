"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Globe02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/shared/spinner"
import { WEBHOOK_EVENTS } from "@/lib/constants"

export interface NewWebhook {
  url: string
  events: string[]
}

const ALL_EVENTS = WEBHOOK_EVENTS.map((item) => item.event)

interface CreateWebhookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (webhook: NewWebhook) => void
}

export function CreateWebhookDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWebhookDialogProps) {
  const [url, setUrl] = React.useState("")
  const [events, setEvents] = React.useState<string[]>(ALL_EVENTS)
  const [error, setError] = React.useState<string | undefined>()
  const [saving, setSaving] = React.useState(false)

  function resetForm() {
    setUrl("")
    setEvents(ALL_EVENTS)
    setError(undefined)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    onOpenChange(next)
  }

  function toggleEvent(event: string) {
    setEvents((prev) =>
      prev.includes(event)
        ? prev.filter((item) => item !== event)
        : [...prev, event]
    )
  }

  async function handleSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault()
    if (!url.trim()) {
      setError("Enter your webhook endpoint URL")
      return
    }
    if (!url.startsWith("https://")) {
      setError("HTTPS required — your URL must start with https://")
      return
    }
    if (events.length === 0) {
      setError("Select at least one event to subscribe to")
      return
    }
    setError(undefined)

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)

    onCreated({ url: url.trim(), events })
    handleOpenChange(false)
    toast.success("Webhook endpoint added")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a webhook endpoint</DialogTitle>
          <DialogDescription>
            We&apos;ll send a POST request to this URL for the events you select.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-webhook-url">Endpoint URL</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
                <HugeiconsIcon icon={Globe02Icon} className="size-4" />
              </span>
              <Input
                id="new-webhook-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://api.yourdomain.com/webhooks"
                aria-invalid={Boolean(error)}
                autoFocus
                className="pl-8.5 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Label>Events to send</Label>
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {WEBHOOK_EVENTS.map((item) => (
                <label
                  key={item.event}
                  className="flex cursor-pointer items-start gap-3 px-3 py-2.5 select-none"
                >
                  <Checkbox
                    checked={events.includes(item.event)}
                    onCheckedChange={() => toggleEvent(item.event)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-mono text-xs font-medium text-foreground">
                      {item.event}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner /> Adding…
                </>
              ) : (
                "Add webhook"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
