import { PageHeader } from "@/components/shared/page-header"
import { KycConfig } from "@/components/features/setup/kyc/kyc-config"

export default function KycSetupPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 md:pt-12">
        <PageHeader
          title="Configure KYC tiers"
          description="Pick a tier on the left, then turn on the checks it requires. Each enabled check reveals a provider to run it."
        />
      </div>
      <KycConfig />
    </div>
  )
}
