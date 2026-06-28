"use client"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { AuditLogTable } from "@/components/features/settings/audit-log-table"
import { useDataset } from "@/hooks/use-dataset"

export default function AuditLogsPage() {
  const { auditLogs } = useDataset()

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Audit logs"
        description="A record of every action taken across your organisation."
      />
      <AuditLogTable logs={auditLogs} />
    </PageContainer>
  )
}
