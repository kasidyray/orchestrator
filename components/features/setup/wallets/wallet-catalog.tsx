"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/shared/spinner"
import {
  WalletProductCard,
  type WalletProductState,
} from "@/components/features/setup/wallets/wallet-product-card"
import { WALLET_PRODUCT_CATALOG } from "@/lib/constants"

const RECOMMENDED_DEFAULT_ID = "wp_ngn_savings"

function buildInitialState(): WalletProductState[] {
  return WALLET_PRODUCT_CATALOG.map((product) => ({
    id: product.id,
    name: product.name,
    currency: product.currency,
    type: product.type,
    description: product.description,
    enabled: false,
    isDefault: false,
  }))
}

export function WalletCatalog() {
  const [products, setProducts] = React.useState<WalletProductState[]>(
    buildInitialState
  )
  const [recommendOpen, setRecommendOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const enabledCount = products.filter((product) => product.enabled).length

  function toggle(id: string, enabled: boolean) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              enabled,
              isDefault: enabled ? product.isDefault : false,
            }
          : product
      )
    )
  }

  function setDefault(id: string) {
    setProducts((prev) =>
      prev.map((product) => ({
        ...product,
        isDefault: product.id === id,
      }))
    )
    toast.success("Default wallet updated")
  }

  function rename(id: string, name: string) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, name } : product
      )
    )
    toast.success("Wallet renamed")
  }

  function applyRecommended() {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === RECOMMENDED_DEFAULT_ID
          ? { ...product, enabled: true, isDefault: true }
          : { ...product, isDefault: false }
      )
    )
    setRecommendOpen(false)
    toast.success("Recommended setup applied")
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    toast.success("Wallet configuration saved")
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{enabledCount}</span> of{" "}
          {products.length} wallet products enabled
        </p>
        <Button variant="outline" onClick={() => setRecommendOpen(true)}>
          <HugeiconsIcon icon={SparklesIcon} />
          Use recommended setup
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <WalletProductCard
            key={product.id}
            product={product}
            onToggle={(enabled) => toggle(product.id, enabled)}
            onSetDefault={() => setDefault(product.id)}
            onRename={(name) => rename(product.id, name)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner /> Saving…
            </>
          ) : (
            "Save wallet configuration"
          )}
        </Button>
      </div>

      <Dialog open={recommendOpen} onOpenChange={setRecommendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use recommended setup?</DialogTitle>
            <DialogDescription>
              This enables the NGN Savings (Main NGN) wallet and sets it as your
              default. Your other wallet settings stay as they are — you can
              change this anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button onClick={applyRecommended}>Apply recommended setup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
