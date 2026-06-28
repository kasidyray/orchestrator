"use client"

import * as React from "react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  DataTable,
  type ColumnDef,
} from "@/components/shared/DataTable/data-table"
import { DataTableToolbar } from "@/components/shared/DataTable/data-table-toolbar"
import { TransactionDetailDrawer } from "@/components/features/transactions/transaction-detail-drawer"
import { TRANSACTION_STATUS_CONFIG } from "@/lib/constants"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import type { Customer, Transaction, Wallet } from "@/lib/types"

const PAGE_SIZE = 10

const DATE_RANGES: Record<string, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
}

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
]

const DATE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
]

interface TransactionsTableProps {
  transactions: Transaction[]
  customers: Customer[]
  wallets: Wallet[]
}

export function TransactionsTable({
  transactions,
  customers,
  wallets,
}: TransactionsTableProps) {
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [product, setProduct] = React.useState("all")
  const [dateRange, setDateRange] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Transaction | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const customersById = React.useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers]
  )
  const walletsById = React.useMemo(
    () => new Map(wallets.map((wallet) => [wallet.id, wallet])),
    [wallets]
  )
  const productNames = React.useMemo(
    () => Array.from(new Set(wallets.map((wallet) => wallet.productName))),
    [wallets]
  )
  const productOptions = React.useMemo(
    () => [
      { value: "all", label: "All products" },
      ...productNames.map((name) => ({ value: name, label: name })),
    ],
    [productNames]
  )

  const referenceTime = React.useMemo(
    () => Math.max(...transactions.map((txn) => Date.parse(txn.createdAt))),
    [transactions]
  )

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return transactions.filter((txn) => {
      const haystack =
        `${txn.reference} ${txn.customerName} ${txn.narration}`.toLowerCase()
      if (query && !haystack.includes(query)) return false
      if (status !== "all" && txn.status !== status) return false
      if (product !== "all") {
        const name = walletsById.get(txn.walletId)?.productName
        if (name !== product) return false
      }
      if (dateRange !== "all") {
        const cutoff = referenceTime - DATE_RANGES[dateRange] * 86_400_000
        if (Date.parse(txn.createdAt) < cutoff) return false
      }
      return true
    })
  }, [
    transactions,
    search,
    status,
    product,
    dateRange,
    walletsById,
    referenceTime,
  ])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  function resetTo(setter: (value: string) => void) {
    return (value: string | null) => {
      setter(value ?? "all")
      setPage(1)
    }
  }

  function openTransaction(txn: Transaction) {
    setSelected(txn)
    setDrawerOpen(true)
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "reference",
      header: "Reference",
      cell: (txn) => (
        <code className="font-mono text-xs text-foreground">
          {txn.reference}
        </code>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      className: "max-w-44",
      cell: (txn) => (
        <span className="truncate text-sm">{txn.customerName}</span>
      ),
    },
    {
      id: "channel",
      header: "Channel",
      className: "capitalize text-muted-foreground",
      cell: (txn) => txn.channel,
    },
    {
      id: "amount",
      header: "Amount",
      headerClassName: "text-right",
      className: "text-right",
      cell: (txn) => (
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            txn.type === "credit" ? "text-success" : "text-foreground"
          )}
        >
          {txn.type === "credit" ? "+" : "−"}
          {formatCurrency(txn.amount, txn.currency)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (txn) => <StatusBadge {...TRANSACTION_STATUS_CONFIG[txn.status]} />,
    },
    {
      id: "date",
      header: "Date",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (txn) => formatDate(txn.createdAt, { withTime: true }),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        search={search}
        onSearchChange={resetTo(setSearch)}
        placeholder="Search by reference, customer, or narration"
      >
        <Select
          items={STATUS_OPTIONS}
          value={status}
          onValueChange={resetTo(setStatus)}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={productOptions}
          value={product}
          onValueChange={resetTo(setProduct)}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {productOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={DATE_OPTIONS}
          value={dateRange}
          onValueChange={resetTo(setDateRange)}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableToolbar>

      <div className="border-y border-border">
        <DataTable
          columns={columns}
          rows={pageRows}
          getRowKey={(txn) => txn.id}
          onRowClick={openTransaction}
          loading={loading}
          page={safePage}
          pageCount={pageCount}
          totalRows={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          emptyState={
            <EmptyState
              icon={ArrowDataTransferHorizontalIcon}
              title="No transactions match your filters"
              description="Try adjusting your search or clearing the filters."
            />
          }
        />
      </div>

      <TransactionDetailDrawer
        transaction={selected}
        customer={
          selected ? customersById.get(selected.customerId) : undefined
        }
        wallet={selected ? walletsById.get(selected.walletId) : undefined}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
