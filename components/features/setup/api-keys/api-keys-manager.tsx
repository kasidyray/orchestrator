"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Key01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
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
import { CreateApiKeyDialog } from "@/components/features/setup/api-keys/create-api-key-dialog"
import { API_KEY_STATUS_CONFIG } from "@/lib/constants"
import { formatDate, truncateId } from "@/lib/utils"
import type { APIKey } from "@/lib/types"

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
  const [revokeTarget, setRevokeTarget] = React.useState<APIKey | null>(null)
  const [revoking, setRevoking] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  React.useImperativeHandle(ref, () => ({ openCreate: () => setCreateOpen(true) }), [])

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
            <Button size="sm" onClick={() => setCreateOpen(true)}>
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
          action={<Button onClick={() => setCreateOpen(true)}>Create key</Button>}
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

      <CreateApiKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(key) => setKeys((prev) => [key, ...prev])}
      />

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
