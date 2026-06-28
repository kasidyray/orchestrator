import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { SectionCard } from "@/components/shared/section-card"
import { ORGANISATION_DOCUMENTS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type {
  OrgDocuments,
  OrgProfileValues,
} from "@/components/features/setup/organisation/types"

interface ReviewStepProps {
  values: OrgProfileValues
  documents: OrgDocuments
}

const PROFILE_FIELDS: { label: string; key: keyof OrgProfileValues }[] = [
  { label: "Legal business name", key: "name" },
  { label: "RC number", key: "rcNumber" },
  { label: "Industry", key: "industry" },
  { label: "Country", key: "country" },
  { label: "Business email", key: "email" },
  { label: "Phone number", key: "phone" },
  { label: "Registered address", key: "address" },
]

export function ReviewStep({ values, documents }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Organisation details">
        <dl className="divide-y divide-border">
          {PROFILE_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
                {values[field.key] || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard title="Documents">
        <ul className="flex flex-col divide-y divide-border">
          {ORGANISATION_DOCUMENTS.map((doc) => {
            const provided = Boolean(documents[doc.id])
            return (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <span className="text-sm text-foreground">{doc.label}</span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    provided ? "text-success" : "text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={provided ? CheckmarkCircle02Icon : Cancel01Icon}
                    className="size-4"
                  />
                  {provided ? "Provided" : "Not added"}
                </span>
              </li>
            )
          })}
        </ul>
      </SectionCard>
    </div>
  )
}
