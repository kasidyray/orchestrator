import {
  BankIcon,
  FaceIdIcon,
  File01Icon,
  IdentityCardIcon,
  MapPinIcon,
  SecurityCheckIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/** Icon shown for each requirement, keyed by catalog id. */
export const REQUIREMENT_ICONS: Record<string, IconSvgElement> = {
  phone: SmartPhone01Icon,
  bvn: BankIcon,
  nin: IdentityCardIcon,
  id_doc: File01Icon,
  liveness: FaceIdIcon,
  address: MapPinIcon,
}

export function requirementIcon(id: string): IconSvgElement {
  return REQUIREMENT_ICONS[id] ?? SecurityCheckIcon
}

/** Compact labels used on tier summary chips. */
export const REQUIREMENT_SHORT_LABELS: Record<string, string> = {
  phone: "Phone",
  bvn: "BVN",
  nin: "NIN",
  id_doc: "Gov ID",
  liveness: "Liveness",
  address: "Address",
}

export function requirementShortLabel(id: string): string {
  return REQUIREMENT_SHORT_LABELS[id] ?? id
}

/**
 * Soft, categorical colour per provider for monogram chips. Static class
 * strings (Tailwind needs to see them literally) drawn from the swatch palette.
 */
export const PROVIDER_BADGE_CLASS: Record<string, string> = {
  termii: "bg-swatch-1/20 text-swatch-1",
  smileid: "bg-swatch-4/20 text-swatch-4",
  dojah: "bg-swatch-3/20 text-swatch-3",
  mono: "bg-swatch-2/20 text-swatch-2",
  prembly: "bg-swatch-5/20 text-swatch-5",
  qoreid: "bg-swatch-6/20 text-swatch-6",
  metamap: "bg-swatch-2/20 text-swatch-2",
  verifyme: "bg-swatch-6/20 text-swatch-6",
  youverify: "bg-swatch-5/20 text-swatch-5",
  // Neutral, deliberately distinct from the vendor swatches.
  custom: "bg-foreground/10 text-foreground",
}

export function providerBadgeClass(id: string | null | undefined): string {
  return (id && PROVIDER_BADGE_CLASS[id]) || "bg-muted text-muted-foreground"
}
