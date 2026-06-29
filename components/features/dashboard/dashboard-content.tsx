"use client"

import * as React from "react"

import { PageHeader } from "@/components/shared/page-header"
import {
  MetricStat,
  type MetricStatData,
} from "@/components/features/dashboard/metric-stat"
import { RecentActivity } from "@/components/features/dashboard/recent-activity"
import { SetupChecklist } from "@/components/features/dashboard/setup-checklist"
import { GoLiveHero } from "@/components/features/dashboard/go-live-hero"
import { VolumeChartCard } from "@/components/features/dashboard/volume-chart-card"
import { DashboardSkeleton } from "@/components/features/dashboard/dashboard-skeleton"
import { useSession } from "@/hooks/use-session"
import { useSetupProgress } from "@/hooks/use-setup-progress"
import type { Transaction } from "@/lib/types"

export interface DashboardMetrics {
  customers: number
  wallets: number
  transactions: number
  aum: number
}

export interface DashboardSparks {
  customers: number[]
  wallets: number[]
  transactions: number[]
  aum: number[]
}

interface DashboardContentProps {
  metrics: DashboardMetrics
  sparks: DashboardSparks
  recentTransactions: Transaction[]
  /** Full transaction list, powering the range-filtered volume chart. */
  transactions: Transaction[]
  /** False for a brand-new business with no activity yet. */
  hasData: boolean
}

export function DashboardContent({
  metrics,
  sparks,
  recentTransactions,
  transactions,
  hasData,
}: DashboardContentProps) {
  const { user, org } = useSession()
  const { allComplete } = useSetupProgress()
  const firstName = user?.name.split(" ")[0] ?? "there"
  const orgName = org?.name ?? "your business"
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const stats: MetricStatData[] = [
    {
      key: "customers",
      label: "Total customers",
      value: metrics.customers,
      format: "number",
      trendPct: hasData ? 12.4 : 0,
      spark: sparks.customers,
    },
    {
      key: "wallets",
      label: "Active wallets",
      value: metrics.wallets,
      format: "number",
      trendPct: hasData ? 8.1 : 0,
      spark: sparks.wallets,
    },
    {
      key: "transactions",
      label: "Transactions (30d)",
      value: metrics.transactions,
      format: "number",
      trendPct: hasData ? 23.6 : 0,
      spark: sparks.transactions,
    },
    {
      key: "aum",
      label: "Assets under mgmt",
      value: metrics.aum,
      format: "currency",
      trendPct: hasData ? 5.2 : 0,
      spark: sparks.aum,
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardSkeleton variant={allComplete ? "full" : "onboarding"} />
      </div>
    )
  }

  if (!allComplete) {
    return <SetupChecklist />
  }

  return (
    <div className="flex flex-col gap-8">
      <GoLiveHero />

      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={`Here's what's happening with ${orgName} today.`}
      />

      <VolumeChartCard transactions={transactions} />

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-y border-border lg:grid-cols-4 lg:divide-y-0 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0">
        {stats.map((stat) => (
          <MetricStat key={stat.key} metric={stat} />
        ))}
      </div>

      <RecentActivity transactions={recentTransactions} />
    </div>
  )
}
