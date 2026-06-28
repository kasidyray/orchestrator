"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"

import { cn, formatCurrency } from "@/lib/utils"
import {
  buildVolumeSeries,
  VOLUME_RANGES,
  type RangeKey,
} from "@/lib/dashboard-series"
import type { Transaction } from "@/lib/types"

interface TooltipPayloadItem {
  payload: { label: string; volume: number }
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-muted-foreground">{point.label}</p>
      <p className="mt-0.5 font-mono font-semibold text-foreground tabular-nums">
        {formatCurrency(point.volume, "NGN")}
      </p>
    </div>
  )
}

export function VolumeChartCard({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const [range, setRange] = React.useState<RangeKey>("1M")

  const series = React.useMemo(
    () => buildVolumeSeries(transactions, range),
    [transactions, range]
  )

  const neutral = series.deltaPct === 0
  const positive = series.deltaPct > 0

  const firstLabel = series.points.find((point) => point.label)?.label
  const lastLabel = [...series.points].reverse().find((point) => point.label)
    ?.label

  return (
    <section className="border-t border-border pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Transaction volume
          </p>
          <p className="mt-1.5 font-mono text-[30px] leading-none font-bold tracking-tight tabular-nums">
            {formatCurrency(series.total, "NGN")}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
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
              {Math.abs(series.deltaPct).toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs previous period</span>
          </div>
        </div>

        <div
          role="group"
          aria-label="Select chart period"
          className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5"
        >
          {VOLUME_RANGES.map((option) => {
            const active = option.key === range
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={active}
                onClick={() => setRange(option.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors",
                  active
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series.points}
            margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volume-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis dataKey="label" hide />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={<ChartTooltip />}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#volume-fill)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{firstLabel}</span>
        <span>{lastLabel}</span>
      </div>
    </section>
  )
}
