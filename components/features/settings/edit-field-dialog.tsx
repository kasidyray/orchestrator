"use client"

import * as React from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/shared/spinner"

export interface EditableField<K extends string = string> {
  key: K
  label: string
  /** Optional supporting copy shown under the label on the settings row. */
  description?: string
  type: "text" | "email" | "select"
  /** Required when `type` is `"select"`. */
  options?: readonly string[]
  placeholder?: string
}

/**
 * Single reusable modal that edits one settings field at a time. Open it by
 * passing a `field`; pass `null` to close. The draft resets each time a
 * different field opens, mirroring the mock save → toast pattern used across
 * the app.
 */
export function EditFieldDialog<K extends string>({
  field,
  currentValue,
  scopeNote = "This change applies across your profile.",
  onClose,
  onSaved,
}: {
  field: EditableField<K> | null
  currentValue: string
  /** Supporting line shown under the dialog title. */
  scopeNote?: string
  onClose: () => void
  onSaved: (key: K, value: string) => void
}) {
  const [value, setValue] = React.useState(currentValue)
  const [saving, setSaving] = React.useState(false)

  // Reset the draft whenever a different field is opened.
  React.useEffect(() => {
    if (field) {
      setValue(currentValue)
      setSaving(false)
    }
  }, [field, currentValue])

  async function handleSave() {
    if (!field) return
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    onSaved(field.key, value.trim())
    toast.success(`${field.label} updated`)
  }

  return (
    <Dialog
      open={Boolean(field)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        {field ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit {field.label.toLowerCase()}</DialogTitle>
              <DialogDescription>{scopeNote}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-field">{field.label}</Label>
              {field.type === "select" ? (
                <Select
                  value={value}
                  onValueChange={(next) => setValue(next ?? "")}
                >
                  <SelectTrigger id="edit-field" className="w-full">
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="edit-field"
                  type={field.type === "email" ? "email" : "text"}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(event) => setValue(event.target.value)}
                  disabled={saving}
                  autoFocus
                />
              )}
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
