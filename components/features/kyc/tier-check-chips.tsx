import { KYC_PROVIDER_CATALOG, KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { providerBadgeClass, requirementShortLabel } from "./kyc-meta"
import { inheritedChecks } from "./kyc-state"
import type { KycTierState } from "./kyc-types"

/**
 * Wrapped row of provider-monogram chips for every check the tier at `index`
 * requires — the ones inherited from lower tiers render muted, the ones this
 * tier introduces render at full contrast.
 */
export function TierCheckChips({
  ladder,
  index,
  className,
}: {
  ladder: KycTierState[]
  index: number
  className?: string
}) {
  const tier = ladder[index]
  const inherited = inheritedChecks(ladder, index)
  const effective = KYC_REQUIREMENT_CATALOG.filter(
    (req) => inherited.has(req.id) || tier.reqs[req.id]?.on
  )

  if (effective.length === 0) {
    return <span className="text-xs text-muted-foreground">No checks</span>
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {effective.map((req) => {
        const from = inherited.get(req.id)
        const providerId = from ? from.provider : tier.reqs[req.id]?.provider
        const initial = providerId
          ? (KYC_PROVIDER_CATALOG[providerId]?.initial ?? "?")
          : "?"
        return (
          <span
            key={req.id}
            title={from ? `Inherited from ${from.tierName}` : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1 text-xs font-medium",
              from
                ? "bg-muted/50 text-muted-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full font-mono text-[10px] font-bold",
                providerBadgeClass(providerId),
                from && "opacity-70"
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
