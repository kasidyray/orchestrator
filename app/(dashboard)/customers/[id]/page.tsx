import Link from "next/link"
import { notFound } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageContainer } from "@/components/shared/page-container"
import { CopyButton } from "@/components/shared/copy-button"
import { StatusBadge } from "@/components/shared/status-badge"
import { CustomerDetailTabs } from "@/components/features/customers/customer-detail-tabs"
import { CUSTOMER_STATUS_CONFIG } from "@/lib/constants"
import { truncateId } from "@/lib/utils"
import {
  mockCustomers,
  mockTransactions,
  mockWallets,
} from "@/lib/mock-data"

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = mockCustomers.find((item) => item.id === id)
  if (!customer) notFound()

  const wallets = mockWallets.filter((wallet) => wallet.customerId === id)
  const transactions = mockTransactions
    .filter((txn) => txn.customerId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <PageContainer width="wide">
      <Link
        href="/customers"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        Back to customers
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarImage
              src={customer.avatarUrl}
              alt={`${customer.firstName} ${customer.lastName}`}
            />
            <AvatarFallback>
              {`${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <code className="font-mono text-xs">
                {truncateId(customer.id, 8, 4)}
              </code>
              <CopyButton
                value={customer.id}
                label="Copy customer ID"
                size="icon-xs"
              />
            </div>
          </div>
        </div>
        <StatusBadge {...CUSTOMER_STATUS_CONFIG[customer.status]} />
      </div>

      <CustomerDetailTabs
        customer={customer}
        wallets={wallets}
        transactions={transactions}
      />
    </PageContainer>
  )
}
