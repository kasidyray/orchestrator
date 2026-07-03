import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { SectionCard } from "@/components/shared/section-card"
import { ORGANISATION_DOCUMENTS, ORG_ROLE_OPTIONS } from "@/lib/constants"
import { cn, formatDate } from "@/lib/utils"
import type {
  OrgDocuments,
  OrgProfileValues,
  OrgRole,
} from "@/components/features/setup/organisation/types"

interface ReviewStepProps {
  values: OrgProfileValues
  roles: OrgRole[]
  documents: OrgDocuments
}

type Row = { label: string; value: string }

export function ReviewStep({ values, roles, documents }: ReviewStepProps) {
  const businessRows: Row[] = [
    { label: "Legal business name", value: values.name },
    { label: "RC number", value: values.rcNumber },
    { label: "Industry", value: values.industry },
    { label: "Business email", value: values.email },
    { label: "Phone number", value: values.phone ? `+234 ${values.phone}` : "" },
  ]

  const addressRows: Row[] = [
    { label: "Address", value: values.address },
    { label: "State", value: values.state },
    { label: "Country", value: values.country },
  ]

  const roleLabels = ORG_ROLE_OPTIONS.filter((role) =>
    roles.includes(role.id)
  )
    .map((role) => role.label)
    .join(", ")

  const representativeRows: Row[] = [
    {
      label: "Legal name",
      value: [values.repFirstName, values.repLastName]
        .filter(Boolean)
        .join(" "),
    },
    {
      label: "Date of birth",
      value: values.repDob ? formatDate(values.repDob) : "",
    },
    { label: "Nationality", value: values.repNationality },
    { label: "Role at the business", value: roleLabels },
    { label: "BVN", value: values.bvn },
    { label: "NIN", value: values.nin },
  ]

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Business details">
        <DefinitionList rows={businessRows} />
      </SectionCard>

      <SectionCard title="Registered address">
        <DefinitionList rows={addressRows} />
      </SectionCard>

      <SectionCard title="Business representative">
        <DefinitionList rows={representativeRows} />
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

function DefinitionList({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 py-2.5"
        >
          <dt className="text-sm text-muted-foreground">{row.label}</dt>
          <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
            {row.value || "—"}
          </dd>
        </div>
      ))}
    </dl>
  )
}
