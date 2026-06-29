import type { SVGProps } from "react"

/**
 * Small on-brand illustrations for the auth value panel.
 * Built entirely from `globals.css` chart tokens (blues) + foreground tokens —
 * no raw palette. Each uses an offset back-shape for depth, echoing the
 * layered look of modern fintech onboarding art.
 */

type IllustrationProps = SVGProps<SVGSVGElement>

const BASE_PROPS = {
  width: 56,
  height: 56,
  viewBox: "0 0 56 56",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
} as const

/** Bank-grade compliance — a shield with a check. */
export function ComplianceIllustration(props: IllustrationProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <defs>
        <linearGradient id="ill-compliance" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" />
          <stop offset="100%" stopColor="var(--chart-4)" />
        </linearGradient>
      </defs>
      <path
        d="M33 7 L47 12 V25 C47 35 41 42 33 45 C32 45 32 45 31 45 L31 7 Z"
        fill="var(--chart-1)"
        opacity="0.35"
      />
      <path
        d="M28 7 L43 12.5 V25.5 C43 35.5 36.5 43 28 46 C19.5 43 13 35.5 13 25.5 V12.5 Z"
        fill="url(#ill-compliance)"
      />
      <path
        d="M21.5 26.5 L26 31 L35 21"
        stroke="var(--primary-foreground)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Wallets and savings — two stacked cards. */
export function WalletsIllustration(props: IllustrationProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <defs>
        <linearGradient id="ill-wallets" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-3)" />
          <stop offset="100%" stopColor="var(--chart-1)" />
        </linearGradient>
      </defs>
      <rect
        x="14"
        y="11"
        width="32"
        height="21"
        rx="4"
        fill="var(--chart-1)"
        opacity="0.4"
      />
      <rect x="8" y="20" width="36" height="24" rx="4.5" fill="url(#ill-wallets)" />
      <rect
        x="13"
        y="26"
        width="8"
        height="6"
        rx="1.5"
        fill="var(--primary-foreground)"
        opacity="0.9"
      />
      <rect
        x="13"
        y="36"
        width="22"
        height="3"
        rx="1.5"
        fill="var(--primary-foreground)"
        opacity="0.5"
      />
    </svg>
  )
}

/** Unified payments — a terminal screen with a cursor. */
export function PaymentsIllustration(props: IllustrationProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <defs>
        <linearGradient id="ill-payments" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-4)" />
          <stop offset="100%" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>
      <rect
        x="18"
        y="9"
        width="26"
        height="34"
        rx="5"
        fill="var(--chart-1)"
        opacity="0.4"
      />
      <rect x="11" y="11" width="26" height="34" rx="5" fill="url(#ill-payments)" />
      <rect
        x="16"
        y="17"
        width="16"
        height="3.5"
        rx="1.75"
        fill="var(--primary-foreground)"
        opacity="0.85"
      />
      <rect
        x="16"
        y="24"
        width="10"
        height="3.5"
        rx="1.75"
        fill="var(--primary-foreground)"
        opacity="0.5"
      />
      <path
        d="M30 31 L42 36 L37 38 L40 44 L37 45.5 L34 39.5 L30 43 Z"
        fill="var(--foreground)"
        stroke="var(--primary-foreground)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Embedded finance — stacked layers. */
export function EmbeddedIllustration(props: IllustrationProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <defs>
        <linearGradient id="ill-embedded" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" />
          <stop offset="100%" stopColor="var(--chart-4)" />
        </linearGradient>
      </defs>
      <path
        d="M28 33 L46 41 L28 49 L10 41 Z"
        fill="var(--chart-1)"
        opacity="0.4"
      />
      <path
        d="M28 24 L46 32 L28 40 L10 32 Z"
        fill="var(--chart-3)"
        opacity="0.6"
      />
      <path d="M28 15 L46 23 L28 31 L10 23 Z" fill="url(#ill-embedded)" />
    </svg>
  )
}
