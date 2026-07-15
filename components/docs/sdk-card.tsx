"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, PackageIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import type { SdkDownload } from "@/lib/constants"

/** Downloadable SDK/tool card for the docs Resources section. */
export function SdkCard({ download }: { download: SdkDownload }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <HugeiconsIcon icon={PackageIcon} className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {download.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {download.description}
          </span>
          <span className="mt-1 font-mono text-xs text-muted-foreground">
            {download.version}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success(`Downloading ${download.name}…`)}
        >
          <HugeiconsIcon icon={Download01Icon} />
          Download
        </Button>
      </div>
    </div>
  )
}
