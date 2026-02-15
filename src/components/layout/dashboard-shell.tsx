import { useLogto } from '@logto/react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_LINKS = [
  { to: '/', label: 'HOME', icon: Home },
  { to: '/organization', label: 'ORGANIZATION', icon: Building2 },
  { to: '/profile', label: 'PROFILE', icon: User },
] as const

type DashboardShellProps = Readonly<{ children: React.ReactNode }>

export function DashboardShell({ children }: DashboardShellProps) {
  const { signOut } = useLogto()
  const routerState = useRouterState()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPath = routerState.location.pathname

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] md:flex-row">
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)] focus:fixed focus:left-4 focus:top-4 focus:m-0 focus:block focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)] focus:[clip:auto] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      >
        Skip to main content
      </a>
      {/* Sidebar overlay (mobile) */}
      <button
        type="button"
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar overlay"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-transform duration-200 ease-out md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar)]"
              onClick={() => setSidebarOpen(false)}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                aria-hidden
              >
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-[var(--sidebar-foreground)]">
                DEVVER
              </span>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-0.5 p-3" aria-label="Primary">
            {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive =
                currentPath === to || (to !== '/' && currentPath.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar)]',
                    isActive
                      ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
                      : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/80 hover:text-[var(--sidebar-accent-foreground)]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-[var(--sidebar-border)] p-3">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
              onClick={() =>
                signOut(
                  import.meta.env.VITE_LOGTO_SIGN_OUT_URI ??
                    `${globalThis.location.origin}/`,
                )
              }
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)] px-4 md:px-6"
          role="banner"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-medium text-[var(--muted-foreground)] md:text-base">
              Dashboard
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-6"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
