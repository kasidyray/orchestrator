"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { SquareLock02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEnvironment } from "@/hooks/use-environment"
import { cn } from "@/lib/utils"

/**
 * Compact environment control: a single switch labelled "Go live". On flips the
 * app to the live environment; off returns to sandbox. Stays disabled (with a
 * tooltip) until onboarding unlocks live.
 */
export function GoLiveSwitch() {
  const { environment, setEnvironment, liveUnlocked } = useEnvironment()
  const isLive = environment === "live"

  function handleChange(checked: boolean) {
    if (!liveUnlocked) return
    setEnvironment(checked ? "live" : "sandbox")
    toast.success(checked ? "Switched to Live" : "Switched to Sandbox")
  }

  const control = (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          isLive ? "text-env-live" : "text-muted-foreground"
        )}
      >
        Go live
      </span>
      <Switch
        checked={isLive}
        onCheckedChange={handleChange}
        disabled={!liveUnlocked}
        aria-label="Go live"
      />
      {!liveUnlocked ? (
        <HugeiconsIcon
          icon={SquareLock02Icon}
          className="size-3.5 text-muted-foreground"
        />
      ) : null}
    </div>
  )

  if (liveUnlocked) return control

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<div className="cursor-not-allowed">{control}</div>}
        />
        <TooltipContent>Finish onboarding to go live.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
