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
  className?: string
}

/**
 * Confident empty state: icon, direct headline, one line of direction, and a
 * single CTA. An invitation to act — never an apology for missing data.
 */
export function EmptyState({
  icon = InboxIcon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
