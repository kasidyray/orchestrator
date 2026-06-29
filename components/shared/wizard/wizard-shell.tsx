"use client"

import { cn } from "@/lib/utils"
import { WizardProgressBar } from "@/components/shared/wizard/wizard-progress-bar"
import { WizardStepRail } from "@/components/shared/wizard/wizard-step-rail"
import type { WizardStep } from "@/components/shared/wizard/types"

interface WizardShellProps {
  steps: WizardStep[]
  /** Zero-based index of the active step. */
  current: number
  /** Highest step index the user may jump to via the rail. */
  maxReached?: number
  /** When provided, reachable rail steps become clickable. */
  onStepSelect?: (index: number) => void
  /** Action bar rendered beneath the step content (e.g. Back/Continue). */
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Full-screen wizard layout. A progress bar sits flush under the page topbar,
 * the vertical step rail anchors to the left edge of the screen, and the active
 * step's content is centred in the viewport. Reusable across any multi-step
 * setup flow — the caller owns step state and renders the body.
 */
export function WizardShell({
  steps,
  current,
  maxReached,
  onStepSelect,
  footer,
  children,
  className,
}: WizardShellProps) {
  const progress = steps.length > 0 ? ((current + 1) / steps.length) * 100 : 0

  return (
    <div className={cn("flex flex-1 flex-col", className)}>
      <WizardProgressBar
        value={progress}
        className="sticky top-16 z-20 rounded-none"
      />

      <div className="grid flex-1 grid-cols-1 gap-y-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,46rem)_minmax(0,1fr)] lg:gap-x-10 lg:px-8 lg:py-14">
        <aside className="lg:sticky lg:top-28 lg:self-start lg:justify-self-start lg:pl-4">
          <WizardStepRail
            steps={steps}
            current={current}
            maxReached={maxReached}
            onStepSelect={onStepSelect}
          />
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <div className="min-w-0">{children}</div>
          {footer}
        </div>
      </div>
    </div>
  )
}
