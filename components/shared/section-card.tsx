import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title?: string
  description?: string
  /** Header-aligned actions, typically a button or menu. */
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Labelled content card used to group a section of a page. Renders a header
 * only when a title/description/actions are supplied.
 */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  const hasHeader = Boolean(title || description || actions)

  return (
    <Card className={cn(className)}>
      {hasHeader ? (
        <CardHeader className="border-b">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {actions ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
    </Card>
  )
}
