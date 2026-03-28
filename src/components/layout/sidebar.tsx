import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher'

type SidebarProps = Readonly<{
  onNavigate?: () => void
}>

export function Sidebar({ onNavigate }: SidebarProps) {
  const [isDark, setIsDark] = useState(() =>
    typeof document === 'undefined'
      ? false
      : document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    const el = document.documentElement
    setIsDark(el.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'))
    })

    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const logoSrc = isDark ? '/logo.png' : '/favicon.png'

  return (
    <aside className="glass-surface-strong flex h-full w-64 flex-col border-r border-sidebar-border/80 bg-sidebar/90">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border/80 px-5">
        <Link to="/" className="flex gap-0.5" onClick={onNavigate}>
          <img src={logoSrc} alt="Devver Logo" className="h-7" />
          <span className="text-2xl font-bold tracking-widest text-sidebar-foreground">
            EVVER
          </span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <OrganizationSwitcher />
      </div>

      <SidebarNav onNavigate={onNavigate} />
      <SidebarUser />
    </aside>
  )
}
