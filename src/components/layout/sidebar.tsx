import { Link } from '@tanstack/react-router'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            DEVVER
          </span>
        </Link>
      </div>

      <div className="px-3 py-3">
        <OrganizationSwitcher />
      </div>

      <SidebarNav />
      <SidebarUser />
    </aside>
  )
}
