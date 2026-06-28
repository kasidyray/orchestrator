"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { CUSTOMER_STATUS_CONFIG, KYC_TIER_CONFIG } from "@/lib/constants"
import { formatDate, truncateId } from "@/lib/utils"
import type { Customer } from "@/lib/types"

const PAGE_SIZE = 8

const DATE_RANGES: Record<string, number> = {
  "30": 30,
  "90": 90,
  "365": 365,
}

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
]

const TIER_OPTIONS = [
  { value: "all", label: "All tiers" },
  { value: "tier_0", label: "Tier 0" },
  { value: "tier_1", label: "Tier 1" },
  { value: "tier_2", label: "Tier 2" },
]

const JOINED_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
]

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [tier, setTier] = React.useState("all")
  const [dateRange, setDateRange] = React.useState("all")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const referenceTime = React.useMemo(
    () =>
      Math.max(...customers.map((customer) => Date.parse(customer.createdAt))),
    [customers]
  )

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const haystack =
        `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.id}`.toLowerCase()
      if (query && !haystack.includes(query)) return false
      if (status !== "all" && customer.status !== status) return false
      if (tier !== "all" && customer.kycTier !== tier) return false
      if (dateRange !== "all") {
        const cutoff = referenceTime - DATE_RANGES[dateRange] * 86_400_000
        if (Date.parse(customer.createdAt) < cutoff) return false
      }
      return true
    })
  }, [customers, search, status, tier, dateRange, referenceTime])

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

  const columns: ColumnDef<Customer>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: (customer) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarImage
              src={customer.avatarUrl}
              alt={`${customer.firstName} ${customer.lastName}`}
            />
            <AvatarFallback>
              {initials(customer.firstName, customer.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {customer.firstName} {customer.lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {customer.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "id",
      header: "Customer ID",
      cell: (customer) => (
        <code className="font-mono text-xs text-muted-foreground">
          {truncateId(customer.id, 8, 4)}
        </code>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (customer) => (
        <StatusBadge {...CUSTOMER_STATUS_CONFIG[customer.status]} />
      ),
    },
    {
      id: "tier",
      header: "KYC tier",
      cell: (customer) => (
        <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {KYC_TIER_CONFIG[customer.kycTier].label}
        </span>
      ),
    },
    {
      id: "bvn",
      header: "BVN",
      cell: (customer) =>
        customer.bvnVerified ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            Verified
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Unverified</span>
        ),
    },
    {
      id: "wallets",
      header: "Wallets",
      className: "tabular-nums",
      cell: (customer) => customer.walletCount,
    },
    {
      id: "joined",
      header: "Joined",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (customer) => formatDate(customer.createdAt),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        search={search}
        onSearchChange={resetTo(setSearch)}
        placeholder="Search by name, email, or ID"
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

        <Select items={TIER_OPTIONS} value={tier} onValueChange={resetTo(setTier)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={JOINED_OPTIONS}
          value={dateRange}
          onValueChange={resetTo(setDateRange)}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JOINED_OPTIONS.map((option) => (
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
          getRowKey={(customer) => customer.id}
          onRowClick={(customer) => router.push(`/customers/${customer.id}`)}
          loading={loading}
          page={safePage}
          pageCount={pageCount}
          totalRows={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          emptyState={
            <EmptyState
              icon={UserMultipleIcon}
              title="No customers match your filters"
              description="Try adjusting your search or clearing the filters."
            />
          }
        />
      </div>
    </div>
  )
}
