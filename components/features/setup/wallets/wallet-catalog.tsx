"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/shared/spinner"
import {
  WalletProductCard,
  type WalletProductState,
} from "@/components/features/setup/wallets/wallet-product-card"
import { WALLET_PRODUCT_CATALOG } from "@/lib/constants"
import { useAppStore } from "@/store"

function buildInitialState(): WalletProductState[] {
  return WALLET_PRODUCT_CATALOG.map((product) => ({
    id: product.id,
    name: product.name,
    currency: product.currency,
    type: product.type,
    description: product.description,
    // The Naira wallet is the default: always on and not user-changeable.
    selected: product.isDefault,
    isDefault: product.isDefault,
  }))
}

export function WalletCatalog() {
  const router = useRouter()
  const setSetupStep = useAppStore((state) => state.setSetupStep)
  const [products, setProducts] = React.useState<WalletProductState[]>(
    buildInitialState
  )
  const [saving, setSaving] = React.useState(false)

  const selectedCount = products.filter((product) => product.selected).length

  function toggleSelect(id: string, selected: boolean) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              selected,
              isDefault: selected ? product.isDefault : false,
            }
          : product
      )
    )
  }

  function rename(id: string, name: string) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, name } : product
      )
    )
    toast.success("Wallet renamed")
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSetupStep("wallets", true)
    toast.success("Wallet configuration saved")
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-lg border border-info/20 bg-info/5 px-3.5 py-3 text-sm">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 size-4.5 shrink-0 text-info"
        />
        <p className="text-muted-foreground">
          Nothing here is locked in — you can add, remove, rename, or
          reconfigure wallets anytime from Settings after setup.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <WalletProductCard
            key={product.id}
            product={product}
            onToggleSelect={(selected) => toggleSelect(product.id, selected)}
            onRename={(name) => rename(product.id, name)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedCount}</span> of{" "}
          {products.length} wallet products selected
        </p>
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
    </div>
  )
}
