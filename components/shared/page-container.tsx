import { cn } from "@/lib/utils"

type PageWidth = "default" | "wide" | "full"

interface PageContainerProps {
  /**
   * Max content width. The page header and body both live inside this wrapper,
   * so the title is always exactly as wide as the content beneath it.
   * - `default` — focused reading width (settings, forms).
   * - `wide` — dense tables and dashboards.
   * - `full` — edge-to-edge, no max width.
   */
  width?: PageWidth
  className?: string
  children: React.ReactNode
}

const WIDTH_CLASS: Record<PageWidth, string> = {
  default: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-none",
}

/**
 * Standard page wrapper. Centres content and constrains its width so the
 * PageHeader (title) and the page body share the same line length — the one
 * place to tune how wide a screen reads.
 */
export function PageContainer({
  width = "default",
  className,
  children,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-6",
        WIDTH_CLASS[width],
        className
      )}
    >
      {children}
    </div>
  )
}
