import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function CustomerDetailLoading() {
  return (
    <PageContainer width="wide">
      <Skeleton className="h-4 w-32" />

      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-md" />
        ))}
      </div>

      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3 py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex justify-between py-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
