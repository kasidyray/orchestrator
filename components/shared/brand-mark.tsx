import { HugeiconsIcon } from "@hugeicons/react"
import { ShieldKeyIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

interface BrandMarkProps {
  /** "inverted" suits dark/primary backgrounds. */
  variant?: "default" | "inverted"
  /** Hide the wordmark, showing only the logo square. */
  iconOnly?: boolean
  className?: string
}

/** Optimus Business logo mark + wordmark. */
export function BrandMark({
  variant = "default",
  iconOnly = false,
  className,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          variant === "inverted"
            ? "bg-primary-foreground/15 text-primary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <HugeiconsIcon icon={ShieldKeyIcon} className="size-5" />
      </div>
      {iconOnly ? null : (
        <span className="text-sm font-semibold tracking-tight">
          Optimus Business
        </span>
      )}
    </div>
  )
}
