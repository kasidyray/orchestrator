"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useEnvironment } from "@/hooks/use-environment"

/**
 * Post-onboarding hero shown on the dashboard once every setup step is complete
 * and the business is still in sandbox. It acknowledges completion and makes the
 * single most valuable next action — going live — the headline. Disappears once
 * the operator switches to the live environment.
 */
export function GoLiveHero() {
  const { environment, setEnvironment, liveUnlocked } = useEnvironment()

  if (!liveUnlocked || environment !== "sandbox") return null

  function goLive() {
    setEnvironment("live")
    toast.success("Switched to Live")
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-success/20 bg-success/5 p-5 duration-200 animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
          <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            You&apos;re all set — your live environment is ready
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Setup is complete. Switch to live to start moving real money, or keep
            building and testing in sandbox.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/developer" />}
        >
          Explore developer tools
        </Button>
        <Button onClick={goLive}>
          Switch to live
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      </div>
    </div>
  )
}
