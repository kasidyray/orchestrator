import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Invoice01Icon } from "@hugeicons/core-free-icons"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { CopyButton } from "@/components/shared/copy-button"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { TRANSACTION_STATUS_CONFIG } from "@/lib/constants"
import { cn, formatCurrency, formatDate, truncateId } from "@/lib/utils"
import type { Transaction } from "@/lib/types"

export function RecentActivity({
  transactions,
}: {
  transactions: Transaction[]
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 py-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Recent activity
          </h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Latest transactions across all wallet products.
          </p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold text-primary transition-colors hover:bg-accent"
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={Invoice01Icon}
          title="No transactions yet"
          description="Once your customers start transacting, activity will appear here."
          className="py-12"
        />
      ) : (
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((txn) => {
              const credit = txn.type === "credit"
              return (
                <TableRow key={txn.id}>
                  <TableCell className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <code className="font-mono text-[13px] text-foreground">
                        {truncateId(txn.reference)}
                      </code>
                      <CopyButton
                        value={txn.reference}
                        label="Copy transaction reference"
                        size="icon-xs"
                      />
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13.5px] font-medium text-foreground">
                    {txn.customerName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">
                    {txn.narration}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-4 py-3 text-right font-mono text-[13px] font-medium tabular-nums",
                      credit ? "text-success" : "text-foreground"
                    )}
                  >
                    {credit ? "+" : "−"}
                    {formatCurrency(txn.amount, txn.currency)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge {...TRANSACTION_STATUS_CONFIG[txn.status]} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-[12.5px] text-muted-foreground tabular-nums">
                    {formatDate(txn.createdAt, { withTime: true })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
