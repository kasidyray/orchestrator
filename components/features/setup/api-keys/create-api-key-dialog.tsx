"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/shared/copy-button"
import { Spinner } from "@/components/shared/spinner"
import type { APIKey } from "@/lib/types"

function randomToken(length: number) {
  const chars = "abcdef0123456789"
  let out = ""
  for (let index = 0; index < length; index += 1) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

interface GeneratedKey {
  clientId: string
  secret: string
}

interface CreateApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called once a key is generated — e.g. to add it to a list or complete a step. */
  onCreated: (key: APIKey) => void
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateApiKeyDialogProps) {
  const [label, setLabel] = React.useState("")
  const [labelError, setLabelError] = React.useState<string | undefined>()
  const [creating, setCreating] = React.useState(false)
  const [generated, setGenerated] = React.useState<GeneratedKey | null>(null)

  function resetForm() {
    setLabel("")
    setLabelError(undefined)
    setCreating(false)
    setGenerated(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm()
    onOpenChange(next)
  }

  async function handleCreate() {
    if (!label.trim()) {
      setLabelError("Give your key a label")
      return
    }
    setLabelError(undefined)
    setCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const secret = `sk_test_${randomToken(36)}`
    const clientId = `kuda_test_${randomToken(20)}`
    const newKey: APIKey = {
      id: `key_test_${randomToken(4)}`,
      label: label.trim(),
      maskedKey: `sk_test_••••••••••••${secret.slice(-4)}`,
      environment: "test",
      status: "active",
      createdBy: "Ikedi Eze",
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      expiresAt: null,
    }

    onCreated(newKey)
    setGenerated({ clientId, secret })
    setCreating(false)
    toast.success("API key created")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {generated ? (
          <>
            <DialogHeader>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                Copy your secret key now — for security, you won&apos;t be able to
                see it again.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-3.5 py-3 text-sm">
              <HugeiconsIcon
                icon={Alert02Icon}
                className="mt-0.5 size-4.5 shrink-0 text-warning"
              />
              <p className="text-muted-foreground">
                Store this secret in a secure place. Anyone with it can call the
                API as your organisation.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <SecretField label="Client ID" value={generated.clientId} />
              <SecretField label="Secret key" value={generated.secret} />
            </div>

            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Give your key a recognisable label, like &quot;Production
                server&quot;.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <Label htmlFor="key-label">Label</Label>
              <Input
                id="key-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Production server"
                aria-invalid={Boolean(labelError)}
                autoFocus
                disabled={creating}
              />
              {labelError ? (
                <p className="text-xs text-destructive">{labelError}</p>
              ) : null}
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <>
                    <Spinner /> Creating…
                  </>
                ) : (
                  "Create key"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SecretField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
          {value}
        </code>
        <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />
      </div>
    </div>
  )
}
