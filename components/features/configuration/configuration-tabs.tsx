"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { SecurityCheckIcon, Wallet01Icon } from "@hugeicons/core-free-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletProductsTable } from "@/components/features/configuration/wallet-products/wallet-products-table"
import { KycPolicy } from "@/components/features/configuration/kyc/kyc-policy"
import type { Wallet, WalletProduct } from "@/lib/types"

interface ConfigurationTabsProps {
  products: WalletProduct[]
  wallets: Wallet[]
}

/**
 * The configuration hub: one surface, two policy areas. Wallet products is built
 * in this phase; KYC & identity arrives next.
 */
export function ConfigurationTabs({
  products,
  wallets,
}: ConfigurationTabsProps) {
  return (
    <Tabs defaultValue="wallets">
      <TabsList>
        <TabsTrigger value="wallets">
          <HugeiconsIcon icon={Wallet01Icon} />
          Wallet products
        </TabsTrigger>
        <TabsTrigger value="kyc">
          <HugeiconsIcon icon={SecurityCheckIcon} />
          KYC &amp; identity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="wallets" className="pt-5">
        <WalletProductsTable products={products} wallets={wallets} />
      </TabsContent>

      <TabsContent value="kyc" className="pt-5">
        <KycPolicy />
      </TabsContent>
    </Tabs>
  )
}
