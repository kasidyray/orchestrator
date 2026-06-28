import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

/** Inline loading spinner for async buttons and pending states. */
export function Spinner({ className }: { className?: string }) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      className={cn("animate-spin", className)}
      aria-hidden
    />
  )
}
