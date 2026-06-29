import { PageHeader } from "@/components/shared/page-header"
import { KycConfig } from "@/components/features/setup/kyc/kyc-config"

export default function KycSetupPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 md:pt-12">
        <PageHeader
          title="Configure KYC tiers"
          description="Add a verification tier for each level of access you offer. Create as many as you need, then save."
        />
      </div>
      <KycConfig />
    </div>
  )
}
