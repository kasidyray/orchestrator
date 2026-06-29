"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard } from "@/components/shared/section-card"
import { Spinner } from "@/components/shared/spinner"
import { TierRail } from "@/components/features/kyc/tier-rail"
import { TierDetail } from "@/components/features/kyc/tier-detail"
import { ProvidersSummary } from "@/components/features/configuration/kyc/providers-summary"
import { ConfigProvenance } from "@/components/features/configuration/config-provenance"
import {
  buildReqs,
  buildInitialTiers,
} from "@/components/features/kyc/kyc-state"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { useAppStore } from "@/store"
import type { KycTierState } from "@/components/features/kyc/kyc-types"

/** Seed provenance so the section reads as a living config, not a blank slate. */
const SEED_LAST_CHANGED = "2024-06-19T16:45:00.000Z"

/**
 * KYC & identity policy management. Reuses the setup tier editor, reframed for
 * ongoing changes: edits stay on the page and persist via an explicit Save that
 * only lights up when there are unsaved changes.
 */
export function KycPolicy() {
  const logActivity = useAppStore((state) => state.logActivity)
  const actorName = useAppStore((state) => state.currentUser?.name) ?? "You"

  const [tiers, setTiers] = React.useState<KycTierState[]>(buildInitialTiers)
  const [selectedId, setSelectedId] = React.useState(() => tiers[0]?.id ?? "")
  const [loading, setLoading] = React.useState(true)
  const [dirty, setDirty] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [lastChanged, setLastChanged] = React.useState<{
    by: string
    at: string
  }>(() => ({ by: actorName, at: SEED_LAST_CHANGED }))
  const seqRef = React.useRef(tiers.length)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const selectedIndex = Math.max(
    0,
    tiers.findIndex((tier) => tier.id === selectedId)
  )
  const selectedTier = tiers[selectedIndex] ?? tiers[0]

  function patchTier(id: string, update: (tier: KycTierState) => KycTierState) {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? update(tier) : tier))
    )
    setDirty(true)
  }

  function addTier() {
    seqRef.current += 1
    const id = `tier-new-${seqRef.current}`
    setTiers((prev) => [
      ...prev,
      {
        id,
        name: `Tier ${prev.length + 1}`,
        daily: 0,
        balance: 0,
        reqs: buildReqs({}),
      },
    ])
    setSelectedId(id)
    setDirty(true)
  }

  function removeTier(id: string) {
    setTiers((prev) => {
      const next = prev.filter((tier) => tier.id !== id)
      if (id === selectedId) setSelectedId(next[0]?.id ?? "")
      return next
    })
    setDirty(true)
  }

  function toggleReq(id: string, reqId: string, on: boolean) {
    patchTier(id, (tier) => ({
      ...tier,
      reqs: { ...tier.reqs, [reqId]: { ...tier.reqs[reqId], on } },
    }))
  }

  function setProvider(id: string, reqId: string, providerId: string) {
    patchTier(id, (tier) => ({
      ...tier,
      reqs: { ...tier.reqs, [reqId]: { on: true, provider: providerId } },
    }))
  }

  /** Apply one provider to a check across every tier that requires it. */
  function setProviderForRequirement(reqId: string, providerId: string) {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.reqs[reqId]?.on
          ? {
              ...tier,
              reqs: {
                ...tier.reqs,
                [reqId]: { on: true, provider: providerId },
              },
            }
          : tier
      )
    )
    setDirty(true)
  }

  // Tallies across every tier.
  let configured = 0
  let pending = 0
  for (const tier of tiers) {
    for (const req of KYC_REQUIREMENT_CATALOG) {
      const state = tier.reqs[req.id]
      if (!state?.on) continue
      if (state.provider) configured += 1
      else pending += 1
    }
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    if (pending > 0) {
      toast.error(
        `${pending} ${pending === 1 ? "check needs" : "checks need"} a provider before saving`
      )
      return
    }
    setDirty(false)
    logActivity({
      action: "kyc.updated",
      target: "KYC configuration",
      description: `Updated KYC tiers and verification providers (${tiers.length} ${
        tiers.length === 1 ? "tier" : "tiers"
      }, ${configured} checks)`,
    })
    setLastChanged({ by: actorName, at: new Date().toISOString() })
    toast.success("KYC configuration updated")
  }

  if (loading) return <KycPolicySkeleton />
  if (!selectedTier) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col lg:min-h-[520px] lg:flex-row">
          <TierRail
            tiers={tiers}
            selectedId={selectedTier.id}
            onSelect={setSelectedId}
            onAddTier={addTier}
          />
          <TierDetail
            key={selectedTier.id}
            tier={selectedTier}
            index={selectedIndex}
            removable={tiers.length > 1}
            onRename={(name) =>
              patchTier(selectedTier.id, (t) => ({ ...t, name }))
            }
            onDailyChange={(daily) =>
              patchTier(selectedTier.id, (t) => ({ ...t, daily }))
            }
            onBalanceChange={(balance) =>
              patchTier(selectedTier.id, (t) => ({ ...t, balance }))
            }
            onToggleReq={(reqId, on) => toggleReq(selectedTier.id, reqId, on)}
            onProviderChange={(reqId, providerId) =>
              setProvider(selectedTier.id, reqId, providerId)
            }
            onRemoveTier={() => removeTier(selectedTier.id)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-muted-foreground">
              {tiers.length} {tiers.length === 1 ? "tier" : "tiers"} ·{" "}
              {configured} checks configured
              {pending > 0 ? (
                <span className="font-semibold text-warning">
                  {" "}
                  · {pending} {pending === 1 ? "check needs" : "checks need"} a
                  provider
                </span>
              ) : dirty ? (
                <span className="font-medium text-foreground">
                  {" "}
                  · Unsaved changes
                </span>
              ) : null}
            </p>
            <ConfigProvenance by={lastChanged.by} at={lastChanged.at} />
          </div>
          <Button onClick={handleSave} disabled={!dirty || saving}>
            {saving ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>

      <SectionCard
        title="Providers"
        description="The vendor running each verification check. Set one here to apply it across every tier that uses the check — saved together with the tiers above."
        contentClassName="p-0"
      >
        <ProvidersSummary
          tiers={tiers}
          onSetProvider={setProviderForRequirement}
        />
      </SectionCard>
    </div>
  )
}

function KycPolicySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col lg:flex-row">
          <div className="flex w-full flex-col gap-1.5 border-border p-3.5 max-lg:border-b lg:w-72 lg:border-r">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-13 w-full rounded-xl" />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
