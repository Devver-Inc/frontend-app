import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building2,
  ChevronDown,
  Code2,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const mainNav = [{ to: '/', label: 'Home', icon: Home }] as const

const orgSubNav = [
  { to: '/organization/settings', label: 'Settings', icon: Settings },
  { to: '/organization/members', label: 'Members', icon: Users },
] as const

const bottomLinks = [
  { href: 'https://docs.devver.app', label: 'Docs', icon: FileText },
  {
    href: 'https://discord.gg/devver',
    label: 'Community',
    icon: MessageSquare,
  },
  { href: 'https://github.com/devver', label: 'Github', icon: Code2 },
] as const

export function SidebarNav() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isOnOrgPage = pathname.startsWith('/organization')
  const [orgExpanded, setOrgExpanded] = useState(isOnOrgPage)

  useEffect(() => {
    if (isOnOrgPage) setOrgExpanded(true)
  }, [isOnOrgPage])

  return (
    <div className="flex flex-1 flex-col justify-between">
      <nav className="space-y-1 px-3">
        {mainNav.map((item) => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        <div>
          <button
            type="button"
            onClick={() => setOrgExpanded((v) => !v)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isOnOrgPage
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <Building2 className="h-4 w-4" />
            <span className="flex-1 text-left">Organization</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform',
                orgExpanded && 'rotate-180',
              )}
            />
          </button>

          {orgExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
              {orgSubNav.map((item) => {
                const isActive = pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'text-sidebar-primary font-medium'
                        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground',
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="space-y-1 px-3 pb-2">
        <div className="mb-2 border-t border-sidebar-border" />
        {bottomLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
