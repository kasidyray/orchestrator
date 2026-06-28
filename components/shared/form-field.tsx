import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  /** Helper text shown below the control when there is no error. */
  hint?: string
  /** Validation message; replaces the hint and is styled as destructive. */
  error?: string
  /** Marks the field as optional with a subtle label suffix. */
  optional?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Stacked form field — label above the control, with a single slot below for an
 * error or hint. The one place field spacing and validation copy are styled, so
 * every form reads the same.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="justify-between">
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            Optional
          </span>
        ) : null}
      </Label>

      {children}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
