import { BrandMark } from "@/components/shared/brand-mark"
import { SidebarNav } from "@/components/shared/AppShell/sidebar-nav"
import { SetupProgressCard } from "@/components/shared/AppShell/setup-progress-card"
import { AccountMenu } from "@/components/shared/AppShell/account-menu"

/** Fixed desktop sidebar. Hidden below lg — mobile uses the sheet in TopBar. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-14 items-center px-5">
        <BrandMark />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SidebarNav />
      </div>

      <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
        <SetupProgressCard />
        <AccountMenu />
      </div>
    </aside>
  )
}
