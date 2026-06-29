import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"

import { formatDate } from "@/lib/utils"

interface ConfigProvenanceProps {
  /** Who last changed this section. */
  by: string
  /** ISO timestamp of the last change, or null if never changed. */
  at: string | null
}

/** Subtle "last updated by … · …" line that closes the trust loop on a change. */
export function ConfigProvenance({ by, at }: ConfigProvenanceProps) {
  if (!at) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <HugeiconsIcon icon={Clock01Icon} className="size-3.5 shrink-0" />
      <span>
        Last updated by{" "}
        <span className="font-medium text-foreground">{by}</span> ·{" "}
        {formatDate(at, { withTime: true })}
      </span>
    </p>
  )
}
