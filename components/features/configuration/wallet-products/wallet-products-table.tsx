"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit03Icon,
  InformationCircleIcon,
  PiggyBankIcon,
  SecurityLockIcon,
  StarIcon,
  Target01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { Spinner } from "@/components/shared/spinner"
import {
  WalletProductEditSheet,
  type WalletProductEdit,
} from "@/components/features/configuration/wallet-products/wallet-product-edit-sheet"
import { ConfigProvenance } from "@/components/features/configuration/config-provenance"
import { useAppStore } from "@/store"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"
import type { Wallet, WalletProduct } from "@/lib/types"

/** Seed provenance so the section reads as a living config, not a blank slate. */
const SEED_LAST_CHANGED = "2024-06-24T10:12:00.000Z"

const PRODUCT_ICONS: Record<string, IconSvgElement> = {
  wp_flex_savings: PiggyBankIcon,
  wp_fixed_savings: SecurityLockIcon,
  wp_target_savings: Target01Icon,
}

/** Country flags for currency wallets, glyphs for everything else. */
const PRODUCT_FLAGS: Record<string, { code: string; label: string; abbr: string }> =
  {
    wp_ngn_wallet: { code: "ng", label: "Nigeria", abbr: "NG" },
    wp_usd_wallet: { code: "us", label: "United States", abbr: "US" },
  }

const TYPE_LABELS: Record<WalletProduct["type"], string> = {
  current: "Main",
  savings: "Savings",
  virtual: "Virtual",
  collection: "Collection",
  escrow: "Escrow",
  payout: "Payout",
}

interface WalletProductsTableProps {
  products: WalletProduct[]
  wallets: Wallet[]
}

export function WalletProductsTable({
  products,
  wallets,
}: WalletProductsTableProps) {
  const logActivity = useAppStore((state) => state.logActivity)
  const actorName = useAppStore((state) => state.currentUser?.name) ?? "You"

  const [rows, setRows] = React.useState<WalletProduct[]>(products)
  const [loading, setLoading] = React.useState(true)
  const [disableTarget, setDisableTarget] = React.useState<WalletProduct | null>(
    null
  )
  const [disabling, setDisabling] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<WalletProduct | null>(null)
  const [lastChanged, setLastChanged] = React.useState<{
    by: string
    at: string
  }>(() => ({ by: actorName, at: SEED_LAST_CHANGED }))

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  // Write to the audit trail and stamp the section's provenance line.
  function recordChange(action: string, target: string, description: string) {
    logActivity({ action, target, description })
    setLastChanged({ by: actorName, at: new Date().toISOString() })
  }

  // Existing customer wallets per product — the "impact" number behind a change.
  const walletCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const wallet of wallets) {
      if (wallet.status === "closed") continue
      counts[wallet.productId] = (counts[wallet.productId] ?? 0) + 1
    }
    return counts
  }, [wallets])

  function setActive(id: string, isActive: boolean) {
    setRows((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isActive } : product
      )
    )
  }

  function handleToggle(product: WalletProduct, next: boolean) {
    if (next) {
      setActive(product.id, true)
      recordChange(
        "wallet_product.enabled",
        product.name,
        `Enabled the ${product.name} wallet product`
      )
      toast.success(`${product.name} enabled`)
      return
    }
    // Disabling a product that still has wallets needs a consequence check.
    if ((walletCounts[product.id] ?? 0) > 0) {
      setDisableTarget(product)
      return
    }
    setActive(product.id, false)
    recordChange(
      "wallet_product.disabled",
      product.name,
      `Disabled the ${product.name} wallet product`
    )
    toast.success(`${product.name} disabled`)
  }

  async function confirmDisable() {
    if (!disableTarget) return
    setDisabling(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setActive(disableTarget.id, false)
    setDisabling(false)
    const name = disableTarget.name
    setDisableTarget(null)
    recordChange(
      "wallet_product.disabled",
      name,
      `Disabled the ${name} wallet product`
    )
    toast.success(`${name} disabled`)
  }

  function handleSaveEdit(id: string, edit: WalletProductEdit) {
    setRows((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            name: edit.name,
            description: edit.description,
            isDefault: edit.makeDefault || product.isDefault,
            isActive: edit.makeDefault ? true : product.isActive,
          }
        }
        // Only one product can be the default.
        return edit.makeDefault ? { ...product, isDefault: false } : product
      })
    )
    recordChange(
      "wallet_product.updated",
      edit.name,
      edit.makeDefault
        ? `Set ${edit.name} as the default wallet product`
        : `Updated the ${edit.name} wallet product`
    )
    toast.success(`${edit.name} updated`)
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <TableSkeleton columns={7} rows={5} />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border">
        <EmptyState
          icon={Wallet01Icon}
          title="No wallet products"
          description="Wallet products you offer will appear here, ready to enable or disable."
        />
      </div>
    )
  }

  const disableCount = disableTarget
    ? walletCounts[disableTarget.id] ?? 0
    : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-lg border border-info/20 bg-info/5 px-3.5 py-3 text-sm">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 size-4.5 shrink-0 text-info"
        />
        <p className="text-muted-foreground">
          Disabling a product stops new wallets being created under it — existing
          customer wallets keep working normally.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Wallets</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((product) => {
              const icon = PRODUCT_ICONS[product.id] ?? Wallet01Icon
              const flag = PRODUCT_FLAGS[product.id]
              const count = walletCounts[product.id] ?? 0
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <StatusBadge
                      variant={product.isActive ? "success" : "neutral"}
                      label={product.isActive ? "Enabled" : "Disabled"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          product.isActive
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
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="max-w-xs truncate text-xs text-muted-foreground">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {TYPE_LABELS[product.type]}
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {product.currency}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                        <HugeiconsIcon
                          icon={StarIcon}
                          className="size-3.5 text-warning"
                        />
                        Default
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {count > 0 ? (
                      <span className="font-medium text-foreground">{count}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditTarget(product)}
                        aria-label={`Edit ${product.name}`}
                        title="Edit product"
                      >
                        <HugeiconsIcon icon={Edit03Icon} />
                      </Button>
                      <Switch
                        checked={product.isActive}
                        disabled={product.isDefault}
                        onCheckedChange={(next) => handleToggle(product, next)}
                        aria-label={
                          product.isActive
                            ? `Disable ${product.name}`
                            : `Enable ${product.name}`
                        }
                        title={
                          product.isDefault
                            ? "Default product — always enabled"
                            : product.isActive
                              ? "Disable product"
                              : "Enable product"
                        }
                        className={cn(!product.isDefault && "cursor-pointer")}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end px-0.5">
        <ConfigProvenance by={lastChanged.by} at={lastChanged.at} />
      </div>

      {/* Disable confirmation — only shown when wallets would be affected. */}
      <Dialog
        open={Boolean(disableTarget)}
        onOpenChange={(open) => {
          if (!open) setDisableTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable {disableTarget?.name}?</DialogTitle>
            <DialogDescription>
              New wallets can’t be created under{" "}
              <span className="font-medium text-foreground">
                {disableTarget?.name}
              </span>
              . The{" "}
              <span className="font-medium text-foreground">
                {disableCount} existing{" "}
                {disableCount === 1 ? "wallet" : "wallets"}
              </span>{" "}
              keep working normally — balances, transfers, and history are
              unaffected. You can re-enable it anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button onClick={confirmDisable} disabled={disabling}>
              {disabling ? (
                <>
                  <Spinner /> Disabling…
                </>
              ) : (
                "Disable product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WalletProductEditSheet
        product={editTarget}
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
