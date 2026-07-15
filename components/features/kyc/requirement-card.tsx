"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { SquareLock01Icon } from "@hugeicons/core-free-icons"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { KYC_PROVIDER_CATALOG, type KycRequirement } from "@/lib/constants"
import type { RequirementState } from "./kyc-types"
import { requirementIcon } from "./kyc-meta"
import { ProviderSelect } from "./provider-select"

interface InheritedRequirementCardProps {
  requirement: KycRequirement
  /** Name of the lower tier that introduces this check. */
  fromTierName: string
  /** Provider chosen where the check was introduced. */
  provider: string | null
}

/**
 * A check carried over from a lower tier — always required here, so it renders
 * locked. Edit the introducing tier to change it.
 */
export function InheritedRequirementCard({
  requirement,
  fromTierName,
  provider,
}: InheritedRequirementCardProps) {
  const icon = requirementIcon(requirement.id)
  const providerName = provider
    ? (KYC_PROVIDER_CATALOG[provider]?.name ?? provider)
    : "No provider yet"

  return (
    <div className="rounded-xl border border-border bg-muted/20 px-4 py-3.5">
      <div className="flex items-center gap-3.5">
        <span className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
          <HugeiconsIcon icon={icon} className="size-4.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {requirement.label}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Required by {fromTierName} · {providerName} — edit that tier to
            change it.
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <HugeiconsIcon icon={SquareLock01Icon} className="size-4" />
        </span>
      </div>
    </div>
  )
}

interface RequirementCardProps {
  requirement: KycRequirement
  state: RequirementState
  onToggle: (on: boolean) => void
  onProviderChange: (providerId: string) => void
}

export function RequirementCard({
  requirement,
  state,
  onToggle,
  onProviderChange,
}: RequirementCardProps) {
  const { on } = state
  const icon = requirementIcon(requirement.id)

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3.5 transition-colors duration-100",
        on ? "border-input bg-muted/30" : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "flex size-9.5 shrink-0 items-center justify-center rounded-[10px] transition-colors",
            on ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <HugeiconsIcon icon={icon} className="size-4.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {requirement.label}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {requirement.description}
          </span>
        </span>
        <Switch
          checked={on}
          onCheckedChange={onToggle}
          aria-label={`Require ${requirement.label}`}
        />
      </div>

      {/* grid-rows trick: animates height + opacity, 200ms, like an accordion */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-out motion-reduce:transition-none",
          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-border pt-3.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Verification provider
            </span>
            <ProviderSelect
              options={requirement.providers}
              value={state.provider}
              onChange={onProviderChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
