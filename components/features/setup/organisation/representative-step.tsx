import { HugeiconsIcon } from "@hugeicons/react"
import { GlobalIcon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "@/components/shared/form-field"
import { FileInput } from "@/components/shared/file-input"
import { NATIONALITY_OPTIONS, ORG_ROLE_OPTIONS } from "@/lib/constants"
import { StepSection } from "@/components/features/setup/organisation/step-section"
import type {
  OrgProfileErrors,
  OrgProfileField,
  OrgProfileValues,
  OrgRole,
} from "@/components/features/setup/organisation/types"
import type { UploadedFileMeta } from "@/components/shared/file-input"

interface RepresentativeStepProps {
  values: OrgProfileValues
  errors: OrgProfileErrors
  onChange: (field: OrgProfileField, value: string) => void
  roles: OrgRole[]
  onToggleRole: (role: OrgRole) => void
  rolesError?: string
  idDocument: UploadedFileMeta | null
  onIdChange: (file: UploadedFileMeta | null) => void
}

export function RepresentativeStep({
  values,
  errors,
  onChange,
  roles,
  onToggleRole,
  rolesError,
  idDocument,
  onIdChange,
}: RepresentativeStepProps) {
  // Personalise every prompt around the representative once their name is known.
  const firstName = values.repFirstName.trim()
  const Poss = firstName ? `${firstName}’s` : "The representative’s"
  const poss = firstName ? `${firstName}’s` : "their"

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="rep-first-name"
            label="Legal first name"
            error={errors.repFirstName}
          >
            <Input
              id="rep-first-name"
              value={values.repFirstName}
              placeholder="First name"
              onChange={(event) => onChange("repFirstName", event.target.value)}
              aria-invalid={Boolean(errors.repFirstName)}
            />
          </FormField>

          <FormField
            id="rep-last-name"
            label="Legal last name"
            error={errors.repLastName}
          >
            <Input
              id="rep-last-name"
              value={values.repLastName}
              placeholder="Last name"
              onChange={(event) => onChange("repLastName", event.target.value)}
              aria-invalid={Boolean(errors.repLastName)}
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="rep-dob"
            label={`${Poss} date of birth`}
            error={errors.repDob}
          >
            <Input
              id="rep-dob"
              type="date"
              value={values.repDob}
              onChange={(event) => onChange("repDob", event.target.value)}
              aria-invalid={Boolean(errors.repDob)}
            />
          </FormField>

          <FormField id="rep-nationality" label={`${Poss} nationality`}>
            <Select
              value={values.repNationality}
              onValueChange={(value) => onChange("repNationality", value ?? "")}
            >
              <SelectTrigger id="rep-nationality" className="w-full">
                <HugeiconsIcon
                  icon={GlobalIcon}
                  className="size-4 text-muted-foreground"
                />
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {NATIONALITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="flex flex-col gap-2.5">
          <Label className="justify-start">{`${Poss} role at the business`}</Label>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {ORG_ROLE_OPTIONS.map((role) => (
              <label
                key={role.id}
                className="flex cursor-pointer items-center gap-2 select-none"
              >
                <Checkbox
                  checked={roles.includes(role.id)}
                  onCheckedChange={() => onToggleRole(role.id)}
                />
                <span className="text-sm font-medium text-foreground">
                  {role.label}
                </span>
              </label>
            ))}
          </div>
          {rolesError ? (
            <p className="text-xs text-destructive">{rolesError}</p>
          ) : null}
        </div>
      </div>

      <StepSection
        title={`Next, let’s verify ${poss} identity`}
        description={`As a regulated financial services company, we would need to verify ${poss} identity.`}
      >
        <FormField
          id="rep-bvn"
          label={`${Poss} bank verification number (BVN)`}
          error={errors.bvn}
          hint="11-digit BVN"
        >
          <Input
            id="rep-bvn"
            value={values.bvn}
            inputMode="numeric"
            maxLength={11}
            placeholder={`Enter ${poss} BVN`}
            onChange={(event) =>
              onChange("bvn", event.target.value.replace(/[^\d]/g, ""))
            }
            aria-invalid={Boolean(errors.bvn)}
          />
        </FormField>

        <FileInput
          id="doc-director-id"
          label={`${Poss} government ID`}
          hint="NIN slip, passport, or driver’s licence"
          value={idDocument}
          onChange={onIdChange}
        />
      </StepSection>
    </div>
  )
}
