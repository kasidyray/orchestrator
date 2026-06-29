import { Sidebar } from "@/components/shared/AppShell/sidebar"
import { TopBar } from "@/components/shared/AppShell/top-bar"
import { TestModeStrip } from "@/components/shared/AppShell/test-mode-strip"

interface AppShellProps {
  children: React.ReactNode
}

/** Dashboard chrome: fixed sidebar + sticky topbar wrapping page content. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <TestModeStrip />
        <main className="flex flex-1 flex-col px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
