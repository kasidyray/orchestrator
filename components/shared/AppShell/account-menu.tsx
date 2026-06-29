"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BookOpen01Icon,
  ComputerIcon,
  HelpCircleIcon,
  Logout01Icon,
  Moon02Icon,
  Settings02Icon,
  Sun01Icon,
  UnfoldMoreIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TEAM_ROLE_LABELS } from "@/lib/constants"
import { useSession } from "@/hooks/use-session"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

/**
 * Signed-in account control at the sidebar footer. The trigger shows the
 * operator's identity; the menu opens upward with a theme toggle plus links to
 * settings, docs, help, and sign-out. Self-sources the session so it can be
 * dropped into both the desktop sidebar and the mobile sheet without props.
 */
export function AccountMenu() {
  const router = useRouter()
  const { user, signOut } = useSession()

  if (!user) return null

  function handleSignOut() {
    signOut()
    toast.success("Signed out")
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Open account menu"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {TEAM_ROLE_LABELS[user.role]}
              </span>
            </span>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              className="ml-auto size-4 shrink-0 text-muted-foreground"
            />
          </button>
        }
      />
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-(--anchor-width) min-w-60"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <div className="px-1 py-1">
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <HugeiconsIcon icon={Settings02Icon} />
          Organisation settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/profile" />}>
          <HugeiconsIcon icon={UserCircleIcon} />
          Profile settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/developer" />}>
          <HugeiconsIcon icon={BookOpen01Icon} />
          Documentation
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast("Help centre coming soon")}
        >
          <HugeiconsIcon icon={HelpCircleIcon} />
          Get help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <HugeiconsIcon icon={Logout01Icon} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const THEME_OPTIONS: { value: string; label: string; icon: IconSvgElement }[] = [
  { value: "system", label: "System", icon: ComputerIcon },
  { value: "light", label: "Light", icon: Sun01Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
]

/** Segmented System / Light / Dark control backed by next-themes. */
function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
      {THEME_OPTIONS.map((option) => {
        const active = (theme ?? "system") === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={active}
            aria-label={option.label}
            className={cn(
              "flex flex-1 items-center justify-center rounded-sm py-1.5 transition-colors duration-100",
              active
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={option.icon} className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
