import type { IconSvgElement } from "@hugeicons/react"

/* -------------------------------------------------------------------------- */
/*  Shared status unions                                                       */
/* -------------------------------------------------------------------------- */

/** Maps any domain status onto a visual treatment used by StatusBadge. */
export type StatusVariant =
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "neutral"

export type EnvironmentMode = "sandbox" | "live" | "live_locked"

export type KYCTier = "tier_0" | "tier_1" | "tier_2" | "tier_3"

export type KYBStatus = "pending" | "in_review" | "verified" | "rejected"

export type CustomerStatus = "active" | "inactive" | "blocked"

export type WalletStatus = "active" | "frozen" | "closed"

export type WalletCurrency = "NGN" | "USD"

export type TransactionStatus = "successful" | "pending" | "failed" | "reversed"

export type TransactionType = "credit" | "debit"

export type TransactionChannel =
  | "transfer"
  | "card"
  | "bank"
  | "wallet"
  | "bill"

export type APIKeyStatus = "active" | "revoked" | "expired"

export type APIKeyEnvironment = "test" | "live"

export type WebhookStatus = "delivered" | "failed" | "pending"

export type TeamRole = "owner" | "admin" | "developer" | "support"

export type TeamMemberStatus = "active" | "invited"

/* -------------------------------------------------------------------------- */
/*  Domain entities                                                            */
/*  All dates are ISO 8601 strings to keep RSC payloads serialisable and       */
/*  avoid SSR/CSR hydration drift — format at render via lib/utils.            */
/* -------------------------------------------------------------------------- */

export interface Organisation {
  id: string
  name: string
  rcNumber: string
  industry: string
  email: string
  phone: string
  address: string
  country: string
  kybStatus: KYBStatus
  environment: EnvironmentMode
  tier: KYCTier
  logoUrl?: string
  createdAt: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: CustomerStatus
  kycTier: KYCTier
  bvnVerified: boolean
  walletCount: number
  avatarUrl: string
  createdAt: string
}

export interface WalletProduct {
  id: string
  name: string
  currency: WalletCurrency
  type: "savings" | "current" | "virtual" | "collection" | "escrow" | "payout"
  description: string
  isActive: boolean
  isDefault: boolean
  icon?: IconSvgElement
}

export interface Wallet {
  id: string
  customerId: string
  productId: string
  productName: string
  currency: WalletCurrency
  balance: number
  availableBalance: number
  status: WalletStatus
  createdAt: string
}

export interface TransactionCounterparty {
  name: string
  bank?: string
  accountNumber?: string
}

export interface Transaction {
  id: string
  reference: string
  walletId: string
  customerId: string
  customerName: string
  amount: number
  fee: number
  balanceAfter: number
  currency: WalletCurrency
  type: TransactionType
  channel: TransactionChannel
  status: TransactionStatus
  narration: string
  counterparty?: TransactionCounterparty
  createdAt: string
}

export interface APIKey {
  id: string
  label: string
  maskedKey: string
  environment: APIKeyEnvironment
  status: APIKeyStatus
  createdBy: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
}

export interface WebhookLog {
  id: string
  event: string
  url: string
  status: WebhookStatus
  httpStatus: number
  attempts: number
  payloadSize: number
  responseTimeMs: number
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  status: TeamMemberStatus
  avatarUrl: string
  joinedAt: string
  lastActiveAt: string | null
}

export interface AuditLogActor {
  name: string
  email: string
  avatarUrl: string
}

export interface AuditLog {
  id: string
  actor: AuditLogActor
  action: string
  target: string
  description: string
  ipAddress: string
  createdAt: string
}

export interface KYCTierConfig {
  tier: KYCTier
  label: string
  limit: string
  description: string
  requirements: string[]
}

/* -------------------------------------------------------------------------- */
/*  UI config                                                                  */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string
  href: string
  icon: IconSvgElement
  group?: string
}

/** A collapsible sidebar section with a label, icon, and child nav items. */
export interface NavGroup {
  label: string
  icon: IconSvgElement
  children: NavItem[]
}

/** The five onboarding steps a new operator completes from the dashboard. */
export type SetupStepId =
  | "organisation"
  | "kyc"
  | "wallets"
  | "webhooks"
  | "api-keys"

/** Drives StatusBadge: a label plus the visual variant to apply. */
export interface StatusConfig {
  label: string
  variant: StatusVariant
}
