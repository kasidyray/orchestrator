"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BankIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  DollarCircleIcon,
  InboxDownloadIcon,
  Layers01Icon,
  MoneySend01Icon,
  PencilEdit02Icon,
  PiggyBankIcon,
  SecurityLockIcon,
  Tick02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
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
  enabled: boolean
  isDefault: boolean
}

const PRODUCT_ICONS: Record<string, IconSvgElement> = {
  wp_ngn_savings: PiggyBankIcon,
  wp_ngn_current: Wallet01Icon,
  wp_virtual_nuban: BankIcon,
  wp_collection: InboxDownloadIcon,
  wp_usd_wallet: DollarCircleIcon,
  wp_escrow: SecurityLockIcon,
  wp_sub_wallet: Layers01Icon,
  wp_payout: MoneySend01Icon,
}

interface WalletProductCardProps {
  product: WalletProductState
  onToggle: (enabled: boolean) => void
  onSetDefault: () => void
  onRename: (name: string) => void
}

export function WalletProductCard({
  product,
  onToggle,
  onSetDefault,
  onRename,
}: WalletProductCardProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(product.name)
  const icon = PRODUCT_ICONS[product.id] ?? Wallet01Icon

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
    <Card className={cn("transition-opacity", !product.enabled && "opacity-70")}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                product.enabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <HugeiconsIcon icon={icon} className="size-5" />
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
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-foreground">
                    {product.name}
                  </span>
                  <button
                    type="button"
                    onClick={startEditing}
                    aria-label={`Rename ${product.name}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <HugeiconsIcon
                      icon={PencilEdit02Icon}
                      className="size-3.5"
                    />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                  {product.currency}
                </span>
                <span className="capitalize">{product.type}</span>
              </div>
            </div>
          </div>

          <Switch
            checked={product.enabled}
            onCheckedChange={onToggle}
            aria-label={`Enable ${product.name}`}
          />
        </div>

        <p className="text-sm text-muted-foreground">{product.description}</p>

        <div className="flex min-h-8 items-center border-t border-border pt-3">
          {!product.enabled ? (
            <span className="text-xs text-muted-foreground">
              Enable to make this wallet available.
            </span>
          ) : product.isDefault ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-4"
              />
              Default wallet
            </span>
          ) : (
            <button
              type="button"
              onClick={onSetDefault}
              className="group/default inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex size-4 items-center justify-center rounded-full border border-input transition-colors group-hover/default:border-primary">
                <span className="size-1.5 rounded-full bg-transparent" />
              </span>
              Set as default
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
