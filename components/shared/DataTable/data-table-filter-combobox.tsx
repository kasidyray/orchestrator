"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

interface DataTableFilterComboboxProps {
  options: FilterOption[]
  value: string
  onValueChange: (value: string | null) => void
  /** Placeholder for the search input inside the popup. */
  searchPlaceholder?: string
  className?: string
}

/**
 * A toolbar filter that looks like a Select trigger but opens a searchable
 * list. Use instead of a plain Select when a filter has many options
 * (rule of thumb: 8+), e.g. products, team members.
 */
export function DataTableFilterCombobox({
  options,
  value,
  onValueChange,
  searchPlaceholder = "Search…",
  className,
}: DataTableFilterComboboxProps) {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option: FilterOption | null) =>
        onValueChange(option?.value ?? null)
      }
      itemToStringLabel={(option: FilterOption) => option.label}
      isItemEqualToValue={(a: FilterOption, b: FilterOption) =>
        a?.value === b?.value
      }
    >
      <ComboboxTrigger
        className={cn(
          "flex h-8 w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50",
          className
        )}
      >
        <ComboboxValue>
          {(option: FilterOption | null) => option?.label ?? "Filter"}
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent className="min-w-48">
        <ComboboxInput
          placeholder={searchPlaceholder}
          showTrigger={false}
        />
        <ComboboxEmpty>No matching options</ComboboxEmpty>
        <ComboboxList>
          {(option: FilterOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
