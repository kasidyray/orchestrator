"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import type { WizardStep } from "@/components/shared/wizard/types"

interface WizardStepRailProps {
  steps: WizardStep[]
  /** Zero-based index of the active step. */
  current: number
  /**
   * Highest step index the user is allowed to jump to. Steps beyond this stay
   * disabled. Defaults to the current step (back-navigation only).
   */
  maxReached?: number
  /** When provided, reachable steps become clickable. */
  onStepSelect?: (index: number) => void
  className?: string
}

/**
 * Vertical step rail with a large "n / total" counter — the navigation column
 * for a multi-step wizard. Completed steps show a tick, the active step is
 * highlighted, and upcoming steps are muted until reached.
 */
export function WizardStepRail({
  steps,
  current,
  maxReached = current,
  onStepSelect,
  className,
}: WizardStepRailProps) {
  return (
    <nav
      aria-label="Setup steps"
      className={cn("flex min-w-64 flex-col gap-6", className)}
    >
      <p className="pl-3 text-3xl font-semibold tracking-tight tabular-nums">
        <span className="text-primary">{current + 1}</span>
        <span className="text-muted-foreground"> / {steps.length}</span>
      </p>

      <ul className="flex flex-col gap-1">
        {steps.map((step, index) => {
          const complete = index < current
          const active = index === current
          const reachable = index <= maxReached
          const interactive = Boolean(onStepSelect) && reachable && !active

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!interactive}
                onClick={interactive ? () => onStepSelect?.(index) : undefined}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                  active && "bg-muted text-foreground",
                  !active && reachable && "text-foreground hover:bg-muted/60",
                  !reachable && "text-muted-foreground",
                  interactive ? "cursor-pointer" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-150 motion-reduce:transition-none",
                    complete && "border-success bg-success text-success-foreground",
                    active && "border-primary text-primary",
                    !complete && !active && "border-border text-muted-foreground"
                  )}
                >
                  {complete ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  ) : step.icon ? (
                    <HugeiconsIcon icon={step.icon} className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="truncate">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
