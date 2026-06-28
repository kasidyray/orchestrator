"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { TransactionsTable } from "@/components/features/transactions/transactions-table"
import { useDataset } from "@/hooks/use-dataset"

export default function TransactionsPage() {
  const { transactions, customers, wallets } = useDataset()

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Transactions"
        description="Every credit, debit, and transfer across your wallets."
      />
      <TransactionsTable
        transactions={transactions}
        customers={customers}
        wallets={wallets}
      />
    </PageContainer>
  )
}
