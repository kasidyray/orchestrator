"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { cn, formatNairaShort } from "@/lib/utils"
import type { KycTierState } from "./kyc-types"

interface TierRailProps {
  tiers: KycTierState[]
  selectedId: string
  onSelect: (id: string) => void
  onAddTier: () => void
}

function enabledCount(tier: KycTierState): number {
  return KYC_REQUIREMENT_CATALOG.filter((req) => tier.reqs[req.id]?.on).length
}

/** A tier is pending if any enabled check still has no provider chosen. */
function isPending(tier: KycTierState): boolean {
  return KYC_REQUIREMENT_CATALOG.some((req) => {
    const state = tier.reqs[req.id]
    return state?.on && !state.provider
  })
}

export function TierRail({
  tiers,
  selectedId,
  onSelect,
  onAddTier,
}: TierRailProps) {
  return (
    <div className="flex w-full flex-col border-border p-3.5 max-lg:border-b lg:w-72 lg:border-r">
      <div className="flex items-center justify-between px-2 pb-2.5 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Customer tiers
        </span>
        <span className="font-mono text-[11.5px] font-semibold text-muted-foreground">
          {tiers.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {tiers.map((tier, index) => {
          const selected = tier.id === selectedId
          const count = enabledCount(tier)
          const pending = isPending(tier)
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              aria-current={selected}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2.5 text-left transition-colors duration-100",
                selected
                  ? "border-primary/30 bg-primary/10"
                  : "border-border bg-card hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "flex size-8.5 shrink-0 items-center justify-center rounded-[9px] font-mono text-[13px] font-bold transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                T{index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {tier.name}
                </span>
                <span className="mt-px block truncate text-xs text-muted-foreground">
                  {count} {count === 1 ? "check" : "checks"} ·{" "}
                  {formatNairaShort(tier.daily)} daily
                </span>
              </span>
              {pending ? (
                <span
                  title="Needs a provider"
                  aria-hidden
                  className="size-1.75 shrink-0 rounded-full bg-warning"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onAddTier}
        className="mt-2.5 flex h-10.5 w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-input text-[13.5px] font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        Add tier
      </button>
    </div>
  )
}
