"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, Edit03Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

import { cn, formatNairaShort } from "@/lib/utils"
import { TierCheckChips } from "./tier-check-chips"
import { inheritedChecks, introducedReqIds } from "./kyc-state"
import type { KycTierState } from "./kyc-types"

interface TierListProps {
  tiers: KycTierState[]
  editingId: string | null
  onAdd: () => void
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

export function TierList({
  tiers,
  editingId,
  onAdd,
  onEdit,
  onRemove,
}: TierListProps) {
  return (
    <div className="flex flex-col gap-3">
      {tiers.map((tier, index) => (
        <TierCard
          key={tier.id}
          ladder={tiers}
          index={index}
          active={tier.id === editingId}
          onEdit={() => onEdit(tier.id)}
          onRemove={() => onRemove(tier.id)}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-input py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        Add another tier
      </button>
    </div>
  )
}

interface TierCardProps {
  ladder: KycTierState[]
  index: number
  active: boolean
  onEdit: () => void
  onRemove: () => void
}

function TierCard({ ladder, index, active, onEdit, onRemove }: TierCardProps) {
  const tier = ladder[index]
  const inherited = inheritedChecks(ladder, index).size
  const introduced = introducedReqIds(ladder, index).length
  const effective = inherited + introduced

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault()
          onEdit()
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col rounded-xl border bg-card p-4 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50",
        active ? "border-primary/40" : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted font-mono text-[13px] font-bold text-foreground">
          T{index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {tier.name || "Untitled tier"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit()
                }}
                aria-label={`Edit ${tier.name || "tier"}`}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={Edit03Icon} className="size-4" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRemove()
                }}
                aria-label={`Delete ${tier.name || "tier"}`}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </button>
            </div>
          </div>
          <span className="mt-0.5 block font-mono text-xs tracking-wide text-muted-foreground">
            {formatNairaShort(tier.daily)} daily ·{" "}
            {formatNairaShort(tier.balance)} max · {effective}{" "}
            {effective === 1 ? "check" : "checks"}
            {inherited > 0 ? ` (${introduced} new)` : ""}
          </span>
        </div>
      </div>

      {effective > 0 ? (
        <div className="mt-3 border-t border-border pt-3">
          <TierCheckChips ladder={ladder} index={index} />
        </div>
      ) : null}
    </div>
  )
}
