import { KYC_PROVIDER_CATALOG, KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { providerBadgeClass, requirementShortLabel } from "./kyc-meta"
import type { KycTierState } from "./kyc-types"

/** Wrapped row of provider-monogram chips for the checks a tier requires. */
export function TierCheckChips({
  tier,
  className,
}: {
  tier: KycTierState
  className?: string
}) {
  const enabledReqs = KYC_REQUIREMENT_CATALOG.filter(
    (req) => tier.reqs[req.id]?.on
  )

  if (enabledReqs.length === 0) {
    return <span className="text-xs text-muted-foreground">No checks</span>
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {enabledReqs.map((req) => {
        const providerId = tier.reqs[req.id]?.provider
        const initial = providerId
          ? (KYC_PROVIDER_CATALOG[providerId]?.initial ?? "?")
          : "?"
        return (
          <span
            key={req.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1 pr-2.5 pl-1 text-xs font-medium text-foreground"
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full font-mono text-[10px] font-bold",
                providerBadgeClass(providerId)
              )}
            >
              {initial}
            </span>
            {requirementShortLabel(req.id)}
          </span>
        )
      })}
    </div>
  )
}
