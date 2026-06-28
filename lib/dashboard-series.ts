import type { Transaction } from "@/lib/types"

export interface DailyPoint {
  /** ISO date (start of day) — used as the chart key. */
  date: string
  /** Short axis/tooltip label, e.g. "20 Jun". */
  label: string
  /** Total value moved that day. */
  volume: number
  /** Number of transactions that day. */
  count: number
}

export interface TransactionSeries {
  points: DailyPoint[]
  /** Total volume across the current window. */
  total: number
  /** Total transaction count across the current window. */
  count: number
  /** Volume across the preceding window of the same length. */
  previousTotal: number
  /** Percentage change vs the previous window (0 when there's nothing to compare). */
  deltaPct: number
}

const WINDOW_DAYS = 30
const DAY_MS = 86_400_000

function dayKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

function shortLabel(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(ms))
}

/**
 * Builds a 30-day daily volume/count series from transactions, anchored to the
 * latest transaction date (deterministic — no reliance on the current clock, so
 * it's hydration-safe). Also returns the window total and the change vs the
 * preceding 30 days. With no transactions it returns a flat zero series.
 */
export function buildTransactionSeries(
  transactions: Transaction[]
): TransactionSeries {
  const empty: DailyPoint[] = Array.from({ length: WINDOW_DAYS }, (_, index) => ({
    date: String(index),
    label: "",
    volume: 0,
    count: 0,
  }))

  if (transactions.length === 0) {
    return { points: empty, total: 0, count: 0, previousTotal: 0, deltaPct: 0 }
  }

  const anchor = Math.max(
    ...transactions.map((txn) => Date.parse(txn.createdAt))
  )
  // Start of the day WINDOW_DAYS-1 before the anchor day.
  const anchorDayStart = Date.parse(`${dayKey(anchor)}T00:00:00.000Z`)
  const windowStart = anchorDayStart - (WINDOW_DAYS - 1) * DAY_MS
  const previousStart = windowStart - WINDOW_DAYS * DAY_MS

  const points: DailyPoint[] = Array.from({ length: WINDOW_DAYS }, (_, index) => {
    const ms = windowStart + index * DAY_MS
    return { date: dayKey(ms), label: shortLabel(ms), volume: 0, count: 0 }
  })
  const indexByDate = new Map(points.map((point, index) => [point.date, index]))

  let previousTotal = 0
  for (const txn of transactions) {
    const ms = Date.parse(txn.createdAt)
    if (ms >= windowStart) {
      const index = indexByDate.get(dayKey(ms))
      if (index !== undefined) {
        points[index].volume += txn.amount
        points[index].count += 1
      }
    } else if (ms >= previousStart) {
      previousTotal += txn.amount
    }
  }

  const total = points.reduce((sum, point) => sum + point.volume, 0)
  const count = points.reduce((sum, point) => sum + point.count, 0)
  const deltaPct =
    previousTotal > 0
      ? ((total - previousTotal) / previousTotal) * 100
      : 0

  return { points, total, count, previousTotal, deltaPct }
}

/**
 * Builds a small cumulative (running-total) sparkline from dated events across
 * their full span — e.g. customers or wallets accumulating over time, or wallet
 * balances summing into AUM. Returns a flat zero series when there's nothing.
 */
export function cumulativeSeries(
  items: { date: string; value: number }[],
  points = 24
): number[] {
  if (items.length === 0) {
    return Array.from({ length: points }, () => 0)
  }

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date))
  const start = Date.parse(sorted[0].date)
  const end = Date.parse(sorted[sorted.length - 1].date)
  const span = Math.max(end - start, 1)

  const buckets = Array.from({ length: points }, () => 0)
  for (const item of sorted) {
    const ratio = (Date.parse(item.date) - start) / span
    const index = Math.min(
      points - 1,
      Math.max(0, Math.round(ratio * (points - 1)))
    )
    buckets[index] += item.value
  }

  let running = 0
  return buckets.map((bucket) => (running += bucket))
}

/* -------------------------------------------------------------------------- */
/*  Range-filtered volume series (stock-chart style)                            */
/* -------------------------------------------------------------------------- */

const HOUR_MS = 3_600_000

export type RangeKey = "24H" | "1W" | "1M" | "1Y" | "ALL"

/** Selectable ranges for the volume chart, in display order. */
export const VOLUME_RANGES: { key: RangeKey; label: string }[] = [
  { key: "24H", label: "24h" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "1Y", label: "1Y" },
  { key: "ALL", label: "All" },
]

function floorTo(ms: number, size: number): number {
  return Math.floor(ms / size) * size
}

function rangeLabel(ms: number, range: RangeKey): string {
  const date = new Date(ms)
  if (range === "24H") {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date)
}

/**
 * Builds a volume/count series for the selected range, anchored to the latest
 * transaction (deterministic → hydration-safe). 24h uses hourly buckets, 1W/1M
 * daily, and 1Y/All weekly. `deltaPct` compares the window to the one before it.
 */
export function buildVolumeSeries(
  transactions: Transaction[],
  range: RangeKey
): TransactionSeries {
  const events = transactions.map((txn) => ({
    ms: Date.parse(txn.createdAt),
    amount: txn.amount,
  }))

  if (events.length === 0) {
    const size = range === "24H" ? 24 : range === "1W" ? 7 : 30
    const points: DailyPoint[] = Array.from({ length: size }, (_, index) => ({
      date: String(index),
      label: "",
      volume: 0,
      count: 0,
    }))
    return { points, total: 0, count: 0, previousTotal: 0, deltaPct: 0 }
  }

  const anchor = Math.max(...events.map((event) => event.ms))
  const earliest = Math.min(...events.map((event) => event.ms))

  let bucketMs: number
  let buckets: number
  let start: number

  if (range === "24H") {
    bucketMs = HOUR_MS
    buckets = 24
    start = floorTo(anchor, HOUR_MS) - (buckets - 1) * HOUR_MS
  } else if (range === "1W" || range === "1M") {
    bucketMs = DAY_MS
    buckets = range === "1W" ? 7 : 30
    start = floorTo(anchor, DAY_MS) - (buckets - 1) * DAY_MS
  } else {
    bucketMs = 7 * DAY_MS
    const anchorDay = floorTo(anchor, DAY_MS)
    const earliestDay = floorTo(earliest, DAY_MS)
    const windowStart =
      range === "1Y" ? Math.max(earliestDay, anchorDay - 364 * DAY_MS) : earliestDay
    buckets = Math.max(1, Math.ceil((anchorDay - windowStart) / (7 * DAY_MS)) + 1)
    start = anchorDay - (buckets - 1) * 7 * DAY_MS
  }

  const points: DailyPoint[] = Array.from({ length: buckets }, (_, index) => {
    const ms = start + index * bucketMs
    return { date: String(ms), label: rangeLabel(ms, range), volume: 0, count: 0 }
  })

  let previousTotal = 0
  const windowLength = buckets * bucketMs
  const previousStart = start - windowLength

  for (const event of events) {
    if (event.ms >= start && event.ms <= anchor) {
      const index = Math.min(
        buckets - 1,
        Math.max(0, Math.floor((event.ms - start) / bucketMs))
      )
      points[index].volume += event.amount
      points[index].count += 1
    } else if (event.ms >= previousStart && event.ms < start) {
      previousTotal += event.amount
    }
  }

  const total = points.reduce((sum, point) => sum + point.volume, 0)
  const count = points.reduce((sum, point) => sum + point.count, 0)
  const deltaPct =
    previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0

  return { points, total, count, previousTotal, deltaPct }
}
