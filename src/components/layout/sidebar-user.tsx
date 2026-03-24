import { useLogto } from '@logto/react'
import { Link } from '@tanstack/react-router'
import { ChevronsUpDown, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface LogtoClaims {
  sub?: string
  username?: string
  name?: string
  email?: string
  picture?: string
}

export function SidebarUser() {
  const { signOut, getIdTokenClaims } = useLogto()
  const [user, setUser] = useState<{
    name: string | null
    email: string | null
    picture: string | null
  }>({ name: null, email: null, picture: null })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)

    getIdTokenClaims()
      .then((claims) => {
        if (!claims) return

        const typedClaims = claims as unknown as LogtoClaims
        if (cancelled) return

        setUser({
          name: typedClaims.username ?? typedClaims.name ?? null,
          email: typedClaims.email ?? null,
          picture: typedClaims.picture ?? null,
        })
      })
      .catch(() => {
        // If claims can't be fetched, keep the user empty and stop the loading UI.
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [getIdTokenClaims])

  const initials = user.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

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
                <div className="flex-1 overflow-hidden space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            ) : (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.picture ?? undefined} />
                  <AvatarFallback className="bg-sidebar-accent text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-sidebar-foreground">
                    {user.name ?? 'User'}
                  </p>
                  {user.email && (
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
            onClick={() => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URI)}
            className="text-destructive-foreground focus:text-destructive-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
