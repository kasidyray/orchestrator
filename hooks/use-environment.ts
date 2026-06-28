import { useAppStore } from "@/store"
import { useSetupProgress } from "@/hooks/use-setup-progress"

/**
 * Environment switching state for the topbar badge. `liveUnlocked` tracks the
 * shared onboarding progress: Live only becomes selectable once all five setup
 * steps are complete; until then the badge stays locked to Sandbox.
 */
export function useEnvironment() {
  const environment = useAppStore((state) => state.environment)
  const setEnvironment = useAppStore((state) => state.setEnvironment)
  const { allComplete } = useSetupProgress()

  return { environment, setEnvironment, liveUnlocked: allComplete }
}
