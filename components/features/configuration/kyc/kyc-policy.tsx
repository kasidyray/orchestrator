"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

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
import { ConfigProvenance } from "@/components/features/configuration/config-provenance"
import {
  buildReqs,
  buildInitialTiers,
} from "@/components/features/kyc/kyc-state"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { formatNairaShort } from "@/lib/utils"
import { useAppStore } from "@/store"
import type { KycTierState } from "@/components/features/kyc/kyc-types"

/** Seed provenance so the section reads as a living config, not a blank slate. */
const SEED_LAST_CHANGED = "2024-06-19T16:45:00.000Z"

function blankDraft(): KycTierState {
  return { id: "", name: "", daily: 0, balance: 0, reqs: buildReqs({}) }
}

/**
 * KYC & identity policy management. Lists the configured tiers in a table and
 * edits each one in the shared tier sheet. Each add/edit/remove persists
 * immediately — there's no batch save — and refreshes the "last updated" line.
 */
export function KycPolicy() {
  const logActivity = useAppStore((state) => state.logActivity)
  const actorName = useAppStore((state) => state.currentUser?.name) ?? "You"

  const [tiers, setTiers] = React.useState<KycTierState[]>(buildInitialTiers)
  const [draft, setDraft] = React.useState<KycTierState>(blankDraft)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [lastChanged, setLastChanged] = React.useState<{
    by: string
    at: string
  }>(() => ({ by: actorName, at: SEED_LAST_CHANGED }))
  const seqRef = React.useRef(tiers.length)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  function recordChange(description: string) {
    setLastChanged({ by: actorName, at: new Date().toISOString() })
    logActivity({
      action: "kyc.updated",
      target: "KYC configuration",
      description,
    })
  }

  function patchDraft(update: Partial<KycTierState>) {
    setDraft((prev) => ({ ...prev, ...update }))
  }

  function toggleReq(reqId: string, on: boolean) {
    setDraft((prev) => ({
      ...prev,
      reqs: { ...prev.reqs, [reqId]: { ...prev.reqs[reqId], on } },
    }))
  }

  function setProvider(reqId: string, providerId: string) {
    setDraft((prev) => ({
      ...prev,
      reqs: { ...prev.reqs, [reqId]: { on: true, provider: providerId } },
    }))
  }

  function resetDraft() {
    setDraft(blankDraft())
    setEditingId(null)
  }

  function openCreate() {
    resetDraft()
    setSheetOpen(true)
  }

  function openEdit(id: string) {
    const tier = tiers.find((item) => item.id === id)
    if (!tier) return
    setDraft({ ...tier, reqs: { ...tier.reqs } })
    setEditingId(id)
    setSheetOpen(true)
  }

  function handleSheetOpenChange(next: boolean) {
    setSheetOpen(next)
    if (!next) resetDraft()
  }

  function submitTier() {
    const name = draft.name.trim()
    if (!name) {
      toast.error("Give the tier a name")
      return
    }
    const enabledReqs = KYC_REQUIREMENT_CATALOG.filter(
      (req) => draft.reqs[req.id]?.on
    )
    if (enabledReqs.length === 0) {
      toast.error("Turn on at least one verification check")
      return
    }
    const missing = enabledReqs.find((req) => !draft.reqs[req.id]?.provider)
    if (missing) {
      toast.error(`Choose a provider for ${missing.label}`)
      return
    }

    if (editingId) {
      setTiers((prev) =>
        prev.map((tier) =>
          tier.id === editingId ? { ...draft, id: editingId, name } : tier
        )
      )
      recordChange(`Updated the “${name}” KYC tier`)
      toast.success("Tier updated")
    } else {
      seqRef.current += 1
      setTiers((prev) => [
        ...prev,
        { ...draft, id: `tier-${seqRef.current}`, name },
      ])
      recordChange(`Added the “${name}” KYC tier`)
      toast.success("Tier added")
    }
    setSheetOpen(false)
    resetDraft()
  }

  function removeTier(id: string) {
    const tier = tiers.find((item) => item.id === id)
    setTiers((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) resetDraft()
    recordChange(`Removed the “${tier?.name || "untitled"}” KYC tier`)
    toast.success("Tier removed")
  }

  if (loading) return <KycPolicySkeleton />

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-foreground">Tiers</h2>
            <p className="text-[13px] text-muted-foreground">
              The verification levels customers can reach. Select one to edit.
            </p>
          </div>
          <Button size="sm" onClick={openCreate}>
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
                {tiers.map((tier, index) => (
                  <TableRow
                    key={tier.id}
                    onClick={() => openEdit(tier.id)}
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
                      <TierCheckChips tier={tier} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${tier.name || "tier"}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          removeTier(tier.id)
                        }}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="border-t border-border px-4 py-3">
          <ConfigProvenance by={lastChanged.by} at={lastChanged.at} />
        </div>
      </div>

      <TierSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        draft={draft}
        editing={Boolean(editingId)}
        onNameChange={(value) => patchDraft({ name: value })}
        onDailyChange={(value) => patchDraft({ daily: value })}
        onBalanceChange={(value) => patchDraft({ balance: value })}
        onToggleReq={toggleReq}
        onProviderChange={setProvider}
        onSubmit={submitTier}
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
