import { cn } from "@/lib/utils"

interface WizardProgressBarProps {
  /** Completion percentage, 0–100. */
  value: number
  className?: string
}

/**
 * Thin top-of-flow progress indicator. The fill width eases between steps so
 * forward/back navigation reads as continuous motion.
 */
export function WizardProgressBar({ value, className }: WizardProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-border",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
