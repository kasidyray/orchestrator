"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

interface DataTablePaginationProps {
  page: number
  pageCount: number
  totalRows: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  page,
  pageCount,
  totalRows,
  pageSize,
  onPageChange,
}: DataTablePaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{totalRows}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          Previous
        </Button>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </div>
    </div>
  )
}
