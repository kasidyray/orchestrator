"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/shared/copy-button"
import {
  EditFieldDialog,
  type EditableField,
} from "@/components/features/settings/edit-field-dialog"
import { COUNTRY_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants"
import type { Organisation } from "@/lib/types"

/** Editable organisation fields surfaced on the settings page. */
type FieldKey = "name" | "email" | "phone" | "industry" | "country" | "address"

const FIELDS: readonly EditableField<FieldKey>[] = [
  {
    key: "name",
    label: "Legal business name",
    description: "Appears on receipts and compliance records.",
    type: "text",
  },
  {
    key: "email",
    label: "Business email",
    type: "email",
    placeholder: "ops@kudalite.africa",
  },
  {
    key: "phone",
    label: "Phone number",
    type: "text",
    placeholder: "+234 800 000 0000",
  },
  {
    key: "industry",
    label: "Industry",
    type: "select",
    options: INDUSTRY_OPTIONS,
  },
  {
    key: "country",
    label: "Country",
    type: "select",
    options: COUNTRY_OPTIONS,
  },
  {
    key: "address",
    label: "Registered address",
    type: "text",
  },
]

export function GeneralSettings({ org }: { org: Organisation }) {
  const [values, setValues] = React.useState<Record<FieldKey, string>>({
    name: org.name,
    email: org.email,
    phone: org.phone,
    industry: org.industry,
    country: org.country,
    address: org.address,
  })
  const [editingKey, setEditingKey] = React.useState<FieldKey | null>(null)

  const editingField = FIELDS.find((field) => field.key === editingKey) ?? null

  function handleSaved(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setEditingKey(null)
  }

  return (
    <>
      <dl className="border-t">
        {/* Read-only system identifier — surfaced for support and API references. */}
        <div className="grid grid-cols-1 gap-2 border-b py-6 sm:grid-cols-[1fr_1.6fr] sm:gap-8">
          <dt className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              Business ID
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              Your unique organisation identifier. Share it with support or use
              it in API references.
            </span>
          </dt>
          <dd className="flex items-center gap-2">
            <code className="rounded-md bg-muted px-2 py-1 font-mono text-sm text-foreground">
              {org.id}
            </code>
            <CopyButton value={org.id} label="Copy business ID" />
          </dd>
        </div>

        {FIELDS.map((field) => (
          <div
            key={field.key}
            className="grid grid-cols-1 gap-2 border-b py-6 sm:grid-cols-[1fr_1.6fr] sm:gap-8"
          >
            <dt className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {field.label}
              </span>
              {field.description ? (
                <span className="mt-1 text-sm text-muted-foreground">
                  {field.description}
                </span>
              ) : null}
            </dt>
            <dd className="flex flex-col items-start gap-1">
              <span className="text-sm text-foreground">
                {values[field.key] || (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </span>
              <Button
                variant="link"
                onClick={() => setEditingKey(field.key)}
                className="h-auto gap-0.5 p-0"
              >
                Edit
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </dd>
          </div>
        ))}
      </dl>

      <EditFieldDialog
        field={editingField}
        currentValue={editingKey ? values[editingKey] : ""}
        scopeNote="This change applies across your organisation profile."
        onClose={() => setEditingKey(null)}
        onSaved={handleSaved}
      />
    </>
  )
}
