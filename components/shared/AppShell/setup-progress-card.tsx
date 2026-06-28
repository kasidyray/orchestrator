"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSetupProgress } from "@/hooks/use-setup-progress"

/**
 * Sidebar onboarding card. Mirrors the dashboard checklist progress (shared via
 * useSetupProgress) and routes operators to the next incomplete step. Hidden
 * once every step is complete.
 */
export function SetupProgressCard() {
  const { steps, completedCount, total, allComplete, pct } = useSetupProgress()

  if (allComplete) return null

  const nextStep = steps.find((step) => !step.completed)
  const href = nextStep?.href ?? "/dashboard"

  return (
    <div className="rounded-xl border border-sidebar-border bg-background p-3.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">
          Setup guide
        </span>
        <span className="font-mono text-sm font-semibold tabular-nums text-primary">
          {completedCount}/{total}
        </span>
      </div>

      <p className="text-[12.5px] leading-relaxed text-muted-foreground">
        Finish setup to go live and start moving real money.
      </p>

      <Progress value={pct} className="mt-3 h-2" />

      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        nativeButton={false}
        render={<Link href={href} />}
      >
        Continue setup
      </Button>
    </div>
  )
}
