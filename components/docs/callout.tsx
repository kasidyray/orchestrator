import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  AlertDiamondIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type CalloutVariant = "info" | "warning" | "danger"

const VARIANT_CONFIG: Record<
  CalloutVariant,
  { icon: typeof InformationCircleIcon; className: string; iconClass: string }
> = {
  info: {
    icon: InformationCircleIcon,
    className: "border-info/30 bg-info/5",
    iconClass: "text-info",
  },
  warning: {
    icon: Alert02Icon,
    className: "border-warning/40 bg-warning/5",
    iconClass: "text-warning",
  },
  danger: {
    icon: AlertDiamondIcon,
    className: "border-destructive/30 bg-destructive/5",
    iconClass: "text-destructive",
  },
}

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
}

/** Inline admonition for docs prose — info, warning, or danger. */
export function Callout({ variant = "info", title, children }: CalloutProps) {
  const config = VARIANT_CONFIG[variant]

  return (
    <div
      className={cn(
        "my-5 flex gap-3 rounded-lg border px-4 py-3",
        config.className
      )}
    >
      <HugeiconsIcon
        icon={config.icon}
        className={cn("mt-0.5 size-4.5 shrink-0", config.iconClass)}
      />
      <div className="flex min-w-0 flex-col gap-1 text-sm text-foreground [&_p]:m-0 [&_p]:text-sm">
        {title ? <span className="font-medium">{title}</span> : null}
        <div className="text-muted-foreground [&_a]:text-foreground [&_code]:text-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
