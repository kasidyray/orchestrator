import { HugeiconsIcon } from "@hugeicons/react"
import { Idea01Icon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "@/components/shared/form-field"
import { ComboField } from "@/components/shared/combo-field"
import { FileInput } from "@/components/shared/file-input"
import {
  ADDRESS_DOCUMENT_OPTIONS,
  COUNTRY_OPTIONS,
  NIGERIA_STATES,
} from "@/lib/constants"
import { StepSection } from "@/components/features/setup/organisation/step-section"
import type {
  OrgProfileErrors,
  OrgProfileField,
  OrgProfileValues,
} from "@/components/features/setup/organisation/types"
import type { UploadedFileMeta } from "@/components/shared/file-input"

interface AddressStepProps {
  values: OrgProfileValues
  errors: OrgProfileErrors
  onChange: (field: OrgProfileField, value: string) => void
  proofDocument: UploadedFileMeta | null
  onProofChange: (file: UploadedFileMeta | null) => void
}

export function AddressStep({
  values,
  errors,
  onChange,
  proofDocument,
  onProofChange,
}: AddressStepProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <FormField id="org-address" label="Address" error={errors.address}>
          <Input
            id="org-address"
            value={values.address}
            placeholder="Enter an address"
            onChange={(event) => onChange("address", event.target.value)}
            aria-invalid={Boolean(errors.address)}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="org-state" label="State" error={errors.state}>
            <Select
              value={values.state}
              onValueChange={(value) => onChange("state", value ?? "")}
            >
              <SelectTrigger id="org-state" className="w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIA_STATES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="org-country" label="Country" error={errors.country}>
            <ComboField
              id="org-country"
              options={COUNTRY_OPTIONS}
              value={values.country}
              onChange={(value) => onChange("country", value)}
              placeholder="Search country…"
              ariaInvalid={Boolean(errors.country)}
            />
          </FormField>
        </div>
      </div>

      <StepSection
        title="Next, add a proof of address"
        description={
          values.address
            ? `Upload a document that shows you live at ${values.address}.`
            : "Upload a document that shows your registered business address."
        }
      >
        <div className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3.5 text-sm">
          <div className="flex items-center gap-2.5 font-medium text-foreground">
            <HugeiconsIcon
              icon={Idea01Icon}
              className="size-4.5 shrink-0 text-primary"
            />
            Keep these tips in mind:
          </div>
          <ul className="flex flex-col gap-1.5 pl-7 text-muted-foreground">
            <li>Make sure your document is clear and visible</li>
            <li>
              Must show your address:{" "}
              <span className="font-medium text-foreground">
                {values.address || "your registered business address"}
              </span>
            </li>
            <li>Must be at least 6 months old</li>
          </ul>
        </div>

        <FormField
          id="org-address-doc-type"
          label="Choose address document"
          error={errors.addressDocType}
        >
          <Select
            value={values.addressDocType}
            onValueChange={(value) => onChange("addressDocType", value ?? "")}
          >
            <SelectTrigger id="org-address-doc-type" className="w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {ADDRESS_DOCUMENT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {values.addressDocType ? (
          <FileInput
            id="doc-proof-address"
            label={`Upload ${values.addressDocType.toLowerCase()}`}
            hint="PDF, JPG, or PNG up to 10 MB"
            value={proofDocument}
            onChange={onProofChange}
          />
        ) : null}
      </StepSection>
    </div>
  )
}
