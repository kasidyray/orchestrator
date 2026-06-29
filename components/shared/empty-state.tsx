import { HugeiconsIcon } from "@hugeicons/react"
import { InboxIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

interface EmptyStateProps {
  /** Contextually appropriate icon — defaults to an inbox. */
  icon?: IconSvgElement
  title: string
  description?: string
  /** A single primary CTA, typically a <Button>. */
  action?: React.ReactNode
  /**
   * Grow to fill the available height and centre vertically — for page-level
   * empty states. Leave off for compact, inline states (inside a table, card,
   * or section) where the content sits in flow.
   */
  fullHeight?: boolean
  className?: string
}

/**
 * Confident empty state: a layered illustration, a direct headline, one line of
 * direction, and a single CTA. An invitation to act — never an apology for
 * missing data.
 */
export function EmptyState({
  icon = InboxIcon,
  title,
  description,
  action,
  fullHeight = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 px-6 text-center",
        fullHeight ? "min-h-96 flex-1 py-16" : "py-16",
        className
      )}
    >
      {/* Stacked-card illustration: two faint cards fanned behind a solid one. */}
      <div className="relative flex h-20 w-24 items-center justify-center">
        <div
          aria-hidden
          className="absolute size-16 -translate-x-4 translate-y-1 -rotate-[8deg] rounded-2xl border border-border/60 bg-muted/40"
        />
        <div
          aria-hidden
          className="absolute size-16 translate-x-4 translate-y-1 rotate-[8deg] rounded-2xl border border-border/60 bg-muted/40"
        />
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm">
          <HugeiconsIcon icon={icon} className="size-7" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
