import { PageHeader } from "@/components/shared/page-header"
import { PageContainer } from "@/components/shared/page-container"
import { EmptyState } from "@/components/shared/empty-state"
import type { IconSvgElement } from "@hugeicons/react"

interface PlaceholderViewProps {
  title: string
  description: string
  icon?: IconSvgElement
}

/**
 * Temporary scaffold for routes whose full screen is built in a later phase.
 * Lets the app shell be navigated and its active states demonstrated.
 */
export function PlaceholderView({
  title,
  description,
  icon,
}: PlaceholderViewProps) {
  return (
    <PageContainer width="wide" className="flex-1">
      <PageHeader title={title} description={description} />
      <EmptyState
        fullHeight
        icon={icon}
        title="Coming up next"
        description="This screen is built in an upcoming phase of the project."
      />
    </PageContainer>
  )
}
