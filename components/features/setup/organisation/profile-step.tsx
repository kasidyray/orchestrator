import { Input } from "@/components/ui/input"
import { FormField } from "@/components/shared/form-field"
import { ComboField } from "@/components/shared/combo-field"
import { INDUSTRY_OPTIONS } from "@/lib/constants"
import type {
  OrgProfileErrors,
  OrgProfileField,
  OrgProfileValues,
} from "@/components/features/setup/organisation/types"

interface ProfileStepProps {
  values: OrgProfileValues
  errors: OrgProfileErrors
  onChange: (field: OrgProfileField, value: string) => void
}

export function ProfileStep({ values, errors, onChange }: ProfileStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <FormField id="org-name" label="Legal business name" error={errors.name}>
        <Input
          id="org-name"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="org-rc" label="RC number" error={errors.rcNumber}>
          <Input
            id="org-rc"
            value={values.rcNumber}
            onChange={(event) => onChange("rcNumber", event.target.value)}
            aria-invalid={Boolean(errors.rcNumber)}
          />
        </FormField>

        <FormField id="org-industry" label="Industry">
          <ComboField
            id="org-industry"
            options={INDUSTRY_OPTIONS}
            value={values.industry}
            onChange={(value) => onChange("industry", value)}
            placeholder="Search industry…"
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="org-email" label="Business email" error={errors.email}>
          <Input
            id="org-email"
            type="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>

        <FormField
          id="org-phone"
          label="Phone number"
          error={errors.phone}
          hint="e.g. 809 442 1180"
        >
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center border-r border-input text-sm text-muted-foreground">
              +234
            </span>
            <Input
              id="org-phone"
              type="tel"
              value={values.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="pl-14"
              aria-invalid={Boolean(errors.phone)}
            />
          </div>
        </FormField>
      </div>
    </div>
  )
}
