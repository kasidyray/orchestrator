"use client"

import * as React from "react"
import Link from "next/link"
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
 * completed steps show a green check. Completion is read from the shared store
 * so the sidebar mini-progress advances in lockstep.
 */
export function SetupChecklist() {
  const { steps, setSetupStep } = useSetupProgress()
  const nextIndex = steps.findIndex((step) => !step.completed)
  const [webhookOpen, setWebhookOpen] = React.useState(false)
  const [apiKeyOpen, setApiKeyOpen] = React.useState(false)

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

      <ol className="mt-8 flex flex-col gap-1">
        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            number={index + 1}
            isNext={index === nextIndex}
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
  onAction,
}: {
  step: SetupStepState
  number: number
  isNext: boolean
  /** When set, the action opens this handler instead of navigating to href. */
  onAction?: () => void
}) {
  const actionProps = onAction
    ? { onClick: onAction }
    : { render: <Link href={step.href} />, nativeButton: false as const }

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
