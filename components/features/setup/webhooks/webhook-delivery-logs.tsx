"use client"

import * as React from "react"
import { WebhookIcon } from "@hugeicons/core-free-icons"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { WEBHOOK_STATUS_CONFIG } from "@/lib/constants"
import { cn, formatDate } from "@/lib/utils"
import type { WebhookLog } from "@/lib/types"

export function WebhookDeliveryLogs({ logs }: { logs: WebhookLog[] }) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Delivery logs</CardTitle>
        <CardDescription>
          Recent webhook deliveries and their responses.
        </CardDescription>
      </CardHeader>

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={WebhookIcon}
          title="No deliveries yet"
          description="Once events fire, their delivery attempts will appear here."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const ok = log.httpStatus >= 200 && log.httpStatus < 300
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {log.event}
                    </TableCell>
                    <TableCell>
                      <StatusBadge {...WEBHOOK_STATUS_CONFIG[log.status]} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-mono text-xs font-medium",
                          log.httpStatus === 0
                            ? "text-muted-foreground"
                            : ok
                              ? "text-success"
                              : "text-destructive"
                        )}
                      >
                        {log.httpStatus === 0 ? "—" : log.httpStatus}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {log.attempts}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {log.responseTimeMs === 0
                        ? "—"
                        : `${log.responseTimeMs} ms`}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(log.createdAt, { withTime: true })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
