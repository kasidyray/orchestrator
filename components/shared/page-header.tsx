import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  /** Right-aligned actions, typically buttons. */
  actions?: React.ReactNode
  className?: string
}

/** Consistent page title block: heading, optional subtitle, and actions. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
