"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { TierSheet } from "@/components/features/kyc/tier-sheet"
import { TierCheckChips } from "@/components/features/kyc/tier-check-chips"
import { TierDeleteDialog } from "@/components/features/kyc/tier-delete-dialog"
import { ConfigProvenance } from "@/components/features/configuration/config-provenance"
import {
  buildInitialTiers,
  inheritedChecks,
  introducedReqIds,
} from "@/components/features/kyc/kyc-state"
import { useTierEditor } from "@/components/features/kyc/use-tier-editor"
import { formatNairaShort } from "@/lib/utils"
import { useAppStore } from "@/store"

/** Seed provenance so the section reads as a living config, not a blank slate. */
const SEED_LAST_CHANGED = "2024-06-19T16:45:00.000Z"

/**
 * KYC & identity policy management. Lists the configured tiers in a table and
 * edits each one in the shared tier sheet. Each add/edit/remove persists
 * immediately — there's no batch save — and refreshes the "last updated" line.
 */
export function KycPolicy() {
  const logActivity = useAppStore((state) => state.logActivity)
  const actorName = useAppStore((state) => state.currentUser?.name) ?? "You"

  const [loading, setLoading] = React.useState(true)
  const [lastChanged, setLastChanged] = React.useState<{
    by: string
    at: string
  }>(() => ({ by: actorName, at: SEED_LAST_CHANGED }))

  const editor = useTierEditor(buildInitialTiers, (change) => {
    const name = change.tier.name || "untitled"
    const description =
      change.type === "added"
        ? `Added the “${name}” KYC tier`
        : change.type === "updated"
          ? `Updated the “${name}” KYC tier`
          : `Removed the “${name}” KYC tier`
    setLastChanged({ by: actorName, at: new Date().toISOString() })
    logActivity({
      action: "kyc.updated",
      target: "KYC configuration",
      description,
    })
  })
  const { tiers } = editor

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <KycPolicySkeleton />

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-foreground">Tiers</h2>
            <p className="text-[13px] text-muted-foreground">
              Your verification ladder — each tier inherits the checks below
              it. Select one to edit.
            </p>
          </div>
          <Button size="sm" onClick={editor.openCreate}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add tier
          </Button>
        </div>

        {tiers.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No tiers yet. Add one to define your verification levels.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Daily limit</TableHead>
                  <TableHead>Max balance</TableHead>
                  <TableHead>Checks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier, index) => {
                  const inherited = inheritedChecks(tiers, index).size
                  const introduced = introducedReqIds(tiers, index).length
                  return (
                    <TableRow
                      key={tier.id}
                      onClick={() => editor.openEdit(tier.id)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[11px] font-bold text-foreground">
                            T{index + 1}
                          </span>
                          <span className="font-medium text-foreground">
                            {tier.name || "Untitled tier"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {formatNairaShort(tier.daily)}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {formatNairaShort(tier.balance)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <TierCheckChips ladder={tiers} index={index} />
                          {inherited > 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {inherited} inherited · {introduced} new
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${tier.name || "tier"}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            editor.requestRemove(tier.id)
                          }}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="border-t border-border px-4 py-3">
          <ConfigProvenance by={lastChanged.by} at={lastChanged.at} />
        </div>
      </div>

      <TierSheet
        open={editor.sheetOpen}
        onOpenChange={editor.handleSheetOpenChange}
        draft={editor.draft}
        editing={Boolean(editor.editingId)}
        ladder={editor.ladder}
        insertIndex={editor.insertIndex}
        onInsertIndexChange={editor.setInsertIndex}
        onNameChange={(value) => editor.patchDraft({ name: value })}
        onDailyChange={(value) => editor.patchDraft({ daily: value })}
        onBalanceChange={(value) => editor.patchDraft({ balance: value })}
        onToggleReq={editor.toggleReq}
        onProviderChange={editor.setProvider}
        onSubmit={editor.submitTier}
      />

      <TierDeleteDialog
        target={editor.deleteTarget}
        tiers={tiers}
        onCancel={editor.cancelRemove}
        onConfirm={editor.confirmRemove}
      />
    </div>
  )
}

function KycPolicySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
        <TableSkeleton columns={5} rows={3} />
      </div>
    </div>
  )
}
