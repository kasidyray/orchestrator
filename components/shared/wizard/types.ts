import type { IconSvgElement } from "@hugeicons/react"

/** A single stage in a multi-step wizard flow. */
export interface WizardStep {
  id: string
  label: string
  /** Optional glyph shown in the step rail; falls back to the step number. */
  icon?: IconSvgElement
}
