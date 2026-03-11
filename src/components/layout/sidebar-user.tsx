import { useLogto } from '@logto/react'
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

export function SidebarUser() {
  const { signOut, getIdTokenClaims } = useLogto()
  const [user, setUser] = useState<{
    name: string | null
    email: string | null
    picture: string | null
  }>({ name: null, email: null, picture: null })

  useEffect(() => {
    getIdTokenClaims().then((claims) => {
      if (!claims) return
      setUser({
        name:
          ((claims as Record<string, unknown>).username as string | null) ??
          claims.name ??
          null,
        email:
          ((claims as Record<string, unknown>).email as string | null) ?? null,
        picture:
          ((claims as Record<string, unknown>).picture as string | null) ??
          null,
      })
    })
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
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sidebar-accent"
          >
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
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuItem asChild>
            <a href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </a>
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
