"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { CustomersTable } from "@/components/features/customers/customers-table"
import { useDataset } from "@/hooks/use-dataset"

export default function CustomersPage() {
  const { customers } = useDataset()

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Customers"
        description="Browse, search, and manage the customers on your platform."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} />
            Add customer
          </Button>
        }
      />
      <CustomersTable customers={customers} />
    </PageContainer>
  )
}
