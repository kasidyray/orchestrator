import { HugeiconsIcon } from "@hugeicons/react"
import { Building06Icon } from "@hugeicons/core-free-icons"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { ENV_CONFIG, KYB_STATUS_CONFIG, KYC_TIER_CONFIG } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import type { Organisation } from "@/lib/types"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
        {children}
      </dd>
    </div>
  )
}

export function OrgSummaryCard({ org }: { org: Organisation }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <HugeiconsIcon icon={Building06Icon} className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <CardTitle className="truncate">{org.name}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {org.industry}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <dl className="divide-y divide-border">
          <Field label="RC number">{org.rcNumber}</Field>
          <Field label="KYB status">
            <StatusBadge {...KYB_STATUS_CONFIG[org.kybStatus]} />
          </Field>
          <Field label="Environment">{ENV_CONFIG[org.environment].label}</Field>
          <Field label="KYC tier">{KYC_TIER_CONFIG[org.tier].label}</Field>
          <Field label="Country">{org.country}</Field>
          <Field label="Member since">{formatDate(org.createdAt)}</Field>
        </dl>
      </CardContent>
    </Card>
  )
}
