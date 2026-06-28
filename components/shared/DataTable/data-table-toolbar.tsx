"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"

interface DataTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  /** Filter controls, typically Select dropdowns. */
  children?: React.ReactNode
}

export function DataTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search…",
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
          <HugeiconsIcon icon={Search01Icon} className="size-4" />
        </span>
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          className="pl-8.5"
        />
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}
