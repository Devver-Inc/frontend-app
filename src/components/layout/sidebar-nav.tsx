import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building2,
  ChevronDown,
  Code2,
  FileText,
  FolderKanban,
  Home,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const mainNav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
] as const

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

type SidebarNavProps = Readonly<{
  onNavigate?: () => void
}>

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isOnOrgPage = pathname.startsWith('/organization')
  const [orgExpanded, setOrgExpanded] = useState(isOnOrgPage)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    if (isOnOrgPage) setOrgExpanded(true)
  }, [isOnOrgPage])

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem('theme', nextTheme)
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <nav className="space-y-1 px-3">
        {mainNav.map((item) => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary/16 text-sidebar-foreground shadow-sm shadow-sidebar-primary/18 ring-1 ring-sidebar-primary/22'
                  : 'text-sidebar-foreground/72 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOrgExpanded((v) => !v)}
            className={cn(
              'h-auto w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              isOnOrgPage
                ? 'bg-sidebar-primary/16 text-sidebar-foreground shadow-sm shadow-sidebar-primary/18 ring-1 ring-sidebar-primary/22'
                : 'text-sidebar-foreground/72 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground',
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
          </Button>

          {orgExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border/80 pl-3">
              {orgSubNav.map((item) => {
                const isActive = pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              Light mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark mode
            </>
          )}
        </Button>
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
