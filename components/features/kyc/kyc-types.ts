/** Per-requirement state within a tier: whether it's required and which provider runs it. */
export interface RequirementState {
  on: boolean
  /** Null until a provider is chosen; an enabled check with no provider is "pending". */
  provider: string | null
}

/**
 * A user-defined verification tier. Rank is the tier's position in the ladder
 * array — T1 is index 0.
 */
export interface KycTierState {
  id: string
  name: string
  /** Daily transaction limit, in naira. */
  daily: number
  /** Maximum wallet balance, in naira. */
  balance: number
  /**
   * Requirement state keyed by catalog requirement id — only the checks this
   * tier introduces. Checks from lower tiers are inherited, derived at render
   * time via the helpers in kyc-state.ts, so a higher tier can never require
   * less than a lower one.
   */
  reqs: Record<string, RequirementState>
}
