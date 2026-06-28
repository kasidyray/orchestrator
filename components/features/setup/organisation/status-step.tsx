import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { KYB_STATUS_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"
import type { KYBStatus } from "@/lib/types"

interface StatusView {
  icon: IconSvgElement
  iconClass: string
  title: string
  body: string
  action: { label: string; href: string }
}

const STATUS_VIEW: Record<KYBStatus, StatusView> = {
  pending: {
    icon: Clock01Icon,
    iconClass: "bg-warning/10 text-warning",
    title: "Application not yet submitted",
    body: "Complete the previous steps and submit to start verification.",
    action: { label: "Back to dashboard", href: "/dashboard" },
  },
  in_review: {
    icon: Clock01Icon,
    iconClass: "bg-info/10 text-info",
    title: "Your application is under review",
    body: "We're verifying your business documents. This usually takes 1–2 business days — we'll email you once it's done.",
    action: { label: "Back to dashboard", href: "/dashboard" },
  },
  verified: {
    icon: CheckmarkCircle02Icon,
    iconClass: "bg-success/10 text-success",
    title: "Your organisation is verified",
    body: "Everything checks out. You can now configure products and take your integration live.",
    action: { label: "Go to dashboard", href: "/dashboard" },
  },
  rejected: {
    icon: CancelCircleIcon,
    iconClass: "bg-destructive/10 text-destructive",
    title: "We couldn't verify your organisation",
    body: "Some documents didn't pass review — the certificate of incorporation was unreadable. Update it and resubmit.",
    action: { label: "Update and resubmit", href: "/setup/organisation" },
  },
}

const TOGGLE_ORDER: KYBStatus[] = [
  "in_review",
  "verified",
  "rejected",
  "pending",
]

interface StatusStepProps {
  status: KYBStatus
  onStatusChange: (status: KYBStatus) => void
}

export function StatusStep({ status, onStatusChange }: StatusStepProps) {
  const view = STATUS_VIEW[status]

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-full",
          view.iconClass
        )}
      >
        <HugeiconsIcon icon={view.icon} className="size-8" />
      </span>

      <div className="flex flex-col items-center gap-3">
        <StatusBadge {...KYB_STATUS_CONFIG[status]} />
        <h2 className="text-xl font-semibold tracking-tight">{view.title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{view.body}</p>
      </div>

      <Button render={<Link href={view.action.href} />} nativeButton={false}>
        {view.action.label}
      </Button>

      <div className="mt-4 flex flex-col items-center gap-2 border-t border-border pt-6">
        <span className="text-xs font-medium text-muted-foreground">
          Preview status (demo)
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {TOGGLE_ORDER.map((option) => (
            <Button
              key={option}
              variant={option === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onStatusChange(option)}
            >
              {KYB_STATUS_CONFIG[option].label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
