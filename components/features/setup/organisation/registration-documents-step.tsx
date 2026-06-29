import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import { FileInput } from "@/components/shared/file-input"
import { REGISTRATION_DOCUMENTS } from "@/lib/constants"
import type { OrgDocuments } from "@/components/features/setup/organisation/types"
import type { UploadedFileMeta } from "@/components/shared/file-input"

interface RegistrationDocumentsStepProps {
  documents: OrgDocuments
  onChange: (id: string, file: UploadedFileMeta | null) => void
}

export function RegistrationDocumentsStep({
  documents,
  onChange,
}: RegistrationDocumentsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-lg border border-info/20 bg-info/5 px-3.5 py-3 text-sm">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 size-4.5 shrink-0 text-info"
        />
        <p className="text-muted-foreground">
          Upload clear, full-page scans of your CAC documents. Accepted formats
          are PDF, JPG, and PNG up to 10 MB each.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {REGISTRATION_DOCUMENTS.map((doc) => (
          <FileInput
            key={doc.id}
            id={`doc-${doc.id}`}
            label={doc.label}
            hint={doc.hint}
            value={documents[doc.id] ?? null}
            onChange={(file) => onChange(doc.id, file)}
          />
        ))}
      </div>
    </div>
  )
}
