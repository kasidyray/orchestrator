"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { copyToClipboard } from "@/lib/utils"

interface CopyButtonProps {
  /** The text copied to the clipboard. */
  value: string
  /** Tooltip / aria label. Defaults to "Copy". */
  label?: string
  size?: "icon-xs" | "icon-sm" | "icon"
  className?: string
}

/**
 * Tactile copy control: swaps to a check icon for 2s after a successful copy.
 * Used for API keys, IDs, and secrets.
 */
export function CopyButton({
  value,
  label = "Copy",
  size = "icon-sm",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyToClipboard(value)
    if (!ok) return
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size={size}
              onClick={handleCopy}
              aria-label={copied ? "Copied" : label}
              className={className}
            >
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                className={copied ? "text-success" : undefined}
              />
            </Button>
          }
        />
        <TooltipContent>{copied ? "Copied" : label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
