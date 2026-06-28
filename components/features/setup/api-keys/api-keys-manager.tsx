"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  Key01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardHeader } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { CopyButton } from "@/components/shared/copy-button"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { Spinner } from "@/components/shared/spinner"
import { API_KEY_STATUS_CONFIG } from "@/lib/constants"
import { formatDate, truncateId } from "@/lib/utils"
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

export interface ApiKeysManagerHandle {
  openCreate: () => void
}

export function ApiKeysManager({
  initialKeys,
  ref,
  showCreateButton = true,
}: {
  initialKeys: APIKey[]
  /** Imperative handle so a page-level header can trigger key creation. */
  ref?: React.Ref<ApiKeysManagerHandle>
  /** Render the in-card "Create key" button. Set false when the page header owns it. */
  showCreateButton?: boolean
}) {
  const [keys, setKeys] = React.useState<APIKey[]>(initialKeys)
  const [loading, setLoading] = React.useState(true)

  const [createOpen, setCreateOpen] = React.useState(false)
  const [label, setLabel] = React.useState("")
  const [labelError, setLabelError] = React.useState<string | undefined>()
  const [creating, setCreating] = React.useState(false)
  const [generated, setGenerated] = React.useState<GeneratedKey | null>(null)

  const [revokeTarget, setRevokeTarget] = React.useState<APIKey | null>(null)
  const [revoking, setRevoking] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  function openCreate() {
    setLabel("")
    setLabelError(undefined)
    setGenerated(null)
    setCreateOpen(true)
  }

  React.useImperativeHandle(ref, () => ({ openCreate }), [])

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

    setKeys((prev) => [newKey, ...prev])
    setGenerated({ clientId, secret })
    setCreating(false)
    toast.success("API key created")
  }

  async function handleRevoke() {
    if (!revokeTarget) return
    setRevoking(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setKeys((prev) =>
      prev.map((key) =>
        key.id === revokeTarget.id ? { ...key, status: "revoked" } : key
      )
    )
    setRevoking(false)
    const revokedLabel = revokeTarget.label
    setRevokeTarget(null)
    toast.success(`Revoked “${revokedLabel}”`)
  }

  return (
    <Card>
      {showCreateButton ? (
        <CardHeader className="border-b">
          <CardAction>
            <Button size="sm" onClick={openCreate}>
              <HugeiconsIcon icon={PlusSignIcon} />
              Create key
            </Button>
          </CardAction>
        </CardHeader>
      ) : null}

      {loading ? (
        <TableSkeleton columns={6} rows={3} />
      ) : keys.length === 0 ? (
        <EmptyState
          icon={Key01Icon}
          title="No API keys yet"
          description="Create your first key to start integrating with the API."
          action={<Button onClick={openCreate}>Create key</Button>}
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <code className="font-mono text-xs text-muted-foreground">
                        {truncateId(key.id, 8, 4)}
                      </code>
                      <CopyButton
                        value={key.id}
                        label="Copy client ID"
                        size="icon-xs"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                      {key.environment}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge {...API_KEY_STATUS_CONFIG[key.status]} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {key.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setRevokeTarget(key)}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / reveal dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          {generated ? (
            <>
              <DialogHeader>
                <DialogTitle>API key created</DialogTitle>
                <DialogDescription>
                  Copy your secret key now — for security, you won&apos;t be able
                  to see it again.
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
                <Button onClick={() => setCreateOpen(false)}>Done</Button>
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
                  disabled={creating}
                />
                {labelError ? (
                  <p className="text-xs text-destructive">{labelError}</p>
                ) : null}
              </div>

              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
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

      {/* Revoke confirmation */}
      <Dialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this key?</DialogTitle>
            <DialogDescription>
              Revoking{" "}
              <span className="font-medium text-foreground">
                {revokeTarget?.label}
              </span>{" "}
              will immediately break any integration using it. This can&apos;t be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revoking}
            >
              {revoking ? (
                <>
                  <Spinner /> Revoking…
                </>
              ) : (
                "Revoke key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
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
