import {
  KYC_REQUIREMENT_CATALOG,
  KYC_SETUP_TIER_DEFAULTS,
  type KycTierDefault,
} from "@/lib/constants"
import type { KycTierState, RequirementState } from "./kyc-types"

/** Expand a tier's `{ reqId: providerId }` map into full per-requirement state. */
export function buildReqs(
  enabled: Record<string, string>
): Record<string, RequirementState> {
  const reqs: Record<string, RequirementState> = {}
  for (const req of KYC_REQUIREMENT_CATALOG) {
    reqs[req.id] = {
      on: Boolean(enabled[req.id]),
      provider: enabled[req.id] ?? null,
    }
  }
  return reqs
}

/** Seed the editor from the catalog defaults — shared by setup and configuration. */
export function buildInitialTiers(): KycTierState[] {
  return KYC_SETUP_TIER_DEFAULTS.map((tier: KycTierDefault, index) => ({
    id: `tier-${index + 1}`,
    name: tier.name,
    daily: tier.daily,
    balance: tier.balance,
    reqs: buildReqs(tier.introduces),
  }))
}

/**
 * Where an inherited check comes from: the lowest tier that introduces it,
 * with the provider chosen there.
 */
export interface InheritedCheck {
  reqId: string
  tierName: string
  provider: string | null
}

/**
 * The checks the tier at `index` inherits from the tiers below it, keyed by
 * requirement id. When two lower tiers both introduce a check, the lowest one
 * wins — that's where the customer actually runs it.
 */
export function inheritedChecks(
  ladder: KycTierState[],
  index: number
): Map<string, InheritedCheck> {
  const inherited = new Map<string, InheritedCheck>()
  for (const tier of ladder.slice(0, index)) {
    for (const req of KYC_REQUIREMENT_CATALOG) {
      const state = tier.reqs[req.id]
      if (state?.on && !inherited.has(req.id)) {
        inherited.set(req.id, {
          reqId: req.id,
          tierName: tier.name || "Untitled tier",
          provider: state.provider,
        })
      }
    }
  }
  return inherited
}

/**
 * The checks the tier at `index` introduces itself — its own enabled checks
 * minus anything already required below it.
 */
export function introducedReqIds(
  ladder: KycTierState[],
  index: number
): string[] {
  const inherited = inheritedChecks(ladder, index)
  const tier = ladder[index]
  return KYC_REQUIREMENT_CATALOG.filter(
    (req) => tier.reqs[req.id]?.on && !inherited.has(req.id)
  ).map((req) => req.id)
}

/** True when a check this tier introduces is enabled but has no provider yet. */
export function tierHasPendingProvider(
  tier: KycTierState,
  inherited?: Map<string, InheritedCheck>
): boolean {
  return KYC_REQUIREMENT_CATALOG.some((req) => {
    if (inherited?.has(req.id)) return false
    const state = tier.reqs[req.id]
    return Boolean(state?.on) && !state?.provider
  })
}
