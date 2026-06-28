import { useAppStore } from "@/store"
import {
  mockApiKeys,
  mockAuditLogs,
  mockCustomers,
  mockTeamMembers,
  mockTransactions,
  mockWallets,
  mockWebhookLogs,
} from "@/lib/mock-data"
import type {
  APIKey,
  AuditLog,
  Customer,
  TeamMember,
  Transaction,
  Wallet,
  WebhookLog,
} from "@/lib/types"

/* -------------------------------------------------------------------------- */
/*  MOCK DATA SOURCE.                                                           */
/*                                                                              */
/*  ⚠️  TEMPORARY. This is the single switch that makes the app look "full"     */
/*  (an established business) or "empty" (a brand-new sign-up). When the real   */
/*  API lands, delete this file and fetch each resource for the signed-in       */
/*  business instead — a new business will simply return empty lists.           */
/* -------------------------------------------------------------------------- */

export interface Dataset {
  customers: Customer[]
  transactions: Transaction[]
  wallets: Wallet[]
  apiKeys: APIKey[]
  webhookLogs: WebhookLog[]
  auditLogs: AuditLog[]
  teamMembers: TeamMember[]
  hasSampleData: boolean
}

/** A fresh business hasn't generated activity, but signing up is itself logged. */
function seedAuditLogs(user: TeamMember): AuditLog[] {
  const actor = {
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
  return [
    {
      id: "aud_seed_verify",
      actor,
      action: "auth.email_verified",
      target: user.email,
      description: "Verified email address",
      ipAddress: "102.89.34.12",
      createdAt: user.joinedAt,
    },
    {
      id: "aud_seed_create",
      actor,
      action: "account.created",
      target: user.email,
      description: "Created Optimus account",
      ipAddress: "102.89.34.12",
      createdAt: user.joinedAt,
    },
  ]
}

/**
 * Returns the data the signed-in business should see. Established businesses get
 * the full sample dataset; new businesses get empty resources (plus their owner
 * and the sign-up audit trail).
 */
export function useDataset(): Dataset {
  const hasSampleData = useAppStore((state) => state.hasSampleData)
  const currentUser = useAppStore((state) => state.currentUser)

  if (hasSampleData) {
    return {
      customers: mockCustomers,
      transactions: mockTransactions,
      wallets: mockWallets,
      apiKeys: mockApiKeys,
      webhookLogs: mockWebhookLogs,
      auditLogs: mockAuditLogs,
      teamMembers: mockTeamMembers,
      hasSampleData: true,
    }
  }

  return {
    customers: [],
    transactions: [],
    wallets: [],
    apiKeys: [],
    webhookLogs: [],
    auditLogs: currentUser ? seedAuditLogs(currentUser) : [],
    teamMembers: currentUser ? [currentUser] : [],
    hasSampleData: false,
  }
}
