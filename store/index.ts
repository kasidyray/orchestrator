import { create } from "zustand"
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware"

import type {
  AuditLog,
  EnvironmentMode,
  Organisation,
  SetupStepId,
  TeamMember,
} from "@/lib/types"

/** Fields a caller supplies when recording a config change to the audit trail. */
export interface ActivityInput {
  action: string
  target: string
  description: string
}

/** No-op storage so the persisted store is safe to import during SSR. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const EMPTY_SETUP_COMPLETION: Record<SetupStepId, boolean> = {
  organisation: false,
  kyc: false,
  wallets: false,
  webhooks: false,
  "api-keys": false,
}

/* -------------------------------------------------------------------------- */
/*  MOCK SESSION — sign-in payload.                                             */
/*  When real auth lands, replace the `signIn` argument with your authenticated */
/*  user/org, and hydrate `setupCompletion` from the API instead of the mock.   */
/* -------------------------------------------------------------------------- */
interface SignInPayload {
  user: TeamMember
  org: Organisation
  setupCompletion: Record<SetupStepId, boolean>
  hasSampleData: boolean
}

/**
 * App-wide UI state. Holds the (mock) session, the shared onboarding completion
 * map, and the environment toggle. The session + completion are persisted to
 * localStorage so a refresh keeps you signed in.
 */
interface AppState {
  /** Currently signed-in operator, or null when logged out. (MOCK) */
  currentUser: TeamMember | null
  /** The signed-in operator's organisation, or null. (MOCK) */
  currentOrg: Organisation | null
  /** Whether the signed-in business has the sample dataset. (MOCK) */
  hasSampleData: boolean
  signIn: (payload: SignInPayload) => void
  signOut: () => void

  /** Shared onboarding progress — read by the dashboard hero and sidebar. */
  setupCompletion: Record<SetupStepId, boolean>
  setSetupStep: (id: SetupStepId, completed: boolean) => void

  /**
   * Audit entries generated this session (e.g. configuration changes). Merged
   * into the audit-log view by useDataset. Session-only — not persisted.
   */
  activityLog: AuditLog[]
  logActivity: (entry: ActivityInput) => void

  environment: EnvironmentMode
  setEnvironment: (environment: EnvironmentMode) => void

  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  /** True once the persisted store has rehydrated on the client. */
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      currentOrg: null,
      hasSampleData: false,
      signIn: ({ user, org, setupCompletion, hasSampleData }) =>
        set({
          currentUser: user,
          currentOrg: org,
          setupCompletion,
          hasSampleData,
          environment: "sandbox",
        }),
      signOut: () =>
        set({
          currentUser: null,
          currentOrg: null,
          hasSampleData: false,
          setupCompletion: EMPTY_SETUP_COMPLETION,
          environment: "sandbox",
          activityLog: [],
        }),

      setupCompletion: EMPTY_SETUP_COMPLETION,
      setSetupStep: (id, completed) =>
        set((state) => ({
          setupCompletion: { ...state.setupCompletion, [id]: completed },
        })),

      activityLog: [],
      logActivity: ({ action, target, description }) =>
        set((state) => {
          const user = state.currentUser
          if (!user) return {}
          const entry: AuditLog = {
            id: `aud_cfg_${Date.now().toString(36)}_${state.activityLog.length}`,
            actor: {
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
            },
            action,
            target,
            description,
            ipAddress: "102.89.34.12",
            createdAt: new Date().toISOString(),
          }
          return { activityLog: [entry, ...state.activityLog] }
        }),

      environment: "sandbox",
      setEnvironment: (environment) => set({ environment }),

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "optimus-mock-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage
      ),
      // Only the session, onboarding state, and environment survive a refresh.
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentOrg: state.currentOrg,
        hasSampleData: state.hasSampleData,
        setupCompletion: state.setupCompletion,
        environment: state.environment,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
)
