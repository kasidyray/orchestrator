"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  useSetupProgress,
  type SetupStepState,
} from "@/hooks/use-setup-progress"
import { cn } from "@/lib/utils"

/**
 * Onboarding view for a new business: a centered header + subtitle over a
 * numbered checklist in a constrained column. The next step is emphasised;
 * completed steps show a green check. Completion is read from the shared store
 * so the sidebar mini-progress advances in lockstep.
 */
export function SetupChecklist() {
  const { steps } = useSetupProgress()
  const nextIndex = steps.findIndex((step) => !step.completed)

  return (
    <div className="mx-auto w-full max-w-2xl pt-2 sm:pt-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Congrats on your new account!
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Complete these steps to get your account up and running.
        </p>
      </div>

      <ol className="mt-8 flex flex-col gap-1">
        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            number={index + 1}
            isNext={index === nextIndex}
          />
        ))}
      </ol>
    </div>
  )
}

function StepRow({
  step,
  number,
  isNext,
}: {
  step: SetupStepState
  number: number
  isNext: boolean
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl px-3 py-4 transition-colors",
        isNext && "bg-muted/60"
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums",
          isNext && !step.completed
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {number}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-[15px] font-semibold",
            step.completed ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {step.label}
        </span>
        <span className="text-[13px] text-muted-foreground">
          {step.description}
        </span>
      </div>

      {step.completed ? (
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-success-foreground"
          aria-label="Completed"
        >
          <HugeiconsIcon icon={Tick02Icon} className="size-4" strokeWidth={3} />
        </span>
      ) : isNext ? (
        <Button
          size="sm"
          className="shrink-0"
          render={<Link href={step.href} />}
          nativeButton={false}
        >
          {step.actionLabel}
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      ) : (
        <Button
          size="sm"
          className="shrink-0 bg-primary/10 text-primary shadow-none hover:bg-primary/20"
          render={<Link href={step.href} />}
          nativeButton={false}
        >
          {step.actionLabel}
        </Button>
      )}
    </li>
  )
}
