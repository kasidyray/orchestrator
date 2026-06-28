import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  /** Number of body lines to render. Defaults to 3. */
  rows?: number
  className?: string
}

/**
 * Card-shaped loading placeholder. Mirrors the header + stacked-line layout of
 * a populated SectionCard so the loading state matches real content density.
 */
export function SkeletonCard({ rows = 3, className }: SkeletonCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-3.5", index === rows - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </CardContent>
    </Card>
  )
}
