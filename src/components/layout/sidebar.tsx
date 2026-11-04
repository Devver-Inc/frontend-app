import { Link } from "@tanstack/react-router"
import { Logo } from "@/components/common/logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher"
import { useUiStore } from "@/stores/ui.store"

export function Sidebar() {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="flex h-full flex-col gap-4 bg-sidebar p-2.5 text-sidebar-foreground">
      <Link
        to="/"
        onClick={closeMobileNav}
        className="w-fit rounded-md px-2 pt-2.5 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <Logo />
      </Link>
      <OrganizationSwitcher />
      <SidebarNav onNavigate={closeMobileNav} />
      <SidebarUser />
    </div>
  )
}
