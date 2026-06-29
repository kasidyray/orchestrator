"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { formatThousands, parseAmount } from "@/lib/utils"
import type { KycTierState } from "./kyc-types"
import { RequirementCard } from "./requirement-card"

interface TierSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: KycTierState
  /** True when editing an existing tier rather than creating a new one. */
  editing: boolean
  onNameChange: (value: string) => void
  onDailyChange: (value: number) => void
  onBalanceChange: (value: number) => void
  onToggleReq: (reqId: string, on: boolean) => void
  onProviderChange: (reqId: string, providerId: string) => void
  onSubmit: () => void
}

const TOTAL_REQUIREMENTS = KYC_REQUIREMENT_CATALOG.length

export function TierSheet({
  open,
  onOpenChange,
  draft,
  editing,
  onNameChange,
  onDailyChange,
  onBalanceChange,
  onToggleReq,
  onProviderChange,
  onSubmit,
}: TierSheetProps) {
  const enabled = KYC_REQUIREMENT_CATALOG.filter(
    (req) => draft.reqs[req.id]?.on
  ).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{editing ? "Edit tier" : "Set up a tier"}</SheetTitle>
          <SheetDescription>
            Name it, pick the checks it requires, and assign a provider to each.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Tier name
            </span>
            <Input
              value={draft.name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. Verified"
              aria-label="Tier name"
              autoFocus
            />
          </label>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LimitField
              label="Daily limit"
              value={draft.daily}
              onChange={onDailyChange}
            />
            <LimitField
              label="Max balance"
              value={draft.balance}
              onChange={onBalanceChange}
            />
          </div>

          <div className="mt-5 mb-2.5 flex items-center justify-between px-0.5">
            <span className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
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
                state={draft.reqs[req.id] ?? { on: false, provider: null }}
                onToggle={(on) => onToggleReq(req.id, on)}
                onProviderChange={(providerId) =>
                  onProviderChange(req.id, providerId)
                }
              />
            ))}
          </div>
        </div>

        <SheetFooter className="flex-row justify-end border-t border-border">
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button onClick={onSubmit}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            {editing ? "Update tier" : "Add tier"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
          onChange={(event) => onChange(parseAmount(event.target.value))}
          inputMode="numeric"
          placeholder="0"
          className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </span>
    </label>
  )
}
