"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Delete02Icon,
  Download01Icon,
  FavouriteIcon,
  PlusSignIcon,
  Settings02Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/shared/copy-button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { SkeletonCard } from "@/components/shared/skeleton-card"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  API_KEY_STATUS_CONFIG,
  CUSTOMER_STATUS_CONFIG,
  ENV_CONFIG,
  KYB_STATUS_CONFIG,
  TRANSACTION_STATUS_CONFIG,
  WEBHOOK_STATUS_CONFIG,
} from "@/lib/constants"
import { formatCurrency, formatDate, truncateId } from "@/lib/utils"

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const sizes = ["xs", "sm", "default", "lg"] as const

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default function DemoPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-2 p-6 md:p-10">
      <PageHeader
        title="Component demo"
        description="Kitchen sink for foundation components. Press d to toggle dark mode."
        actions={
          <Button onClick={() => toast.success("Toast fired")}>
            Test toast
          </Button>
        }
      />

      <Section title="Button — variants" description="All visual variants.">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Button — sizes" description="From xs to lg.">
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              Size {size}
            </Button>
          ))}
        </div>
      </Section>

      <Section
        title="Button — with Hugeicons"
        description="Leading, trailing, and icon-only buttons."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} />
            New item
          </Button>
          <Button variant="secondary">
            Continue
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={Download01Icon} />
            Download
          </Button>
          <Button variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </Button>
          <Button size="icon" aria-label="Like">
            <HugeiconsIcon icon={FavouriteIcon} />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Settings">
            <HugeiconsIcon icon={Settings02Icon} />
          </Button>
        </div>
      </Section>

      <Section
        title="StatusBadge"
        description="Domain status maps from lib/constants config."
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge {...TRANSACTION_STATUS_CONFIG.successful} />
          <StatusBadge {...TRANSACTION_STATUS_CONFIG.pending} />
          <StatusBadge {...TRANSACTION_STATUS_CONFIG.failed} />
          <StatusBadge {...TRANSACTION_STATUS_CONFIG.reversed} />
          <StatusBadge {...KYB_STATUS_CONFIG.in_review} />
          <StatusBadge {...CUSTOMER_STATUS_CONFIG.blocked} />
          <StatusBadge {...API_KEY_STATUS_CONFIG.expired} />
          <StatusBadge {...WEBHOOK_STATUS_CONFIG.delivered} />
        </div>
      </Section>

      <Section
        title="Environment tokens"
        description="New env-* tokens added to globals.css."
      >
        <div className="flex flex-wrap items-center gap-2">
          {(["sandbox", "live", "live_locked"] as const).map((env) => (
            <span
              key={env}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${ENV_CONFIG[env].badgeClass}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {ENV_CONFIG[env].label}
            </span>
          ))}
        </div>
      </Section>

      <Section
        title="Utilities"
        description="formatCurrency, formatDate, truncateId, CopyButton."
      >
        <div className="flex flex-col gap-2 font-mono text-sm">
          <div>{formatCurrency(1250000)}</div>
          <div>{formatCurrency(4200.5, "USD")}</div>
          <div>{formatDate("2024-06-20T08:14:00.000Z", { withTime: true })}</div>
          <div className="flex items-center gap-2">
            <span>{truncateId("cus_xk29ab7f93")}</span>
            <CopyButton value="cus_xk29ab7f93" label="Copy ID" />
          </div>
        </div>
      </Section>

      <Section
        title="SectionCard + SkeletonCard"
        description="Populated and loading states side by side."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard
            title="Account balance"
            description="Across all wallets"
          >
            <p className="text-2xl font-semibold">{formatCurrency(11725200.75)}</p>
          </SectionCard>
          <SkeletonCard rows={3} />
        </div>
      </Section>

      <Section
        title="EmptyState"
        description="Confident, actionable empty state."
      >
        <div className="rounded-xl border border-border">
          <EmptyState
            icon={UserMultipleIcon}
            title="No customers yet"
            description="Your first customer is one integration away."
            action={<Button>Add customer</Button>}
          />
        </div>
      </Section>
    </div>
  )
}
