import { Link } from "@tanstack/react-router"
import { ChevronsUpDown, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { useAuthUser } from "@/features/auth/hooks/use-auth-user"
import { getInitials } from "@/lib/utils/get-initials"

export function SidebarUser() {
  const auth = useAuthClient()
  const user = useAuthUser()
  const displayName = user ? (user.name ?? user.username) : null

  if (user === undefined) {
    return <Skeleton className="h-11 rounded-lg bg-sidebar-accent" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-1.5 text-left transition-[background-color,scale] duration-100 outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring active:scale-[.98]">
        <Avatar className="size-7">
          <AvatarImage
            src={user?.picture ?? undefined}
            className="object-cover"
          />
          <AvatarFallback className="bg-sidebar-accent text-[.6875rem] font-medium text-sidebar-foreground">
            {displayName ? getInitials(displayName) : "?"}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate leading-tight font-medium text-sidebar-foreground">
            {displayName ?? "User"}
          </span>
          {user?.email && (
            <span className="block truncate text-xs text-sidebar-muted">
              {user.email}
            </span>
          )}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) origin-bottom-left"
      >
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void auth.signOut()}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
