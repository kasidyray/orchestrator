/** Per-requirement state within a tier: whether it's required and which provider runs it. */
export interface RequirementState {
  on: boolean
  /** Null until a provider is chosen; an enabled check with no provider is "pending". */
  provider: string | null
}

/** A user-defined verification tier. */
export interface KycTierState {
  id: string
  name: string
  /** Daily transaction limit, in naira. */
  daily: number
  /** Maximum wallet balance, in naira. */
  balance: number
  /** Requirement state keyed by catalog requirement id. */
  reqs: Record<string, RequirementState>
}
