import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

export interface StepperStep {
  id: string
  label: string
}

interface StepperProps {
  steps: StepperStep[]
  /** Zero-based index of the active step. */
  current: number
  className?: string
}

/** Horizontal progress indicator for multi-step flows. */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const complete = index < current
          const active = index === current
          const last = index === steps.length - 1

          return (
            <li
              key={step.id}
              className={cn("flex items-center", !last && "flex-1")}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                    complete && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary text-primary",
                    !complete && !active && "border-border text-muted-foreground"
                  )}
                >
                  {complete ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-medium sm:block",
                    active || complete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!last ? (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    complete ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>

      <p className="text-xs text-muted-foreground sm:hidden">
        Step {current + 1} of {steps.length} — {steps[current]?.label}
      </p>
    </div>
  )
}
