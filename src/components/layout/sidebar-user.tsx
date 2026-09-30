import { Link } from "@tanstack/react-router"
import { ChevronsUpDown, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  const isLoading = user === undefined
  const displayName = user ? (user.username ?? user.name) : null

  return (
    <div className="border-t border-sidebar-border px-3 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full items-center gap-3 px-2 py-1.5 text-left text-sm hover:bg-sidebar-accent"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex w-full items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2 overflow-hidden">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            ) : (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.picture ?? undefined} />
                  <AvatarFallback className="bg-sidebar-accent text-xs">
                    {displayName ? getInitials(displayName) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-sidebar-foreground">
                    {displayName ?? "User"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-sidebar-foreground/60">
                      {user.email}
                    </p>
                  )}
                </div>
              </>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => void auth.signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
