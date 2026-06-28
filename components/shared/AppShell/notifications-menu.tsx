"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDataTransferHorizontalIcon,
  Notification03Icon,
  SecurityCheckIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IconSvgElement } from "@hugeicons/react"

interface Notification {
  id: string
  icon: IconSvgElement
  title: string
  detail: string
  time: string
  unread: boolean
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    icon: ArrowDataTransferHorizontalIcon,
    title: "Large transfer flagged",
    detail: "₦3,400,000 payout to Afrinvest Securities is under review.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "n2",
    icon: UserMultipleIcon,
    title: "New customer onboarded",
    detail: "Chiamaka Obi completed Tier 2 verification.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: SecurityCheckIcon,
    title: "KYB under review",
    detail: "Your organisation documents are being verified.",
    time: "3h ago",
    unread: false,
  },
]

export function NotificationsMenu() {
  const unreadCount = NOTIFICATIONS.filter((item) => item.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            aria-label="Notifications"
          >
            <HugeiconsIcon icon={Notification03Icon} />
            {unreadCount > 0 ? (
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary ring-2 ring-background" />
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Notifications
            </span>
            <span className="font-normal text-muted-foreground">
              {unreadCount} unread
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          {NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-sm px-2 py-2.5 transition-colors hover:bg-foreground/5"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HugeiconsIcon icon={item.icon} className="size-4" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {item.title}
                  {item.unread ? (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
