import {
  ArrowDataTransferHorizontalIcon,
  Building06Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  FileSecurityIcon,
  Key01Icon,
  LayoutGridIcon,
  SecurityCheckIcon,
  SourceCodeIcon,
  UserMultipleIcon,
  Wallet01Icon,
  WalletAdd01Icon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"

import type { IconSvgElement } from "@hugeicons/react"
import type {
  APIKeyStatus,
  CustomerStatus,
  EnvironmentMode,
  KYBStatus,
  KYCTier,
  KYCTierConfig,
  NavGroup,
  NavItem,
  SetupStepId,
  StatusConfig,
  TeamRole,
  TransactionStatus,
  WalletProduct,
  WalletStatus,
  WebhookStatus,
} from "@/lib/types"

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

/** Primary sidebar items, rendered flat above the Manage group. */
export const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
  { label: "Customers", href: "/customers", icon: UserMultipleIcon },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowDataTransferHorizontalIcon,
  },
  { label: "Wallets", href: "/wallets", icon: Wallet01Icon },
  { label: "Developer", href: "/developer", icon: SourceCodeIcon },
  { label: "API keys", href: "/api-keys", icon: Key01Icon },
  { label: "Audit logs", href: "/audit-logs", icon: FileSecurityIcon },
]

/** Collapsible "Manage" group at the foot of the sidebar nav. */
export const MANAGE_GROUP: NavGroup = {
  label: "Manage",
  icon: LayoutGridIcon,
  children: [
    { label: "Members", href: "/manage/members", icon: UserMultipleIcon },
    { label: "Webhooks", href: "/manage/webhooks", icon: WebhookIcon },
    { label: "Security", href: "/manage/security", icon: SecurityCheckIcon },
    {
      label: "Plans & billing",
      href: "/manage/plans-billing",
      icon: CreditCardIcon,
    },
  ],
}

export const SETUP_NAV_ITEMS: NavItem[] = [
  {
    label: "Organisation",
    href: "/setup/organisation",
    icon: SecurityCheckIcon,
  },
  { label: "KYC", href: "/setup/kyc", icon: SecurityCheckIcon },
  { label: "Wallets", href: "/setup/wallets", icon: WalletAdd01Icon },
  { label: "Webhooks", href: "/setup/webhooks", icon: WebhookIcon },
  { label: "API keys", href: "/setup/api-keys", icon: Key01Icon },
]

/* -------------------------------------------------------------------------- */
/*  KYC providers — configurable per requirement, never a single hardcoded     */
/*  vendor                                                                      */
/* -------------------------------------------------------------------------- */

export interface KycProvider {
  id: string
  name: string
  /** Monogram shown in the provider chip. */
  initial: string
}

/** Verification vendors available across the Nigerian KYC market. */
export const KYC_PROVIDER_CATALOG: Record<string, KycProvider> = {
  termii: { id: "termii", name: "Termii", initial: "T" },
  smileid: { id: "smileid", name: "Smile ID", initial: "S" },
  dojah: { id: "dojah", name: "Dojah", initial: "D" },
  mono: { id: "mono", name: "Mono", initial: "M" },
  prembly: { id: "prembly", name: "Prembly", initial: "P" },
  qoreid: { id: "qoreid", name: "QoreID", initial: "Q" },
  metamap: { id: "metamap", name: "Metamap", initial: "M" },
  verifyme: { id: "verifyme", name: "VerifyMe", initial: "V" },
  youverify: { id: "youverify", name: "Youverify", initial: "Y" },
}

export interface KycRequirement {
  id: string
  label: string
  description: string
  /** Providers that can run this check, in preference order. */
  providers: string[]
}

/** The fixed set of checks a tier can require, each independently toggled. */
export const KYC_REQUIREMENT_CATALOG: KycRequirement[] = [
  {
    id: "phone",
    label: "Phone number",
    description: "Verify the phone number with a one-time code.",
    providers: ["termii", "smileid", "dojah"],
  },
  {
    id: "bvn",
    label: "BVN verification",
    description: "Match the Bank Verification Number.",
    providers: ["dojah", "smileid", "mono", "prembly", "qoreid"],
  },
  {
    id: "nin",
    label: "NIN verification",
    description: "Validate the National Identity Number.",
    providers: ["dojah", "smileid", "prembly", "verifyme"],
  },
  {
    id: "id_doc",
    label: "Government ID document",
    description: "Passport, driver’s licence or voter’s card.",
    providers: ["metamap", "smileid", "dojah", "prembly"],
  },
  {
    id: "liveness",
    label: "Liveness & face match",
    description: "Selfie liveness check against the ID photo.",
    providers: ["smileid", "metamap", "dojah"],
  },
  {
    id: "address",
    label: "Proof of address",
    description: "Utility bill or recent bank statement.",
    providers: ["youverify", "prembly", "dojah"],
  },
]

export interface KycTierDefault {
  name: string
  /** Daily transaction limit, in naira. */
  daily: number
  /** Maximum wallet balance, in naira. */
  balance: number
  /** Requirement id → provider id for the checks enabled out of the box. */
  enabled: Record<string, string>
}

/** Seed tiers operators start from — they can edit, add, or remove these. */
export const KYC_SETUP_TIER_DEFAULTS: KycTierDefault[] = [
  {
    name: "Starter",
    daily: 50_000,
    balance: 300_000,
    enabled: { phone: "termii", bvn: "dojah" },
  },
  {
    name: "Verified",
    daily: 1_000_000,
    balance: 5_000_000,
    enabled: {
      phone: "termii",
      bvn: "dojah",
      nin: "smileid",
      id_doc: "metamap",
      liveness: "smileid",
    },
  },
  {
    name: "Premium",
    daily: 10_000_000,
    balance: 50_000_000,
    enabled: {
      phone: "termii",
      bvn: "dojah",
      nin: "smileid",
      id_doc: "metamap",
      liveness: "smileid",
      address: "youverify",
    },
  },
]

/* -------------------------------------------------------------------------- */
/*  Wallet product catalog — exactly 8                                         */
/* -------------------------------------------------------------------------- */

export const WALLET_PRODUCT_CATALOG: WalletProduct[] = [
  {
    id: "wp_ngn_savings",
    name: "NGN Savings",
    currency: "NGN",
    type: "savings",
    description: "Interest-bearing naira savings wallet for everyday customers.",
    isActive: true,
    isDefault: true,
  },
  {
    id: "wp_ngn_current",
    name: "NGN Current",
    currency: "NGN",
    type: "current",
    description: "Zero-interest current account for high-frequency transactions.",
    isActive: true,
    isDefault: false,
  },
  {
    id: "wp_virtual_nuban",
    name: "Virtual NUBAN",
    currency: "NGN",
    type: "virtual",
    description: "Dedicated virtual account numbers for inbound collections.",
    isActive: false,
    isDefault: false,
  },
  {
    id: "wp_collection",
    name: "Collection Wallet",
    currency: "NGN",
    type: "collection",
    description: "Pooled wallet for aggregating merchant settlements.",
    isActive: false,
    isDefault: false,
  },
  {
    id: "wp_usd_wallet",
    name: "USD Wallet",
    currency: "USD",
    type: "current",
    description: "Hold and transact in US dollars for cross-border needs.",
    isActive: false,
    isDefault: false,
  },
  {
    id: "wp_escrow",
    name: "Escrow Wallet",
    currency: "NGN",
    type: "escrow",
    description: "Hold funds in trust until transaction conditions are met.",
    isActive: false,
    isDefault: false,
  },
  {
    id: "wp_sub_wallet",
    name: "Sub-Wallet",
    currency: "NGN",
    type: "savings",
    description: "Child wallets nested under a parent for goal-based saving.",
    isActive: false,
    isDefault: false,
  },
  {
    id: "wp_payout",
    name: "Payout Wallet",
    currency: "NGN",
    type: "payout",
    description: "Dedicated balance for disbursements and bulk payouts.",
    isActive: false,
    isDefault: false,
  },
]

/* -------------------------------------------------------------------------- */
/*  Team roles                                                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Organisation setup                                                          */
/* -------------------------------------------------------------------------- */

export const INDUSTRY_OPTIONS = [
  "Fintech / Digital banking",
  "Cooperative society",
  "Microfinance bank",
  "Payments / PSP",
  "Lending",
  "Investment / Wealth management",
  "E-commerce / Marketplace",
  "Other",
] as const

export const COUNTRY_OPTIONS = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
] as const

export interface RequiredDocument {
  id: string
  label: string
  hint: string
}

export const ORGANISATION_DOCUMENTS: RequiredDocument[] = [
  {
    id: "cac",
    label: "Certificate of incorporation",
    hint: "CAC certificate — PDF, JPG, or PNG",
  },
  {
    id: "memart",
    label: "Memorandum & articles of association",
    hint: "MEMART document — PDF",
  },
  {
    id: "director-id",
    label: "Director's government ID",
    hint: "NIN slip, passport, or driver's licence",
  },
  {
    id: "proof-address",
    label: "Proof of business address",
    hint: "Utility bill issued within the last 3 months",
  },
]

/* -------------------------------------------------------------------------- */
/*  Onboarding checklist                                                        */
/* -------------------------------------------------------------------------- */

export interface SetupStep {
  id: SetupStepId
  label: string
  description: string
  href: string
  /** Verb on the primary action button while the step is incomplete. */
  actionLabel: string
  icon: IconSvgElement
}

export const SETUP_CHECKLIST: SetupStep[] = [
  {
    id: "organisation",
    label: "Set up your organisation",
    description: "Add your business details and upload registration documents.",
    href: "/setup/organisation",
    actionLabel: "Set up",
    icon: Building06Icon,
  },
  {
    id: "kyc",
    label: "Configure KYC tiers",
    description: "Define the verification requirements for each customer tier.",
    href: "/setup/kyc",
    actionLabel: "Configure",
    icon: SecurityCheckIcon,
  },
  {
    id: "wallets",
    label: "Enable wallet products",
    description: "Choose the wallet and savings products to offer your customers.",
    href: "/setup/wallets",
    actionLabel: "Enable",
    icon: Wallet01Icon,
  },
  {
    id: "webhooks",
    label: "Add a webhook",
    description: "Receive real-time notifications for transactions and events.",
    href: "/setup/webhooks",
    actionLabel: "Add",
    icon: WebhookIcon,
  },
  {
    id: "api-keys",
    label: "Generate API keys",
    description: "Create your credentials and start integrating with the API.",
    href: "/setup/api-keys",
    actionLabel: "Generate",
    icon: Key01Icon,
  },
]

/* -------------------------------------------------------------------------- */
/*  Team roles                                                                  */
/* -------------------------------------------------------------------------- */

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  developer: "Developer",
  support: "Support",
}

/* -------------------------------------------------------------------------- */
/*  KYC tiers                                                                   */
/* -------------------------------------------------------------------------- */

export const KYC_TIER_CONFIG: Record<KYCTier, KYCTierConfig> = {
  tier_0: {
    tier: "tier_0",
    label: "Tier 0",
    limit: "₦50,000 balance limit",
    description: "Phone number only — minimal access for new sign-ups.",
    requirements: ["Phone number"],
  },
  tier_1: {
    tier: "tier_1",
    label: "Tier 1",
    limit: "₦300,000 balance limit",
    description: "Basic identity — suitable for everyday wallets.",
    requirements: ["Phone number", "BVN", "Date of birth"],
  },
  tier_2: {
    tier: "tier_2",
    label: "Tier 2",
    limit: "₦5,000,000 balance limit",
    description: "Verified identity with address and document checks.",
    requirements: [
      "Phone number",
      "BVN",
      "Government ID",
      "Proof of address",
      "Selfie / liveness",
    ],
  },
  tier_3: {
    tier: "tier_3",
    label: "Tier 3",
    limit: "Unlimited balance",
    description: "Full KYC for premium and corporate customers.",
    requirements: [
      "Phone number",
      "BVN",
      "Government ID",
      "Proof of address",
      "Selfie / liveness",
      "Source of funds",
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*  Status → visual config maps (drive StatusBadge)                            */
/* -------------------------------------------------------------------------- */

export const TRANSACTION_STATUS_CONFIG: Record<
  TransactionStatus,
  StatusConfig
> = {
  successful: { label: "Successful", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
  reversed: { label: "Reversed", variant: "neutral" },
}

export const KYB_STATUS_CONFIG: Record<KYBStatus, StatusConfig> = {
  pending: { label: "Pending", variant: "warning" },
  in_review: { label: "Under review", variant: "info" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
}

export const CUSTOMER_STATUS_CONFIG: Record<CustomerStatus, StatusConfig> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "neutral" },
  blocked: { label: "Blocked", variant: "destructive" },
}

export const WALLET_STATUS_CONFIG: Record<WalletStatus, StatusConfig> = {
  active: { label: "Active", variant: "success" },
  frozen: { label: "Frozen", variant: "warning" },
  closed: { label: "Closed", variant: "neutral" },
}

export const API_KEY_STATUS_CONFIG: Record<APIKeyStatus, StatusConfig> = {
  active: { label: "Active", variant: "success" },
  revoked: { label: "Revoked", variant: "destructive" },
  expired: { label: "Expired", variant: "neutral" },
}

export const WEBHOOK_STATUS_CONFIG: Record<WebhookStatus, StatusConfig> = {
  delivered: { label: "Delivered", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  pending: { label: "Pending", variant: "warning" },
}

/* -------------------------------------------------------------------------- */
/*  Developer portal                                                            */
/* -------------------------------------------------------------------------- */

export const API_BASE_URL = "https://api.optimus.afrinvest.com/v1"
export const API_SANDBOX_BASE_URL =
  "https://sandbox.api.optimus.afrinvest.com/v1"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface ApiEndpoint {
  method: HttpMethod
  path: string
  description: string
}

export interface ApiResourceGroup {
  resource: string
  endpoints: ApiEndpoint[]
}

export const API_ENDPOINTS: ApiResourceGroup[] = [
  {
    resource: "Customers",
    endpoints: [
      { method: "POST", path: "/customers", description: "Create a customer" },
      { method: "GET", path: "/customers", description: "List customers" },
      {
        method: "GET",
        path: "/customers/{id}",
        description: "Retrieve a customer",
      },
      {
        method: "PATCH",
        path: "/customers/{id}",
        description: "Update a customer",
      },
      {
        method: "POST",
        path: "/customers/{id}/kyc",
        description: "Submit KYC for a customer",
      },
    ],
  },
  {
    resource: "Wallets",
    endpoints: [
      { method: "POST", path: "/wallets", description: "Create a wallet" },
      { method: "GET", path: "/wallets/{id}", description: "Retrieve a wallet" },
      {
        method: "GET",
        path: "/wallets/{id}/balance",
        description: "Get a wallet balance",
      },
      {
        method: "POST",
        path: "/wallets/{id}/freeze",
        description: "Freeze a wallet",
      },
    ],
  },
  {
    resource: "KYC",
    endpoints: [
      {
        method: "GET",
        path: "/kyc/tiers",
        description: "List KYC tier configuration",
      },
      {
        method: "POST",
        path: "/kyc/verifications",
        description: "Run a verification check",
      },
      {
        method: "GET",
        path: "/kyc/verifications/{id}",
        description: "Retrieve a verification result",
      },
    ],
  },
  {
    resource: "Transactions",
    endpoints: [
      {
        method: "POST",
        path: "/transactions/transfer",
        description: "Initiate a transfer",
      },
      {
        method: "GET",
        path: "/transactions",
        description: "List transactions",
      },
      {
        method: "GET",
        path: "/transactions/{id}",
        description: "Retrieve a transaction",
      },
      {
        method: "POST",
        path: "/transactions/{id}/reverse",
        description: "Reverse a transaction",
      },
    ],
  },
  {
    resource: "Investments",
    endpoints: [
      {
        method: "GET",
        path: "/investments/products",
        description: "List investment products",
      },
      {
        method: "POST",
        path: "/investments/subscriptions",
        description: "Subscribe a customer to a product",
      },
      {
        method: "GET",
        path: "/investments/subscriptions/{id}",
        description: "Retrieve a subscription",
      },
    ],
  },
]

export const WEBHOOK_EVENTS = [
  { event: "customer.created", description: "A new customer was created" },
  {
    event: "customer.kyc_approved",
    description: "A customer passed KYC verification",
  },
  { event: "wallet.created", description: "A wallet was provisioned" },
  {
    event: "transaction.successful",
    description: "A transaction completed successfully",
  },
  { event: "transaction.failed", description: "A transaction failed" },
  { event: "transaction.reversed", description: "A transaction was reversed" },
  {
    event: "investment.matured",
    description: "An investment reached maturity",
  },
]

export interface SdkDownload {
  name: string
  description: string
  version: string
}

export const SDK_DOWNLOADS: SdkDownload[] = [
  {
    name: "Postman collection",
    description: "Every endpoint, ready to call.",
    version: "v1.4.0",
  },
  {
    name: "OpenAPI specification",
    description: "Machine-readable API schema (YAML).",
    version: "v1.4.0",
  },
  {
    name: "Node.js SDK",
    description: "Official TypeScript client library.",
    version: "v2.1.3",
  },
  {
    name: "Python SDK",
    description: "Official Python client library.",
    version: "v1.8.0",
  },
]

/* -------------------------------------------------------------------------- */
/*  Environment badge config                                                   */
/* -------------------------------------------------------------------------- */

export interface EnvironmentConfig {
  label: string
  description: string
  /** Tailwind classes built from the env-* tokens in globals.css. */
  badgeClass: string
}

export const ENV_CONFIG: Record<EnvironmentMode, EnvironmentConfig> = {
  sandbox: {
    label: "Sandbox",
    description: "Test environment — no real money moves.",
    badgeClass: "bg-env-sandbox/10 text-env-sandbox",
  },
  live: {
    label: "Live",
    description: "Production environment — real transactions.",
    badgeClass: "bg-env-live/10 text-env-live",
  },
  live_locked: {
    label: "Live (locked)",
    description: "Complete onboarding to unlock the live environment.",
    badgeClass: "bg-env-live-locked/15 text-env-live-locked",
  },
}
