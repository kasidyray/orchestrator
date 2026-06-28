import { useAppStore } from "@/store"
import { SETUP_CHECKLIST } from "@/lib/constants"
import type { SetupStep } from "@/lib/constants"

export interface SetupStepState extends SetupStep {
  completed: boolean
}

/**
 * Single source of truth for onboarding progress. The dashboard hero, its
 * progress ring, the header counts, and the sidebar mini-progress all read from
 * here so they advance together. `allComplete` is what unlocks the Live
 * environment.
 */
export function useSetupProgress() {
  const completion = useAppStore((state) => state.setupCompletion)
  const setSetupStep = useAppStore((state) => state.setSetupStep)

  const steps: SetupStepState[] = SETUP_CHECKLIST.map((step) => ({
    ...step,
    completed: completion[step.id],
  }))

  const total = steps.length
  const completedCount = steps.filter((step) => step.completed).length
  const allComplete = completedCount === total
  const pct = Math.round((completedCount / total) * 100)

  return { steps, total, completedCount, allComplete, pct, setSetupStep }
}
