"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/shared/spinner"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { TierRail } from "@/components/features/kyc/tier-rail"
import { TierDetail } from "@/components/features/kyc/tier-detail"
import { buildReqs, buildInitialTiers } from "@/components/features/kyc/kyc-state"
import type { KycTierState } from "@/components/features/kyc/kyc-types"
import { useAppStore } from "@/store"

export function KycConfig() {
  const [tiers, setTiers] = React.useState<KycTierState[]>(buildInitialTiers)
  const [selectedId, setSelectedId] = React.useState(() => tiers[0]?.id ?? "")
  const [saving, setSaving] = React.useState(false)
  const seqRef = React.useRef(tiers.length)
  const router = useRouter()
  const setSetupStep = useAppStore((state) => state.setSetupStep)

  const selectedIndex = Math.max(
    0,
    tiers.findIndex((tier) => tier.id === selectedId)
  )
  const selectedTier = tiers[selectedIndex] ?? tiers[0]

  function patchTier(id: string, update: (tier: KycTierState) => KycTierState) {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? update(tier) : tier))
    )
  }

  function addTier() {
    seqRef.current += 1
    const id = `tier-new-${seqRef.current}`
    const newTier: KycTierState = {
      id,
      name: `Tier ${tiers.length + 1}`,
      daily: 0,
      balance: 0,
      reqs: buildReqs({}),
    }
    setTiers((prev) => [...prev, newTier])
    setSelectedId(id)
  }

  function removeTier(id: string) {
    setTiers((prev) => {
      const next = prev.filter((tier) => tier.id !== id)
      if (id === selectedId) setSelectedId(next[0]?.id ?? "")
      return next
    })
  }

  function toggleReq(id: string, reqId: string, on: boolean) {
    patchTier(id, (tier) => ({
      ...tier,
      reqs: {
        ...tier.reqs,
        [reqId]: { ...tier.reqs[reqId], on },
      },
    }))
  }

  function setProvider(id: string, reqId: string, providerId: string) {
    patchTier(id, (tier) => ({
      ...tier,
      reqs: {
        ...tier.reqs,
        [reqId]: { on: true, provider: providerId },
      },
    }))
  }

  // Footer tallies across every tier.
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
        `${pending} ${pending === 1 ? "check needs" : "checks need"} a provider before going live`
      )
      return
    }
    setSetupStep("kyc", true)
    toast.success("KYC configuration saved")
    router.push("/dashboard")
  }

  if (!selectedTier) return null

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="flex flex-col lg:min-h-[540px] lg:flex-row">
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
        </div>
      </div>

      <div className="sticky bottom-0 z-10 mt-5 border-t border-border bg-background/95 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4">
          <p className="text-[13px] text-muted-foreground">
            {tiers.length} {tiers.length === 1 ? "tier" : "tiers"} ·{" "}
            {configured} checks configured
            {pending > 0 ? (
              <span className="font-semibold text-warning">
                {" "}
                · {pending} {pending === 1 ? "check needs" : "checks need"} a
                provider
              </span>
            ) : null}
          </p>
          <Button onClick={handleSave} disabled={saving}>
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
    </div>
  )
}
