import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { WalletCurrency } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an amount as currency. Naira renders with the ₦ symbol and comma
 * grouping (e.g. ₦1,250,000.00); USD uses $. Locale is pinned to avoid SSR/CSR
 * hydration drift.
 */
export function formatCurrency(
  amount: number,
  currency: WalletCurrency = "NGN"
): string {
  const symbol = currency === "NGN" ? "₦" : "$"
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${symbol}${formatted}`
}

/**
 * Formats an ISO date string as "12 Jun 2024", or "12 Jun 2024, 14:30" when
 * `withTime` is set. Locale pinned to en-GB for stable day-month-year ordering.
 */
export function formatDate(
  iso: string,
  options: { withTime?: boolean } = {}
): string {
  const date = new Date(iso)
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)

  if (!options.withTime) return datePart

  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)

  return `${datePart}, ${timePart}`
}

/**
 * Truncates a long identifier for display, preserving a readable prefix and
 * suffix (e.g. "cus_xk29ab7f93" -> "cus_xk...f93").
 */
export function truncateId(id: string, head = 6, tail = 3): string {
  if (id.length <= head + tail + 1) return id
  return `${id.slice(0, head)}...${id.slice(-tail)}`
}

/**
 * Compact naira for dense labels (e.g. ₦50k, ₦5M, ₦0). Drops decimals when
 * whole, keeps one place otherwise. Use formatCurrency for precise amounts.
 */
export function formatNairaShort(amount: number): string {
  if (!amount) return "₦0"
  if (amount >= 1_000_000) {
    const value = amount / 1_000_000
    return `₦${value % 1 === 0 ? value : value.toFixed(1)}M`
  }
  if (amount >= 1_000) {
    const value = amount / 1_000
    return `₦${value % 1 === 0 ? value : value.toFixed(1)}k`
  }
  return `₦${amount}`
}

/** Groups a number with thousands separators for input display (e.g. 50,000). */
export function formatThousands(amount: number): string {
  return amount ? amount.toLocaleString("en-US") : ""
}

/** Parses a user-typed amount, stripping everything but digits. */
export function parseAmount(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

/** Formats a byte count for display (e.g. 1.4 MB, 320 KB). */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Copies text to the clipboard, returning whether it succeeded. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
