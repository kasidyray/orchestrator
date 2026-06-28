import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { DeveloperTabs } from "@/components/features/developer/developer-tabs"

export default function DeveloperPage() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="Developer"
        description="Everything you need to integrate with the Optimus API."
      />
      <DeveloperTabs />
    </PageContainer>
  )
}
