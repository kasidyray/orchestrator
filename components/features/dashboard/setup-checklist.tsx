"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  useSetupProgress,
  type SetupStepState,
} from "@/hooks/use-setup-progress"
import { CreateWebhookDialog } from "@/components/features/setup/webhooks/create-webhook-dialog"
import { CreateApiKeyDialog } from "@/components/features/setup/api-keys/create-api-key-dialog"
import { CelebrationIllustration } from "@/components/features/dashboard/celebration-illustration"
import { cn } from "@/lib/utils"

/**
 * Onboarding view for a new business: a centered header + subtitle over a
 * numbered checklist in a constrained column. The next step is emphasised;
 * completed steps show a green check and stay clickable so they can be reopened
 * and edited — only while the checklist is visible (i.e. setup is unfinished),
 * since completing the last step swaps this whole view for the dashboard.
 * Completion is read from the shared store so the sidebar mini-progress advances
 * in lockstep.
 */
export function SetupChecklist() {
  const { steps, setSetupStep } = useSetupProgress()
  const nextIndex = steps.findIndex((step) => !step.completed)
  const [webhookOpen, setWebhookOpen] = React.useState(false)
  const [apiKeyOpen, setApiKeyOpen] = React.useState(false)

  // Single sliding hover highlight: rests on the next step, glides to whatever
  // row is hovered, then eases back on mouse leave.
  const itemRefs = React.useRef<Array<HTMLLIElement | null>>([])
  const [activeIndex, setActiveIndex] = React.useState(nextIndex)
  const [box, setBox] = React.useState<{ top: number; height: number } | null>(
    null
  )

  React.useEffect(() => {
    setActiveIndex(nextIndex)
  }, [nextIndex])

  React.useLayoutEffect(() => {
    function measure() {
      const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null
      const next = el
        ? { top: el.offsetTop, height: el.offsetHeight }
        : null
      setBox((prev) => {
        if (prev === next) return prev
        if (prev && next && prev.top === next.top && prev.height === next.height)
          return prev
        return next
      })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [activeIndex, steps.length])

  return (
    <div className="mx-auto w-full max-w-2xl pt-2 sm:pt-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <CelebrationIllustration className="mb-2 animate-float-soft" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Let&apos;s get you set up.
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Complete these steps to get your account up and running.
        </p>
      </div>

      <ol
        className="relative mt-8 flex flex-col gap-1"
        onMouseLeave={() => setActiveIndex(nextIndex)}
      >
        {/* Sliding hover highlight */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 z-0 rounded-xl bg-muted transition-all duration-200 ease-out motion-reduce:transition-none",
            box ? "opacity-100" : "opacity-0"
          )}
          style={box ? { top: box.top, height: box.height } : undefined}
        />

        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            number={index + 1}
            isNext={index === nextIndex}
            innerRef={(el) => {
              itemRefs.current[index] = el
            }}
            onMouseEnter={() => setActiveIndex(index)}
            // Webhooks and API keys are created in a modal rather than their
            // own pages.
            onAction={
              step.id === "webhooks"
                ? () => setWebhookOpen(true)
                : step.id === "api-keys"
                  ? () => setApiKeyOpen(true)
                  : undefined
            }
          />
        ))}
      </ol>

      <CreateWebhookDialog
        open={webhookOpen}
        onOpenChange={setWebhookOpen}
        onCreated={() => setSetupStep("webhooks", true)}
      />
      <CreateApiKeyDialog
        open={apiKeyOpen}
        onOpenChange={setApiKeyOpen}
        onCreated={() => setSetupStep("api-keys", true)}
      />
    </div>
  )
}

function StepRow({
  step,
  number,
  isNext,
  innerRef,
  onMouseEnter,
  onAction,
}: {
  step: SetupStepState
  number: number
  isNext: boolean
  /** Ref to the row element, used to position the sliding highlight. */
  innerRef?: (el: HTMLLIElement | null) => void
  onMouseEnter?: () => void
  /** When set, the action opens this handler instead of navigating to href. */
  onAction?: () => void
}) {
  const router = useRouter()
  const actionProps = onAction
    ? { onClick: onAction }
    : { render: <Link href={step.href} />, nativeButton: false as const }

  // A completed row reopens the same destination — its modal, or its page.
  const activate = onAction ?? (() => router.push(step.href))
  const completedProps = step.completed
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: activate,
        onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            activate()
          }
        },
      }
    : {}

  return (
    <li
      ref={innerRef}
      onMouseEnter={onMouseEnter}
      {...completedProps}
      className={cn(
        "group relative z-10 flex items-center gap-4 rounded-xl px-3 py-4 outline-none",
        step.completed &&
          "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/50"
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
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[13px] font-medium text-muted-foreground opacity-0 transition-opacity duration-100 group-hover:opacity-100 motion-reduce:transition-none">
            Edit
          </span>
          <span
            className="grid size-8 place-items-center rounded-full bg-success text-success-foreground"
            aria-label="Completed"
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              className="size-4"
              strokeWidth={3}
            />
          </span>
        </div>
      ) : isNext ? (
        <Button size="sm" className="shrink-0" {...actionProps}>
          {step.actionLabel}
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      ) : (
        <Button
          size="sm"
          className="shrink-0 bg-primary/10 text-primary shadow-none hover:bg-primary/20"
          {...actionProps}
        >
          {step.actionLabel}
        </Button>
      )}
    </li>
  )
}
