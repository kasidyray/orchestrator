"use client"

import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { DataTablePagination } from "@/components/shared/DataTable/data-table-pagination"
import { cn } from "@/lib/utils"

export interface ColumnDef<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  /** The rows for the current page (already sliced by the caller). */
  rows: T[]
  getRowKey: (row: T) => string
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyState?: ReactNode
  page: number
  pageCount: number
  totalRows: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  loading = false,
  emptyState,
  page,
  pageCount,
  totalRows,
  pageSize,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} />
  }

  if (totalRows === 0) {
    return <>{emptyState}</>
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  onRowClick &&
                    "cursor-pointer hover:shadow-[inset_2px_0_0_var(--primary)]"
                )}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 ? (
        <DataTablePagination
          page={page}
          pageCount={pageCount}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  )
}
