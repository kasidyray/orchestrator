"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { formatNairaShort, formatThousands, parseAmount } from "@/lib/utils"
import type { KycTierState } from "./kyc-types"
import { RequirementCard } from "./requirement-card"

interface TierDetailProps {
  tier: KycTierState
  index: number
  removable: boolean
  onRename: (name: string) => void
  onDailyChange: (value: number) => void
  onBalanceChange: (value: number) => void
  onToggleReq: (reqId: string, on: boolean) => void
  onProviderChange: (reqId: string, providerId: string) => void
  onRemoveTier: () => void
}

const TOTAL_REQUIREMENTS = KYC_REQUIREMENT_CATALOG.length

export function TierDetail({
  tier,
  index,
  removable,
  onRename,
  onDailyChange,
  onBalanceChange,
  onToggleReq,
  onProviderChange,
  onRemoveTier,
}: TierDetailProps) {
  const enabled = KYC_REQUIREMENT_CATALOG.filter(
    (req) => tier.reqs[req.id]?.on
  ).length

  const subtitle = tier.daily
    ? `Customers verified to this tier can transact up to ${formatNairaShort(tier.daily)} per day.`
    : "Set the limits and the checks customers must complete to reach this tier."

  return (
    <div className="min-w-0 flex-1 p-5 md:p-5.5">
      {/* Header */}
      <div className="mb-4.5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 font-mono text-[13px] font-bold text-primary">
              T{index + 1}
            </span>
            <input
              value={tier.name}
              onChange={(e) => onRename(e.target.value)}
              placeholder="Tier name"
              aria-label="Tier name"
              className="min-w-0 flex-1 rounded-sm border-none bg-transparent py-0.5 text-lg font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <p className="mt-1.5 max-w-md text-[13px] text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {removable ? (
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  Remove
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {tier.name || "this tier"}?</DialogTitle>
                <DialogDescription>
                  This deletes the tier and its verification setup. Customers on
                  this tier would need reassigning. This can’t be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Keep tier
                </DialogClose>
                <DialogClose
                  render={<Button variant="destructive" />}
                  onClick={onRemoveTier}
                >
                  Remove tier
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      {/* Limits */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LimitField
          label="Daily transaction limit"
          value={tier.daily}
          onChange={onDailyChange}
        />
        <LimitField
          label="Maximum wallet balance"
          value={tier.balance}
          onChange={onBalanceChange}
        />
      </div>

      {/* Requirements */}
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Verification requirements
        </span>
        <span className="text-xs text-muted-foreground">
          {enabled} of {TOTAL_REQUIREMENTS} enabled
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {KYC_REQUIREMENT_CATALOG.map((req) => (
          <RequirementCard
            key={req.id}
            requirement={req}
            state={tier.reqs[req.id] ?? { on: false, provider: null }}
            onToggle={(on) => onToggleReq(req.id, on)}
            onProviderChange={(providerId) =>
              onProviderChange(req.id, providerId)
            }
          />
        ))}
      </div>
    </div>
  )
}

interface LimitFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function LimitField({ label, value, onChange }: LimitFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="flex h-10 items-center gap-1.5 rounded-md border border-input bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <span className="font-mono text-sm text-muted-foreground">₦</span>
        <input
          value={formatThousands(value)}
          onChange={(e) => onChange(parseAmount(e.target.value))}
          inputMode="numeric"
          placeholder="0"
          className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </span>
    </label>
  )
}
