import { Link, useRouterState } from "@tanstack/react-router"
import {
  ArrowUpRight,
  FolderGit2,
  LayoutGrid,
  Settings2,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { useId } from "react"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils/cn"

const MAIN_NAV = [
  { to: "/", label: "Home", icon: LayoutGrid },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
] as const

const ORGANIZATION_NAV = [
  { to: "/organization/members", label: "Members", icon: Users },
  { to: "/organization/settings", label: "Settings", icon: Settings2 },
] as const

const EXTERNAL_LINKS = [
  { href: "https://docs.devver.app", label: "Docs" },
  { href: "https://github.com/Devver-Inc", label: "GitHub" },
] as const

const isActive = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname.startsWith(to)

type NavItemProps = {
  to: (typeof MAIN_NAV)[number]["to"] | (typeof ORGANIZATION_NAV)[number]["to"]
  label: string
  icon: LucideIcon
  pathname: string
  indicatorId: string
  onNavigate: () => void
}

function NavItem({
  to,
  label,
  icon: Icon,
  pathname,
  indicatorId,
  onNavigate,
}: NavItemProps) {
  const isCurrent = isActive(pathname, to)

  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "relative flex h-8 items-center gap-2.5 rounded-md px-2 font-medium transition-colors duration-100 outline-none hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset pointer-coarse:h-10",
        isCurrent ? "text-sidebar-foreground" : "text-sidebar-muted"
      )}
    >
      {isCurrent && (
        <motion.span
          layoutId={indicatorId}
          transition={spring}
          className="absolute inset-0 rounded-md bg-sidebar-accent"
        />
      )}
      <Icon
        className="relative size-4 shrink-0"
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="relative">{label}</span>
    </Link>
  )
}

type SidebarNavProps = {
  onNavigate: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  // The desktop rail and the mobile sheet must not share an animated indicator.
  const indicatorId = useId()

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-6">
      <nav
        aria-label="Main"
        className="min-h-0 space-y-5 overflow-y-auto overscroll-contain"
      >
        <div className="space-y-0.5">
          {MAIN_NAV.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              pathname={pathname}
              indicatorId={indicatorId}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="space-y-0.5">
          <p className="px-2 pb-1.5 text-xs text-sidebar-muted">Organization</p>
          {ORGANIZATION_NAV.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              pathname={pathname}
              indicatorId={indicatorId}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Wraps instead of overflowing when the text size goes up. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <div className="flex gap-2.5 pl-2">
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-0.5 rounded-sm text-xs text-sidebar-muted transition-colors duration-100 outline-none hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              {item.label}
              <ArrowUpRight className="size-3" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
