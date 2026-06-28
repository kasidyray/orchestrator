"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDataTransferHorizontalIcon,
  CheckmarkCircle02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { SectionCard } from "@/components/shared/section-card"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  CUSTOMER_STATUS_CONFIG,
  KYC_TIER_CONFIG,
  TRANSACTION_STATUS_CONFIG,
  WALLET_STATUS_CONFIG,
} from "@/lib/constants"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import type { Customer, Transaction, Wallet } from "@/lib/types"

interface CustomerDetailTabsProps {
  customer: Customer
  wallets: Wallet[]
  transactions: Transaction[]
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
        {children}
      </dd>
    </div>
  )
}

export function CustomerDetailTabs({
  customer,
  wallets,
  transactions,
}: CustomerDetailTabsProps) {
  const tier = KYC_TIER_CONFIG[customer.kycTier]

  return (
    <Tabs defaultValue="profile" className="gap-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="wallets">Wallets</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      {/* Profile */}
      <TabsContent value="profile">
        <SectionCard title="Profile">
          <dl className="divide-y divide-border">
            <Field label="Full name">
              {customer.firstName} {customer.lastName}
            </Field>
            <Field label="Email">{customer.email}</Field>
            <Field label="Phone">{customer.phone}</Field>
            <Field label="Status">
              <StatusBadge {...CUSTOMER_STATUS_CONFIG[customer.status]} />
            </Field>
            <Field label="KYC tier">{tier.label}</Field>
            <Field label="Wallets">{customer.walletCount}</Field>
            <Field label="Joined">{formatDate(customer.createdAt)}</Field>
          </dl>
        </SectionCard>
      </TabsContent>

      {/* Verification */}
      <TabsContent value="verification">
        <SectionCard
          title={`${tier.label} — ${tier.limit}`}
          description={tier.description}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  BVN verification
                </span>
                <span className="text-xs text-muted-foreground">
                  Bank Verification Number check
                </span>
              </div>
              <StatusBadge
                variant={customer.bvnVerified ? "success" : "neutral"}
                label={customer.bvnVerified ? "Verified" : "Not verified"}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Requirements for {tier.label}
              </span>
              <ul className="flex flex-col divide-y divide-border">
                {tier.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-center gap-2 py-2 text-sm text-foreground"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-4 text-success"
                    />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </TabsContent>

      {/* Wallets */}
      <TabsContent value="wallets">
        {wallets.length === 0 ? (
          <div className="rounded-xl border border-border">
            <EmptyState
              icon={Wallet01Icon}
              title="No wallets yet"
              description="This customer hasn't been provisioned a wallet."
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {wallets.map((wallet) => (
              <SectionCard key={wallet.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {wallet.productName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {wallet.currency}
                    </span>
                  </div>
                  <StatusBadge {...WALLET_STATUS_CONFIG[wallet.status]} />
                </div>
                <div className="mt-4 flex flex-col gap-0.5">
                  <span className="text-xl font-semibold tracking-tight tabular-nums">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(wallet.availableBalance, wallet.currency)}{" "}
                    available
                  </span>
                </div>
              </SectionCard>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Activity */}
      <TabsContent value="activity">
        {transactions.length === 0 ? (
          <div className="rounded-xl border border-border">
            <EmptyState
              icon={ArrowDataTransferHorizontalIcon}
              title="No activity yet"
              description="Transactions for this customer will appear here."
            />
          </div>
        ) : (
          <SectionCard title="Activity timeline">
            <ol className="flex flex-col">
              {transactions.map((txn, index) => {
                const credit = txn.type === "credit"
                const last = index === transactions.length - 1
                return (
                  <li key={txn.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "mt-1 size-2.5 shrink-0 rounded-full",
                          credit ? "bg-success" : "bg-muted-foreground"
                        )}
                      />
                      {!last ? (
                        <span className="w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium text-foreground">
                          {txn.narration}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-medium tabular-nums",
                            credit ? "text-success" : "text-foreground"
                          )}
                        >
                          {credit ? "+" : "−"}
                          {formatCurrency(txn.amount, txn.currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          {...TRANSACTION_STATUS_CONFIG[txn.status]}
                          dot={false}
                          className="h-4 px-1.5 text-[10px]"
                        />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(txn.createdAt, { withTime: true })}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </SectionCard>
        )}
      </TabsContent>
    </Tabs>
  )
}
