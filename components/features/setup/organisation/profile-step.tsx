import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "@/components/shared/form-field"
import { COUNTRY_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants"
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

      <FormField id="org-rc" label="RC number" error={errors.rcNumber}>
        <Input
          id="org-rc"
          value={values.rcNumber}
          onChange={(event) => onChange("rcNumber", event.target.value)}
          aria-invalid={Boolean(errors.rcNumber)}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="org-industry" label="Industry">
          <Select
            value={values.industry}
            onValueChange={(value) => onChange("industry", value ?? "")}
          >
            <SelectTrigger id="org-industry" className="w-full">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="org-country" label="Country of incorporation">
          <Select
            value={values.country}
            onValueChange={(value) => onChange("country", value ?? "")}
          >
            <SelectTrigger id="org-country" className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

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
        hint="Include the country code, e.g. +234"
      >
        <Input
          id="org-phone"
          value={values.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
      </FormField>

      <FormField
        id="org-address"
        label="Registered address"
        error={errors.address}
      >
        <Input
          id="org-address"
          value={values.address}
          onChange={(event) => onChange("address", event.target.value)}
          aria-invalid={Boolean(errors.address)}
        />
      </FormField>
    </div>
  )
}
