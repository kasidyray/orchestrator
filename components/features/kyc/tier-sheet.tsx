"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { formatNairaShort, formatThousands, parseAmount } from "@/lib/utils"
import { inheritedChecks } from "./kyc-state"
import type { KycTierState } from "./kyc-types"
import { InheritedRequirementCard, RequirementCard } from "./requirement-card"

interface TierSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: KycTierState
  /** True when editing an existing tier rather than creating a new one. */
  editing: boolean
  /** The tier ladder in rank order, without the draft itself. */
  ladder: KycTierState[]
  /** Rank position (0-based) the draft will occupy in the ladder. */
  insertIndex: number
  onInsertIndexChange: (index: number) => void
  onNameChange: (value: string) => void
  onDailyChange: (value: number) => void
  onBalanceChange: (value: number) => void
  onToggleReq: (reqId: string, on: boolean) => void
  onProviderChange: (reqId: string, providerId: string) => void
  onSubmit: () => void
}

export function TierSheet({
  open,
  onOpenChange,
  draft,
  editing,
  ladder,
  insertIndex,
  onInsertIndexChange,
  onNameChange,
  onDailyChange,
  onBalanceChange,
  onToggleReq,
  onProviderChange,
  onSubmit,
}: TierSheetProps) {
  const inherited = inheritedChecks(ladder, insertIndex)
  const inheritedReqs = KYC_REQUIREMENT_CATALOG.filter((req) =>
    inherited.has(req.id)
  )
  const ownReqs = KYC_REQUIREMENT_CATALOG.filter(
    (req) => !inherited.has(req.id)
  )
  const introducedCount = ownReqs.filter(
    (req) => draft.reqs[req.id]?.on
  ).length

  const buildsOnOptions = [
    { value: "0", label: "Nothing — this is the entry tier" },
    ...ladder.map((tier, index) => ({
      value: String(index + 1),
      label: `${tier.name || "Untitled tier"} (T${index + 1})`,
    })),
  ]

  const prev = insertIndex > 0 ? ladder[insertIndex - 1] : null
  const next = insertIndex < ladder.length ? ladder[insertIndex] : null
  const hasTiersAbove = insertIndex < ladder.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{editing ? "Edit tier" : "Set up a tier"}</SheetTitle>
          <SheetDescription>
            Name it and pick the checks it adds on top of the tiers below it.
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

          <div className="mt-4 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Builds on
            </span>
            <Select
              items={buildsOnOptions}
              value={String(insertIndex)}
              onValueChange={(value) =>
                onInsertIndexChange(Number(value ?? 0))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {buildsOnOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Becomes T{insertIndex + 1}
              {inherited.size > 0
                ? ` · inherits ${inherited.size} ${
                    inherited.size === 1 ? "check" : "checks"
                  } from below`
                : ""}
              {!editing && next
                ? ` · ${next.name || "Untitled tier"} moves up to T${
                    insertIndex + 2
                  }`
                : ""}
            </p>
          </div>

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
          {prev || next ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {prev
                ? `Above ${prev.name || "the tier below"} (${formatNairaShort(
                    prev.daily
                  )} daily · ${formatNairaShort(prev.balance)} max)`
                : ""}
              {prev && next ? " and " : ""}
              {next
                ? `${prev ? "below" : "Below"} ${
                    next.name || "the tier above"
                  } (${formatNairaShort(next.daily)} daily · ${formatNairaShort(
                    next.balance
                  )} max)`
                : ""}
            </p>
          ) : null}

          {inheritedReqs.length > 0 ? (
            <>
              <div className="mt-5 mb-2.5 flex items-center justify-between px-0.5">
                <span className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                  Inherited requirements
                </span>
                <span className="text-xs text-muted-foreground">
                  {inheritedReqs.length} from lower tiers
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {inheritedReqs.map((req) => {
                  const from = inherited.get(req.id)
                  return (
                    <InheritedRequirementCard
                      key={req.id}
                      requirement={req}
                      fromTierName={from?.tierName ?? ""}
                      provider={from?.provider ?? null}
                    />
                  )
                })}
              </div>
            </>
          ) : null}

          <div className="mt-5 mb-2.5 flex items-center justify-between px-0.5">
            <span className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              {inheritedReqs.length > 0
                ? "Additional checks for this tier"
                : "Verification requirements"}
            </span>
            <span className="text-xs text-muted-foreground">
              {inherited.size > 0
                ? `${inherited.size} inherited + ${introducedCount} new`
                : `${introducedCount} of ${ownReqs.length} enabled`}
            </span>
          </div>

          {hasTiersAbove ? (
            <p className="mb-2.5 px-0.5 text-xs text-muted-foreground">
              Checks added here flow into every tier above this one.
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            {ownReqs.map((req) => (
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
