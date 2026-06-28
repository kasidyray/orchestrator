import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StatusVariant } from "@/lib/types"

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
}

interface StatusBadgeProps {
  variant: StatusVariant
  label: string
  /** Show the leading status dot. Defaults to true. */
  dot?: boolean
  className?: string
}

/**
 * Renders a domain status as a coloured badge. Pair with the *_STATUS_CONFIG
 * maps in lib/constants, e.g.
 *   <StatusBadge {...TRANSACTION_STATUS_CONFIG[tx.status]} />
 */
export function StatusBadge({
  variant,
  label,
  dot = true,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(VARIANT_CLASSES[variant], className)}
    >
      {dot ? (
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      ) : null}
      {label}
    </Badge>
  )
}
