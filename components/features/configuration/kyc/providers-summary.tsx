"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { SecurityCheckIcon } from "@hugeicons/core-free-icons"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { ProviderSelect } from "@/components/features/kyc/provider-select"
import { requirementIcon } from "@/components/features/kyc/kyc-meta"
import { KYC_REQUIREMENT_CATALOG } from "@/lib/constants"
import type { KycTierState } from "@/components/features/kyc/kyc-types"

interface ProvidersSummaryProps {
  tiers: KycTierState[]
  /** Set one provider for a check across every tier that requires it. */
  onSetProvider: (reqId: string, providerId: string) => void
}

interface SummaryRow {
  id: string
  label: string
  providerOptions: string[]
  tierCount: number
  tierNames: string[]
  displayProvider: string | null
  pending: boolean
  mixed: boolean
}

function buildRows(tiers: KycTierState[]): SummaryRow[] {
  return KYC_REQUIREMENT_CATALOG.flatMap((req) => {
    const using = tiers.filter((tier) => tier.reqs[req.id]?.on)
    if (using.length === 0) return []

    const providers = using.map((tier) => tier.reqs[req.id]?.provider ?? null)
    const chosen = providers.filter((p): p is string => Boolean(p))
    const distinct = new Set(chosen)

    return [
      {
        id: req.id,
        label: req.label,
        providerOptions: req.providers,
        tierCount: using.length,
        tierNames: using.map((tier) => tier.name),
        displayProvider: chosen[0] ?? null,
        pending: providers.some((p) => !p),
        mixed: distinct.size > 1,
      },
    ]
  })
}

export function ProvidersSummary({
  tiers,
  onSetProvider,
}: ProvidersSummaryProps) {
  const rows = buildRows(tiers)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={SecurityCheckIcon}
        title="No checks enabled yet"
        description="Turn on a verification check for any tier above and its provider will appear here."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Check</TableHead>
            <TableHead>Used by</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon
                      icon={requirementIcon(row.id)}
                      className="size-4"
                    />
                  </span>
                  <span className="font-medium text-foreground">
                    {row.label}
                  </span>
                </div>
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={row.tierNames.join(", ")}
              >
                {row.tierCount} {row.tierCount === 1 ? "tier" : "tiers"}
              </TableCell>
              <TableCell>
                <ProviderSelect
                  options={row.providerOptions}
                  value={row.displayProvider}
                  onChange={(providerId) => onSetProvider(row.id, providerId)}
                />
              </TableCell>
              <TableCell className="text-right">
                {row.pending ? (
                  <StatusBadge variant="warning" label="Needs provider" />
                ) : row.mixed ? (
                  <StatusBadge variant="info" label="Mixed" />
                ) : (
                  <StatusBadge variant="success" label="Configured" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
