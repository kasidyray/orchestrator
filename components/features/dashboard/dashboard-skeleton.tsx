import { Skeleton } from "@/components/ui/skeleton"

function MetricStatSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-1 h-10 w-full" />
    </div>
  )
}

function StepRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-3 py-4">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-44" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0 rounded-md" />
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="ml-auto h-3.5 w-28" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-3.5 w-28" />
    </div>
  )
}

function ChecklistSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl pt-2 sm:pt-8">
      <div className="flex flex-col items-center gap-2.5">
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="mt-8 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <StepRowSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

/**
 * Loading state mirroring the dashboard's two shapes: the onboarding checklist
 * (new business) or the full stats view (chart + metric grid + activity table).
 */
export function DashboardSkeleton({
  variant = "full",
}: {
  variant?: "onboarding" | "full"
}) {
  if (variant === "onboarding") {
    return <ChecklistSkeleton />
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="border-t border-border pt-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="mt-5 h-[220px] w-full rounded-lg" />
      </section>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-y border-border lg:grid-cols-4 lg:divide-y-0 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricStatSkeleton key={index} />
        ))}
      </div>

      <section>
        <div className="flex flex-col gap-2 py-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
