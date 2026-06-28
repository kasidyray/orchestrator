import { OrganisationWizard } from "@/components/features/setup/organisation/organisation-wizard"
import { mockOrganisation } from "@/lib/mock-data"

export default function OrganisationSetupPage() {
  return (
    <OrganisationWizard
      initialValues={{
        name: mockOrganisation.name,
        rcNumber: mockOrganisation.rcNumber,
        industry: mockOrganisation.industry,
        email: mockOrganisation.email,
        phone: mockOrganisation.phone,
        address: mockOrganisation.address,
        country: mockOrganisation.country,
      }}
    />
  )
}
