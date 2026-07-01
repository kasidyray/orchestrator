"use client"

import { CopyButton } from "@/components/shared/copy-button"
import { useSession } from "@/hooks/use-session"
import { cn } from "@/lib/utils"

interface BusinessIdBadgeProps {
  /** Show a small "Business ID" caption above the chip (for the sidebar). */
  withLabel?: boolean
  className?: string
}

/**
 * Compact, copyable Business ID chip. Self-sources the org from the session so
 * it can drop into the top bar or sidebar without props.
 */
export function BusinessIdBadge({ withLabel, className }: BusinessIdBadgeProps) {
  const { org } = useSession()

  if (!org) return null

  const chip = (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border bg-muted/40 py-0.5 pr-0.5 pl-2",
        className
      )}
    >
      <span className="truncate font-mono text-xs text-muted-foreground">
        {org.id}
      </span>
      <CopyButton value={org.id} label="Copy business ID" size="icon-xs" />
    </div>
  )

  if (!withLabel) return chip

  return (
    <div className="flex flex-col gap-1">
      <span className="px-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Business ID
      </span>
      {chip}
    </div>
  )
}
