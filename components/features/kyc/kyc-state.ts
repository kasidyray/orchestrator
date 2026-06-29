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
    reqs: buildReqs(tier.enabled),
  }))
}

/** True when an enabled check on this tier still has no provider chosen. */
export function tierHasPendingProvider(tier: KycTierState): boolean {
  return KYC_REQUIREMENT_CATALOG.some((req) => {
    const state = tier.reqs[req.id]
    return Boolean(state?.on) && !state?.provider
  })
}
