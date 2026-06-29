"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  EditFieldDialog,
  type EditableField,
} from "@/components/features/settings/edit-field-dialog"
import { TEAM_ROLE_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import type { TeamMember } from "@/lib/types"

/** Self-editable profile fields. Role and membership are managed by admins. */
type FieldKey = "name" | "email"

const FIELDS: readonly EditableField<FieldKey>[] = [
  {
    key: "name",
    label: "Full name",
    description: "Shown to teammates across the dashboard.",
    type: "text",
  },
  {
    key: "email",
    label: "Email address",
    description: "Used for sign-in and account notifications.",
    type: "email",
    placeholder: "you@kudalite.africa",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function ProfileSettings({ user }: { user: TeamMember }) {
  const [values, setValues] = React.useState<Record<FieldKey, string>>({
    name: user.name,
    email: user.email,
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
        <SettingsRow
          label="Profile photo"
          description="Appears next to your name across the dashboard."
        >
          <Avatar className="size-12">
            <AvatarImage src={user.avatarUrl} alt={values.name} />
            <AvatarFallback>{initials(values.name)}</AvatarFallback>
          </Avatar>
        </SettingsRow>

        {FIELDS.map((field) => (
          <SettingsRow
            key={field.key}
            label={field.label}
            description={field.description}
          >
            <div className="flex flex-col items-start gap-1">
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
            </div>
          </SettingsRow>
        ))}

        <SettingsRow
          label="Role"
          description="Your permissions are set by an organisation admin."
        >
          <span className="text-sm text-foreground">
            {TEAM_ROLE_LABELS[user.role]}
          </span>
        </SettingsRow>

        <SettingsRow label="Account status">
          <StatusBadge
            variant={user.status === "active" ? "success" : "warning"}
            label={user.status === "active" ? "Active" : "Invited"}
          />
        </SettingsRow>

        <SettingsRow label="Member since">
          <span className="text-sm text-foreground">
            {formatDate(user.joinedAt)}
          </span>
        </SettingsRow>
      </dl>

      <EditFieldDialog
        field={editingField}
        currentValue={editingKey ? values[editingKey] : ""}
        scopeNote="This updates your personal account details."
        onClose={() => setEditingKey(null)}
        onSaved={handleSaved}
      />
    </>
  )
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b py-6 sm:grid-cols-[1fr_1.6fr] sm:gap-8">
      <dt className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </dt>
      <dd className="flex flex-col items-start gap-1">{children}</dd>
    </div>
  )
}
