/* -------------------------------------------------------------------------- */
/*  MOCK AUTH — frontend-only demo sign-in.                                     */
/*                                                                              */
/*  ⚠️  TEMPORARY. Delete this whole file when real authentication is wired.    */
/*                                                                              */
/*  It provides two canned accounts so the app can be demoed in both onboarding */
/*  states without a backend:                                                   */
/*    • a fresh business that still has setup to do (0/5 complete)              */
/*    • a fully-configured business that is ready to go live (5/5 complete)     */
/*                                                                              */
/*  To remove later: drop this file, replace `authenticateMock` with your real  */
/*  auth call, and have the API hydrate `setupCompletion` (see store/index.ts). */
/* -------------------------------------------------------------------------- */

import type { Organisation, SetupStepId, TeamMember } from "@/lib/types"

/** Every setup step toggled on / off in one place. */
const ALL_COMPLETE: Record<SetupStepId, boolean> = {
  organisation: true,
  kyc: true,
  wallets: true,
  webhooks: true,
  "api-keys": true,
}

const NONE_COMPLETE: Record<SetupStepId, boolean> = {
  organisation: false,
  kyc: false,
  wallets: false,
  webhooks: false,
  "api-keys": false,
}

export interface MockAccount {
  /** Credentials accepted at the login screen. */
  email: string
  password: string
  /** Shown on the login screen's demo-account helper. */
  label: string
  hint: string
  /** Who the operator is and which business they belong to. */
  user: TeamMember
  org: Organisation
  /** Seeds the shared onboarding state on sign-in. */
  setupCompletion: Record<SetupStepId, boolean>
  /**
   * Whether this business has real activity yet. A brand-new sign-up has none
   * (no customers, wallets, transactions…); an established one has the full
   * sample dataset. Read via useDataset to populate or empty the app.
   */
  hasSampleData: boolean
}

/** A brand-new business — just signed up, nothing configured yet. */
const NEW_BUSINESS: MockAccount = {
  email: "new@kudalite.africa",
  password: "optimus",
  label: "New business",
  hint: "Fresh sign-up — onboarding incomplete (0/5).",
  user: {
    id: "tm_demo_new",
    name: "Adaeze Nwosu",
    email: "new@kudalite.africa",
    role: "owner",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    joinedAt: "2026-06-26T09:00:00.000Z",
    lastActiveAt: "2026-06-27T08:30:00.000Z",
  },
  org: {
    id: "org_demo_new",
    name: "Kuda Lite Technologies Ltd",
    rcNumber: "RC-1840923",
    industry: "Fintech / Digital banking",
    email: "operations@kudalite.africa",
    phone: "+234 809 442 1180",
    address: "14B Admiralty Way, Lekki Phase 1, Lagos",
    country: "Nigeria",
    kybStatus: "pending",
    environment: "sandbox",
    tier: "tier_0",
    createdAt: "2026-06-26T09:00:00.000Z",
  },
  setupCompletion: NONE_COMPLETE,
  hasSampleData: false,
}

/** An established business — fully set up and cleared to go live. */
const LIVE_BUSINESS: MockAccount = {
  email: "live@paystack.africa",
  password: "optimus",
  label: "Live business",
  hint: "Fully configured — ready to go live (5/5).",
  user: {
    id: "tm_demo_live",
    name: "Ikedi Eze",
    email: "live@paystack.africa",
    role: "owner",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    joinedAt: "2025-09-12T09:24:00.000Z",
    lastActiveAt: "2026-06-27T07:10:00.000Z",
  },
  org: {
    id: "org_demo_live",
    name: "Paystack Microfinance Ltd",
    rcNumber: "RC-1192045",
    industry: "Microfinance bank",
    email: "ops@paystackmfb.africa",
    phone: "+234 802 113 9920",
    address: "1 Bankole Street, Victoria Island, Lagos",
    country: "Nigeria",
    kybStatus: "verified",
    environment: "sandbox",
    tier: "tier_2",
    createdAt: "2025-09-12T09:24:00.000Z",
  },
  setupCompletion: ALL_COMPLETE,
  hasSampleData: true,
}

/** The account created by the sign-up / verify-email flow. */
export const MOCK_SIGNUP_ACCOUNT = NEW_BUSINESS

/** Shown on the login screen as one-tap demo logins. */
export const MOCK_ACCOUNTS: MockAccount[] = [NEW_BUSINESS, LIVE_BUSINESS]

/** Returns the matching account for the given credentials, or null. */
export function authenticateMock(
  email: string,
  password: string
): MockAccount | null {
  const normalised = email.trim().toLowerCase()
  return (
    MOCK_ACCOUNTS.find(
      (account) =>
        account.email.toLowerCase() === normalised &&
        account.password === password
    ) ?? null
  )
}
