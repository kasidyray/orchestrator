"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"

import { CountUp } from "@/components/features/dashboard/count-up"
import { cn } from "@/lib/utils"

export interface MetricStatData {
  key: string
  label: string
  value: number
  format: "number" | "currency"
  /** Signed percentage change vs. the previous period. */
  trendPct: number
  /** Values for the cell's sparkline. */
  spark: number[]
}

function formatNumber(value: number) {
  return Math.round(value).toLocaleString("en-NG")
}

function formatNaira(value: number) {
  return `₦${Math.round(value).toLocaleString("en-NG")}`
}

function Sparkline({ data }: { data: number[] }) {
  const points = data.map((value, index) => ({ index, value }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={points} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={1.75}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/**
 * A single Lemon Squeezy-style stat: label, large mono value, change vs. the
 * previous period, and a sparkline. Designed to sit in a divider-separated grid
 * (no individual card border).
 */
export function MetricStat({ metric }: { metric: MetricStatData }) {
  const neutral = metric.trendPct === 0
  const positive = metric.trendPct > 0
  const format = metric.format === "currency" ? formatNaira : formatNumber

  return (
    <div className="flex flex-col gap-3 p-5">
      <span className="text-sm font-medium text-muted-foreground">
        {metric.label}
      </span>

      <p className="font-mono text-[26px] leading-none font-bold tracking-tight tabular-nums">
        <CountUp value={metric.value} format={format} />
      </p>

      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-medium",
            neutral
              ? "text-muted-foreground"
              : positive
                ? "text-success"
                : "text-destructive"
          )}
        >
          {neutral ? null : (
            <HugeiconsIcon
              icon={positive ? ArrowUpRight01Icon : ArrowDownRight01Icon}
              className="size-3.5"
            />
          )}
          {Math.abs(metric.trendPct).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>

      <div className="mt-1 h-10 w-full">
        <Sparkline data={metric.spark} />
      </div>
    </div>
  )
}
