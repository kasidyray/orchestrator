"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Edit03Icon,
  PiggyBankIcon,
  SecurityLockIcon,
  Target01Icon,
  Tick02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

export interface WalletProductState {
  id: string
  name: string
  currency: string
  type: string
  description: string
  /** Whether this wallet is offered to customers. */
  selected: boolean
  isDefault: boolean
}

const PRODUCT_ICONS: Record<string, IconSvgElement> = {
  wp_flex_savings: PiggyBankIcon,
  wp_fixed_savings: SecurityLockIcon,
  wp_target_savings: Target01Icon,
}

/** Friendlier labels for the wallet type shown under the name. */
const TYPE_LABELS: Record<string, string> = {
  current: "Main",
}

/** Currency wallets show the country flag instead of a glyph. */
const PRODUCT_FLAGS: Record<string, { code: string; label: string; abbr: string }> =
  {
    wp_ngn_wallet: { code: "ng", label: "Nigeria", abbr: "NG" },
    wp_usd_wallet: { code: "us", label: "United States", abbr: "US" },
  }

interface WalletProductCardProps {
  product: WalletProductState
  onToggleSelect: (selected: boolean) => void
  onRename: (name: string) => void
}

export function WalletProductCard({
  product,
  onToggleSelect,
  onRename,
}: WalletProductCardProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(product.name)
  const icon = PRODUCT_ICONS[product.id] ?? Wallet01Icon
  const flag = PRODUCT_FLAGS[product.id]
  const { selected, isDefault } = product

  function startEditing() {
    setDraft(product.name)
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== product.name) onRename(trimmed)
    setEditing(false)
  }

  return (
    <Card
      data-selected={selected}
      className={cn(
        "transition-colors hover:bg-muted/30",
        selected && "border-primary/40"
      )}
    >
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                selected
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {flag ? (
                <Avatar className="size-5">
                  <AvatarImage
                    src={`https://flagcdn.com/w80/${flag.code}.png`}
                    alt={flag.label}
                  />
                  <AvatarFallback className="text-[9px] font-semibold">
                    {flag.abbr}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <HugeiconsIcon icon={icon} className="size-5" />
              )}
            </span>

            <div className="flex min-w-0 flex-col gap-1">
              {editing ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commit()
                      if (event.key === "Escape") setEditing(false)
                    }}
                    autoFocus
                    className="h-7 w-44"
                    aria-label="Wallet name"
                  />
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={commit}
                    aria-label="Save name"
                  >
                    <HugeiconsIcon icon={Tick02Icon} />
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setEditing(false)}
                    aria-label="Cancel"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} />
                  </Button>
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {product.name}
                  </span>
                  {isDefault ? (
                    <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                      Default
                    </span>
                  ) : null}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                  {product.currency}
                </span>
                <span className="capitalize">
                  {TYPE_LABELS[product.type] ?? product.type}
                </span>
              </div>
            </div>
          </div>

          {/* min-h keeps the switch vertically centred whether or not Rename
              is present, so toggling on doesn't shift the switch. */}
          <div className="flex min-h-8 shrink-0 items-center gap-1.5">
            {selected && !editing ? (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={Edit03Icon} className="size-4" />
                Rename
              </button>
            ) : null}
            <Switch
              checked={selected}
              disabled={isDefault}
              onCheckedChange={onToggleSelect}
              aria-label={`Select ${product.name}`}
              title={
                isDefault
                  ? "Default wallet — always on"
                  : `Select ${product.name}`
              }
              className={cn(!isDefault && "cursor-pointer")}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
    </Card>
  )
}
