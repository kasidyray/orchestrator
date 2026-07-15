"use client"

import * as React from "react"
import { toast } from "sonner"

import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { formatNairaShort } from "@/lib/utils"
import { buildReqs, inheritedChecks } from "./kyc-state"
import type { KycTierState } from "./kyc-types"

function blankDraft(): KycTierState {
  return {
    id: "",
    name: "",
    daily: 0,
    balance: 0,
    reqs: buildReqs({}),
  }
}

export interface TierChange {
  type: "added" | "updated" | "removed"
  tier: KycTierState
}

/**
 * Shared controller for the tier ladder — draft editing, rank insertion,
 * ladder-aware validation, and removal. Used by both the setup flow and the
 * configuration area; surface-specific behaviour (audit logging, provenance)
 * hangs off `onChange`.
 */
export function useTierEditor(
  initialTiers: () => KycTierState[],
  onChange?: (change: TierChange) => void
) {
  const [tiers, setTiers] = React.useState<KycTierState[]>(initialTiers)
  const [draft, setDraft] = React.useState<KycTierState>(blankDraft)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [insertIndex, setInsertIndex] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<KycTierState | null>(
    null
  )
  const seqRef = React.useRef<number | null>(null)
  if (seqRef.current === null) seqRef.current = tiers.length

  /** The ladder the draft slots into — every tier except the one being edited. */
  const ladder = editingId
    ? tiers.filter((tier) => tier.id !== editingId)
    : tiers

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
    setInsertIndex(tiers.length)
    setSheetOpen(true)
  }

  function openEdit(id: string) {
    const index = tiers.findIndex((item) => item.id === id)
    if (index === -1) return
    const tier = tiers[index]
    setDraft({ ...tier, reqs: { ...tier.reqs } })
    setEditingId(id)
    setInsertIndex(index)
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

    const inherited = inheritedChecks(ladder, insertIndex)
    const introduced = KYC_REQUIREMENT_CATALOG.filter(
      (req) => !inherited.has(req.id) && draft.reqs[req.id]?.on
    )
    if (insertIndex === 0 && introduced.length === 0) {
      toast.error("The entry tier needs at least one verification check")
      return
    }
    const missing = introduced.find((req) => !draft.reqs[req.id]?.provider)
    if (missing) {
      toast.error(`Choose a provider for ${missing.label}`)
      return
    }

    if (draft.daily <= 0 || draft.balance <= 0) {
      toast.error("Set a daily limit and max balance above zero")
      return
    }
    const prev = insertIndex > 0 ? ladder[insertIndex - 1] : null
    const next = insertIndex < ladder.length ? ladder[insertIndex] : null
    if (prev && (draft.daily <= prev.daily || draft.balance <= prev.balance)) {
      toast.error(
        `Limits must be above ${prev.name}'s — ${formatNairaShort(
          prev.daily
        )} daily · ${formatNairaShort(prev.balance)} max`
      )
      return
    }
    if (next && (draft.daily >= next.daily || draft.balance >= next.balance)) {
      toast.error(
        `Limits must be below ${next.name}'s — ${formatNairaShort(
          next.daily
        )} daily · ${formatNairaShort(next.balance)} max`
      )
      return
    }

    let tier: KycTierState
    if (editingId) {
      tier = { ...draft, id: editingId, name }
    } else {
      seqRef.current = (seqRef.current ?? 0) + 1
      tier = { ...draft, id: `tier-${seqRef.current}`, name }
    }
    const nextTiers = [...ladder]
    nextTiers.splice(insertIndex, 0, tier)
    setTiers(nextTiers)
    onChange?.({ type: editingId ? "updated" : "added", tier })
    toast.success(editingId ? "Tier updated" : "Tier added")
    setSheetOpen(false)
    resetDraft()
  }

  function requestRemove(id: string) {
    const tier = tiers.find((item) => item.id === id)
    if (tier) setDeleteTarget(tier)
  }

  function cancelRemove() {
    setDeleteTarget(null)
  }

  function confirmRemove() {
    if (!deleteTarget) return
    setTiers((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    if (editingId === deleteTarget.id) resetDraft()
    onChange?.({ type: "removed", tier: deleteTarget })
    toast.success("Tier removed")
    setDeleteTarget(null)
  }

  return {
    tiers,
    draft,
    editingId,
    insertIndex,
    sheetOpen,
    deleteTarget,
    ladder,
    patchDraft,
    toggleReq,
    setProvider,
    setInsertIndex,
    openCreate,
    openEdit,
    handleSheetOpenChange,
    submitTier,
    requestRemove,
    cancelRemove,
    confirmRemove,
  }
}
