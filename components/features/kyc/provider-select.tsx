"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Tick01Icon } from "@hugeicons/core-free-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KYC_PROVIDER_CATALOG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { providerBadgeClass } from "./kyc-meta"

interface ProviderSelectProps {
  /** Provider ids this requirement supports, in preference order. */
  options: string[]
  value: string | null
  onChange: (providerId: string) => void
}

/** Monogram chip for a provider — soft categorical colour from the swatch palette. */
function ProviderBadge({ id, initial }: { id: string; initial: string }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-[6px] font-mono text-[11px] font-bold",
        providerBadgeClass(id)
      )}
    >
      {initial}
    </span>
  )
}

export function ProviderSelect({ options, value, onChange }: ProviderSelectProps) {
  const selected = value ? KYC_PROVIDER_CATALOG[value] : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-50 items-center gap-2 rounded-md border px-2.5 text-left transition-colors",
              selected
                ? "border-input bg-background hover:bg-muted"
                : "border-warning/40 bg-warning/10 hover:bg-warning/15"
            )}
          >
            {selected ? (
              <ProviderBadge id={selected.id} initial={selected.initial} />
            ) : null}
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px] font-semibold",
                selected ? "text-foreground" : "text-warning"
              )}
            >
              {selected ? selected.name : "Select a provider"}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                "size-3.5 shrink-0",
                selected ? "text-muted-foreground" : "text-warning"
              )}
            />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-55">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Provider</DropdownMenuLabel>
          {options.map((id) => {
            const provider = KYC_PROVIDER_CATALOG[id]
            if (!provider) return null
            const isSelected = id === value
            return (
              <DropdownMenuItem
                key={id}
                onClick={() => onChange(id)}
                className="gap-2.5"
              >
                <ProviderBadge id={provider.id} initial={provider.initial} />
                <span className="flex-1 truncate text-[13px] font-semibold text-foreground">
                  {provider.name}
                </span>
                {isSelected ? (
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    className="size-4 shrink-0 text-primary"
                  />
                ) : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
