import { useAppStore } from "@/store"

/**
 * The signed-in operator and their organisation. `hasHydrated` reports whether
 * the persisted store has loaded on the client yet — gate auth checks on it to
 * avoid redirecting before the session is known.
 *
 * MOCK: backed by the demo session in the store. Swap the store wiring for real
 * auth and this hook's shape can stay the same.
 */
export function useSession() {
  const user = useAppStore((state) => state.currentUser)
  const org = useAppStore((state) => state.currentOrg)
  const signOut = useAppStore((state) => state.signOut)
  const hasHydrated = useAppStore((state) => state.hasHydrated)

  return {
    user,
    org,
    isAuthenticated: user !== null && org !== null,
    hasHydrated,
    signOut,
  }
}
