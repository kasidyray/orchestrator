"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell as UITableCell,
  TableFooter,
  TableHead as UITableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/**
 * Shared table styling — the enterprise look from the dashboard recent-activity
 * table, applied once at the primitive level. Import tables from here (NOT from
 * components/ui/table) so every table across the app stays visually identical.
 */
const HEAD_CLASS =
  "h-auto bg-background px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground"
const CELL_CLASS = "px-4 py-3 text-[13px]"

function TableHeader({
  className,
  ...props
}: React.ComponentProps<typeof UITableHeader>) {
  // Header rows never show the row-hover background.
  return (
    <UITableHeader
      className={cn("[&_tr]:hover:bg-transparent", className)}
      {...props}
    />
  )
}

function TableHead({
  className,
  ...props
}: React.ComponentProps<typeof UITableHead>) {
  return <UITableHead className={cn(HEAD_CLASS, className)} {...props} />
}

function TableCell({
  className,
  ...props
}: React.ComponentProps<typeof UITableCell>) {
  return <UITableCell className={cn(CELL_CLASS, className)} {...props} />
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
