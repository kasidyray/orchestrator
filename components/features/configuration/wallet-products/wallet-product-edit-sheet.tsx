"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/shared/spinner"
import type { WalletProduct } from "@/lib/types"

export interface WalletProductEdit {
  name: string
  description: string
  makeDefault: boolean
}

interface WalletProductEditSheetProps {
  product: WalletProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, edit: WalletProductEdit) => void
}

/**
 * Edit a wallet product's name, description, and default status. Setting a
 * product as default also enables it (the default must always be offered).
 */
export function WalletProductEditSheet({
  product,
  open,
  onOpenChange,
  onSave,
}: WalletProductEditSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit wallet product</SheetTitle>
          <SheetDescription>
            Changes apply to new wallets created under this product. Existing
            wallets are unaffected.
          </SheetDescription>
        </SheetHeader>
        {/* Keyed so the draft reseeds whenever a different product opens. */}
        {product ? (
          <EditForm
            key={product.id}
            product={product}
            onSave={onSave}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function EditForm({
  product,
  onSave,
  onDone,
}: {
  product: WalletProduct
  onSave: (id: string, edit: WalletProductEdit) => void
  onDone: () => void
}) {
  const [name, setName] = React.useState(product.name)
  const [description, setDescription] = React.useState(product.description)
  const [makeDefault, setMakeDefault] = React.useState(product.isDefault)
  const [saving, setSaving] = React.useState(false)

  const alreadyDefault = product.isDefault

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    onSave(product.id, {
      name: name.trim() || product.name,
      description: description.trim() || product.description,
      makeDefault,
    })
    onDone()
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 px-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="wp-name">Name</Label>
          <Input
            id="wp-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Wallet product name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="wp-description">Description</Label>
          <Textarea
            id="wp-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What this product is for"
          />
          <p className="text-xs text-muted-foreground">
            Shown to your team and on customer-facing wallet labels.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-3.5 py-3">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="wp-default" className="text-sm font-medium">
              Set as default product
            </Label>
            <p className="text-xs text-muted-foreground">
              {alreadyDefault
                ? "This is your default. Set another product as default to move it."
                : "New customers get this wallet first. Enables the product if it’s off."}
            </p>
          </div>
          <Switch
            id="wp-default"
            checked={makeDefault}
            disabled={alreadyDefault}
            onCheckedChange={setMakeDefault}
            aria-label="Set as default product"
            className={!alreadyDefault ? "cursor-pointer" : undefined}
          />
        </div>
      </div>

      <SheetFooter className="flex-row justify-end">
        <SheetClose render={<Button variant="outline">Cancel</Button>} />
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner /> Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </SheetFooter>
    </>
  )
}
