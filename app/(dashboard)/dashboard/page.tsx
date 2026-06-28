"use client"

import { PageContainer } from "@/components/shared/page-container"
import { DashboardContent } from "@/components/features/dashboard/dashboard-content"
import { useDataset } from "@/hooks/use-dataset"
import { buildTransactionSeries, cumulativeSeries } from "@/lib/dashboard-series"

export default function DashboardPage() {
  const { customers, wallets, transactions, hasSampleData } = useDataset()

  const ngnWallets = wallets.filter((wallet) => wallet.currency === "NGN")
  const aum = ngnWallets.reduce((total, wallet) => total + wallet.balance, 0)

  const recentTransactions = [...transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)

  const series = buildTransactionSeries(transactions)

  const sparks = {
    customers: cumulativeSeries(
      customers.map((customer) => ({ date: customer.createdAt, value: 1 }))
    ),
    wallets: cumulativeSeries(
      wallets.map((wallet) => ({ date: wallet.createdAt, value: 1 }))
    ),
    transactions: series.points.map((point) => point.count),
    aum: cumulativeSeries(
      ngnWallets.map((wallet) => ({
        date: wallet.createdAt,
        value: wallet.balance,
      }))
    ),
  }

  return (
    <PageContainer width="wide">
      <DashboardContent
        metrics={{
          customers: customers.length,
          wallets: wallets.length,
          transactions: transactions.length,
          aum,
        }}
        sparks={sparks}
        recentTransactions={recentTransactions}
        transactions={transactions}
        hasData={hasSampleData}
      />
    </PageContainer>
  )
}
