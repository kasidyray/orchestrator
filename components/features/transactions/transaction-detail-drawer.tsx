"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDownLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { CopyButton } from "@/components/shared/copy-button"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  TRANSACTION_STATUS_CONFIG,
  WALLET_STATUS_CONFIG,
} from "@/lib/constants"
import { cn, formatCurrency, formatDate, truncateId } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"
import type { Customer, Transaction, Wallet } from "@/lib/types"

interface TransactionDetailDrawerProps {
  transaction: Transaction | null
  customer?: Customer
  wallet?: Wallet
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TimelineStep {
  label: string
  icon: IconSvgElement
  tone: "done" | "current" | "failed"
}

function buildTimeline(transaction: Transaction): TimelineStep[] {
  const initiated: TimelineStep = {
    label: "Initiated",
    icon: CheckmarkCircle02Icon,
    tone: "done",
  }
  switch (transaction.status) {
    case "successful":
      return [
        initiated,
        { label: "Processed", icon: CheckmarkCircle02Icon, tone: "done" },
        { label: "Completed", icon: CheckmarkCircle02Icon, tone: "done" },
      ]
    case "pending":
      return [
        initiated,
        { label: "Processing", icon: Clock01Icon, tone: "current" },
        { label: "Awaiting settlement", icon: Clock01Icon, tone: "current" },
      ]
    case "failed":
      return [
        initiated,
        { label: "Failed", icon: CancelCircleIcon, tone: "failed" },
      ]
    case "reversed":
      return [
        initiated,
        { label: "Processed", icon: CheckmarkCircle02Icon, tone: "done" },
        { label: "Reversed", icon: RefreshIcon, tone: "current" },
      ]
  }
}

const TONE_CLASS: Record<TimelineStep["tone"], string> = {
  done: "bg-success/10 text-success",
  current: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-foreground">
        {children}
      </dd>
    </div>
  )
}

export function TransactionDetailDrawer({
  transaction,
  customer,
  wallet,
  open,
  onOpenChange,
}: TransactionDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Transaction details</SheetTitle>

        {transaction ? (
          <div className="flex h-full flex-col">
            <header className="flex flex-col gap-3 border-b border-border p-6">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    transaction.type === "credit"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={
                      transaction.type === "credit"
                        ? ArrowDownLeft01Icon
                        : ArrowUpRight01Icon
                    }
                    className="size-5"
                  />
                </span>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xl font-semibold tracking-tight tabular-nums",
                      transaction.type === "credit"
                        ? "text-success"
                        : "text-foreground"
                    )}
                  >
                    {transaction.type === "credit" ? "+" : "−"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {transaction.narration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  {...TRANSACTION_STATUS_CONFIG[transaction.status]}
                />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <code className="font-mono">{transaction.reference}</code>
                  <CopyButton
                    value={transaction.reference}
                    label="Copy reference"
                    size="icon-xs"
                  />
                </span>
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
              <section>
                <h3 className="mb-1 text-xs font-medium text-muted-foreground">
                  Details
                </h3>
                <dl className="divide-y divide-border">
                  <Field label="Type">
                    <span className="capitalize">{transaction.type}</span>
                  </Field>
                  <Field label="Channel">
                    <span className="capitalize">{transaction.channel}</span>
                  </Field>
                  <Field label="Fee">
                    {formatCurrency(transaction.fee, transaction.currency)}
                  </Field>
                  <Field label="Balance after">
                    {formatCurrency(
                      transaction.balanceAfter,
                      transaction.currency
                    )}
                  </Field>
                  <Field label="Date">
                    {formatDate(transaction.createdAt, { withTime: true })}
                  </Field>
                  <Field label="Transaction ID">
                    <span className="flex items-center gap-1">
                      <code className="font-mono text-xs">
                        {truncateId(transaction.id, 8, 4)}
                      </code>
                      <CopyButton
                        value={transaction.id}
                        label="Copy ID"
                        size="icon-xs"
                      />
                    </span>
                  </Field>
                </dl>
              </section>

              {transaction.counterparty ? (
                <>
                  <Separator />
                  <section>
                    <h3 className="mb-1 text-xs font-medium text-muted-foreground">
                      Counterparty
                    </h3>
                    <dl className="divide-y divide-border">
                      <Field label="Name">
                        {transaction.counterparty.name}
                      </Field>
                      {transaction.counterparty.bank ? (
                        <Field label="Bank">
                          {transaction.counterparty.bank}
                        </Field>
                      ) : null}
                      {transaction.counterparty.accountNumber ? (
                        <Field label="Account">
                          <span className="font-mono">
                            {transaction.counterparty.accountNumber}
                          </span>
                        </Field>
                      ) : null}
                    </dl>
                  </section>
                </>
              ) : null}

              <Separator />
              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Related
                </h3>
                {customer ? (
                  <Link
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <Avatar size="sm">
                      <AvatarImage
                        src={customer.avatarUrl}
                        alt={`${customer.firstName} ${customer.lastName}`}
                      />
                      <AvatarFallback>
                        {`${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase()}
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
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="ml-auto size-4 shrink-0 text-muted-foreground"
                    />
                  </Link>
                ) : null}

                {wallet ? (
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
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
                ) : null}
              </section>

              <Separator />
              <section>
                <h3 className="mb-3 text-xs font-medium text-muted-foreground">
                  Timeline
                </h3>
                <ol className="flex flex-col">
                  {buildTimeline(transaction).map((step, index, steps) => (
                    <li key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full",
                            TONE_CLASS[step.tone]
                          )}
                        >
                          <HugeiconsIcon icon={step.icon} className="size-4" />
                        </span>
                        {index < steps.length - 1 ? (
                          <span className="w-px flex-1 bg-border" />
                        ) : null}
                      </div>
                      <div className="flex flex-col pb-5">
                        <span className="text-sm font-medium text-foreground">
                          {step.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(transaction.createdAt, {
                            withTime: true,
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
