import type { UploadedFileMeta } from "@/components/shared/file-input"

export interface OrgProfileValues {
  name: string
  rcNumber: string
  industry: string
  email: string
  phone: string
  address: string
  country: string
}

export type OrgProfileField = keyof OrgProfileValues

export type OrgProfileErrors = Partial<Record<OrgProfileField, string>>

export type OrgDocuments = Record<string, UploadedFileMeta | null>
