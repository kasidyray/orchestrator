"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Shield01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Spinner } from "@/components/shared/spinner"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { buildReqs } from "@/components/features/kyc/kyc-state"
import { TierList } from "@/components/features/kyc/tier-list"
import { TierSheet } from "@/components/features/kyc/tier-sheet"
import type { KycTierState } from "@/components/features/kyc/kyc-types"
import { useAppStore } from "@/store"

function blankDraft(): KycTierState {
  return { id: "", name: "", daily: 0, balance: 0, reqs: buildReqs({}) }
}

function enabledCount(tier: KycTierState): number {
  return KYC_REQUIREMENT_CATALOG.filter((req) => tier.reqs[req.id]?.on).length
}

export function KycConfig() {
  const router = useRouter()
  const setSetupStep = useAppStore((state) => state.setSetupStep)

  const [tiers, setTiers] = React.useState<KycTierState[]>([])
  const [draft, setDraft] = React.useState<KycTierState>(blankDraft)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const seqRef = React.useRef(0)

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
      toast.success("Tier updated")
    } else {
      seqRef.current += 1
      setTiers((prev) => [
        ...prev,
        { ...draft, id: `tier-${seqRef.current}`, name },
      ])
      toast.success("Tier added")
    }
    setSheetOpen(false)
    resetDraft()
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((tier) => tier.id !== id))
    if (editingId === id) resetDraft()
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSetupStep("kyc", true)
    toast.success("KYC configuration saved")
    router.push("/dashboard")
  }

  const totalChecks = tiers.reduce((sum, tier) => sum + enabledCount(tier), 0)
  const hasTiers = tiers.length > 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8">
        {hasTiers ? (
          <TierList
            tiers={tiers}
            editingId={editingId}
            onAdd={openCreate}
            onEdit={openEdit}
            onRemove={removeTier}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border">
            <EmptyState
              icon={Shield01Icon}
              title="Set up your KYC tiers"
              description="Add a verification tier for each level of access you offer — its checks, providers, and limits. You can add as many as you need."
              action={
                <Button onClick={openCreate}>
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  Add tier
                </Button>
              }
            />
          </div>
        )}
      </div>

      {hasTiers ? (
        <div className="mt-auto border-t border-border py-4">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4">
            <p className="text-[13px] text-muted-foreground">
              {tiers.length} {tiers.length === 1 ? "tier" : "tiers"} ·{" "}
              {totalChecks} checks configured
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
      ) : null}

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
