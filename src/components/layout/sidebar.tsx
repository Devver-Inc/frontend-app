import { Link } from "@tanstack/react-router"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher"
import { useIsDarkMode } from "@/hooks/use-is-dark-mode"
import { useUiStore } from "@/stores/ui.store"

export function Sidebar() {
  const isDark = useIsDarkMode()
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <aside className="glass-surface-strong flex h-full w-64 flex-col border-r border-sidebar-border/80 bg-sidebar/90">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border/80 px-5">
        <Link to="/" className="flex gap-0.5" onClick={closeMobileNav}>
          <img
            src={isDark ? "/logo.png" : "/favicon.png"}
            alt="Devver Logo"
            className="h-7"
          />
          <span className="text-2xl font-bold tracking-widest text-sidebar-foreground">
            EVVER
          </span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <OrganizationSwitcher />
      </div>

      <SidebarNav onNavigate={closeMobileNav} />
      <SidebarUser />
    </aside>
  )
}
