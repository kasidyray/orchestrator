"use client"

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
import { introducedReqIds } from "./kyc-state"
import { requirementShortLabel } from "./kyc-meta"
import type { KycTierState } from "./kyc-types"

interface TierDeleteDialogProps {
  /** The tier queued for deletion, or null when the dialog is closed. */
  target: KycTierState | null
  /** The full ladder, used to spell out what deleting the tier costs. */
  tiers: KycTierState[]
  onCancel: () => void
  onConfirm: () => void
}

/** Consequence line for deleting a tier from the ladder. */
function consequence(target: KycTierState, tiers: KycTierState[]): string {
  const index = tiers.findIndex((tier) => tier.id === target.id)
  if (index === -1) return ""
  const introduced = introducedReqIds(tiers, index)
  const above = tiers.length - index - 1
  const name = target.name || "This tier"

  const parts: string[] = []
  if (introduced.length > 0) {
    const labels = introduced.map(requirementShortLabel).join(", ")
    parts.push(
      `${name} introduces ${labels} — deleting it drops ${
        introduced.length === 1 ? "that check" : "those checks"
      } from the ladder${above > 0 ? " and every tier above" : ""}.`
    )
  } else {
    parts.push(`No checks are lost — ${name} only sets its own limits.`)
  }
  if (above > 0) {
    parts.push(
      `The ${above === 1 ? "tier" : `${above} tiers`} above move${
        above === 1 ? "s" : ""
      } down one rank.`
    )
  }
  return parts.join(" ")
}

export function TierDeleteDialog({
  target,
  tiers,
  onCancel,
  onConfirm,
}: TierDeleteDialogProps) {
  return (
    <Dialog
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this tier?</DialogTitle>
          <DialogDescription>
            {target
              ? `${consequence(target, tiers)} This can't be undone.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive" onClick={onConfirm}>
            Delete {target?.name || "tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
