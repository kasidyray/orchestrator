"use client"

import * as React from "react"
import { DocumentValidationIcon } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/empty-state"
import {
  DataTable,
  type ColumnDef,
} from "@/components/shared/DataTable/data-table"
import { formatDate } from "@/lib/utils"
import type { AuditLog } from "@/lib/types"

const PAGE_SIZE = 10

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const pageCount = Math.max(1, Math.ceil(logs.length / PAGE_SIZE))
  const pageRows = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: ColumnDef<AuditLog>[] = [
    {
      id: "actor",
      header: "Actor",
      cell: (log) => (
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarImage src={log.actor.avatarUrl} alt={log.actor.name} />
            <AvatarFallback>{initials(log.actor.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">
            {log.actor.name}
          </span>
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: (log) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {log.action}
        </code>
      ),
    },
    {
      id: "description",
      header: "Description",
      className: "max-w-72 text-muted-foreground",
      cell: (log) => <span className="truncate">{log.description}</span>,
    },
    {
      id: "ip",
      header: "IP address",
      className: "font-mono text-xs text-muted-foreground",
      cell: (log) => log.ipAddress,
    },
    {
      id: "date",
      header: "Date",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (log) => formatDate(log.createdAt, { withTime: true }),
    },
  ]

  return (
    <div className="border-y border-border">
      <DataTable
        columns={columns}
        rows={pageRows}
        getRowKey={(log) => log.id}
        loading={loading}
        page={page}
        pageCount={pageCount}
        totalRows={logs.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyState={
          <EmptyState
            icon={DocumentValidationIcon}
            title="No audit entries yet"
            description="Account activity will be recorded here."
          />
        }
      />
    </div>
  )
}
