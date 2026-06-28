"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"

import { CopyButton } from "@/components/shared/copy-button"
import { SectionCard } from "@/components/shared/section-card"

const SIGNING_SECRET = "whsec_3f9a2b8c1d4e5f6a7b8c9d0e1f2a3b4c"

function mask(secret: string) {
  return `${secret.slice(0, 6)}${"•".repeat(18)}${secret.slice(-4)}`
}

export function WebhookSigningSecret() {
  const [revealed, setRevealed] = React.useState(false)

  return (
    <SectionCard
      title="Signing secret"
      description="Verify the X-Optimus-Signature header on every delivery using this secret."
    >
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
          {revealed ? SIGNING_SECRET : mask(SIGNING_SECRET)}
        </code>
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          aria-label={revealed ? "Hide secret" : "Reveal secret"}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <HugeiconsIcon
            icon={revealed ? ViewOffSlashIcon : ViewIcon}
            className="size-4"
          />
        </button>
        <CopyButton value={SIGNING_SECRET} label="Copy secret" />
      </div>
    </SectionCard>
  )
}
