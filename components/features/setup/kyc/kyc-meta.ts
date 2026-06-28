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
