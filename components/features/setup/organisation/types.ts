import type { UploadedFileMeta } from "@/components/shared/file-input"
import type { OrgRoleOption } from "@/lib/constants"

export interface OrgProfileValues {
  // Business profile
  name: string
  rcNumber: string
  industry: string
  email: string
  phone: string
  // Business address ("How can we find you?")
  address: string
  state: string
  country: string
  addressDocType: string
  // Business representative
  repFirstName: string
  repLastName: string
  repDob: string
  repNationality: string
  bvn: string
}

export type OrgProfileField = keyof OrgProfileValues

export type OrgProfileErrors = Partial<Record<OrgProfileField, string>>

export type OrgRole = OrgRoleOption["id"]

export type OrgDocuments = Record<string, UploadedFileMeta | null>
