import { PageHeader } from "@/components/shared/page-header"
import { WalletCatalog } from "@/components/features/setup/wallets/wallet-catalog"

export default function WalletSetupPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:py-12">
      <PageHeader
        title="Wallet products"
        description="Choose the wallets your customers can hold, rename them, and set a default."
      />
      <WalletCatalog />
    </div>
  )
}
