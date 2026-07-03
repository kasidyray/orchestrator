import type { SVGProps } from "react"

/**
 * Celebratory rocket — kept for future moments (empty states, launch events).
 * Full accent palette: info-blue body, warning→destructive flame, success fins,
 * confetti sparkles drifting on their own phases. Pair with `animate-float-soft`.
 */
export function CelebrationIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={88}
      height={88}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="celebrate-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" />
          <stop offset="100%" stopColor="var(--info)" />
        </linearGradient>
        <linearGradient id="celebrate-flame" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--warning)" />
          <stop offset="100%" stopColor="var(--destructive)" />
        </linearGradient>
      </defs>

      {/* Soft glow */}
      <circle cx="36" cy="30" r="18" fill="var(--chart-1)" opacity="0.22" />

      {/* Fins */}
      <path d="M28 40 L19 50 L28 48 Z" fill="var(--success)" />
      <path d="M44 40 L53 50 L44 48 Z" fill="var(--success)" />

      {/* Flame */}
      <path
        d="M30 49 C30 56 33 60 36 64 C39 60 42 56 42 49 Z"
        fill="url(#celebrate-flame)"
      />

      {/* Body */}
      <path
        d="M36 8 C44 16 45 25 45 34 L45 45 C45 49 41 51 36 51 C31 51 27 49 27 45 L27 34 C27 25 28 16 36 8 Z"
        fill="url(#celebrate-body)"
      />

      {/* Window */}
      <circle cx="36" cy="28" r="6" fill="var(--primary-foreground)" />
      <circle cx="36" cy="28" r="3" fill="var(--info)" opacity="0.8" />

      {/* Confetti sparkles — one per swatch */}
      <path
        className="animate-sparkle"
        style={{ animationDelay: "0s", animationDuration: "2.8s" }}
        d="M15 19 C15.6 21.4 16.6 22.4 19 23 C16.6 23.6 15.6 24.6 15 27 C14.4 24.6 13.4 23.6 11 23 C13.4 22.4 14.4 21.4 15 19 Z"
        fill="var(--warning)"
      />
      <path
        className="animate-sparkle"
        style={{ animationDelay: "0.7s", animationDuration: "3.4s" }}
        d="M56 13 C56.5 15 57.3 15.8 59.3 16.3 C57.3 16.8 56.5 17.6 56 19.6 C55.5 17.6 54.7 16.8 52.7 16.3 C54.7 15.8 55.5 15 56 13 Z"
        fill="var(--success)"
      />
      <path
        className="animate-sparkle"
        style={{ animationDelay: "1.3s", animationDuration: "3.1s" }}
        d="M53 33 C53.4 34.6 54 35.2 55.6 35.6 C54 36 53.4 36.6 53 38.2 C52.6 36.6 52 36 50.4 35.6 C52 35.2 52.6 34.6 53 33 Z"
        fill="var(--destructive)"
      />
      <circle
        className="animate-sparkle"
        style={{ animationDelay: "0.4s", animationDuration: "2.5s" }}
        cx="17"
        cy="38"
        r="2"
        fill="var(--info)"
      />
    </svg>
  )
}

/**
 * Onboarding hero mark — a brand-blue trail marching up a brand-blue peak to a
 * waving flag at the summit. Trail and main peak are `--primary`; the teal back
 * ridge, glowing amber moon, and red goal flag come from the swatch palette.
 */
export function SummitIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={96}
      height={96}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Moon, bobbing gently */}
      <circle
        className="animate-float-soft"
        cx="22"
        cy="24"
        r="6"
        fill="var(--swatch-3)"
        opacity="0.9"
      />

      {/* Back ridge */}
      <path
        d="M14 78 L40 42 L58 78 Z"
        fill="var(--swatch-4)"
        opacity="0.25"
      />
      {/* Main peak — brand blue */}
      <path d="M34 78 L62 30 L88 78 Z" fill="var(--primary)" opacity="0.45" />
      {/* Snow cap */}
      <path d="M56.5 39.5 L62 30 L67.5 39.5 L64 42.5 L62 40 L59.5 42.5 Z" fill="var(--card)" opacity="0.9" />

      {/* Brand-blue trail marching toward the summit */}
      <path
        className="animate-dash-march"
        d="M20 76 C34 72 42 62 50 52 C54 47 58 41 61 33"
        stroke="var(--primary)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeDasharray="1 9"
        opacity="0.9"
      />

      {/* Summit flag */}
      <line
        x1="62"
        y1="30"
        x2="62"
        y2="16"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="animate-flag-wave"
        d="M62 16 L76 19.5 L62 23 Z"
        fill="var(--swatch-6)"
      />
    </svg>
  )
}
