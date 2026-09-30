import { Link, useRouterState } from "@tanstack/react-router"
import {
  Building2,
  ChevronDown,
  Code2,
  FileText,
  FolderKanban,
  Home,
  Settings,
  Users,
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

const MAIN_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderKanban },
] as const

const ORGANIZATION_NAV = [
  { to: "/organization/settings", label: "Settings", icon: Settings },
  { to: "/organization/members", label: "Members", icon: Users },
] as const

const EXTERNAL_LINKS = [
  { href: "https://docs.devver.app", label: "Docs", icon: FileText },
  { href: "https://github.com/Devver-Inc", label: "Github", icon: Code2 },
] as const

type SidebarNavProps = {
  onNavigate: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isOnOrganizationPage = pathname.startsWith("/organization")

  const [isOrganizationExpanded, setOrganizationExpanded] =
    useState(isOnOrganizationPage)
  const [wasOnOrganizationPage, setWasOnOrganizationPage] =
    useState(isOnOrganizationPage)
  // Opens the organization section when navigating into it, while leaving it
  // collapsible by hand.
  if (isOnOrganizationPage !== wasOnOrganizationPage) {
    setWasOnOrganizationPage(isOnOrganizationPage)
    if (isOnOrganizationPage) setOrganizationExpanded(true)
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <nav className="space-y-1 px-3">
        {MAIN_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === item.to
                ? "bg-sidebar-primary/16 text-sidebar-foreground shadow-sm ring-1 shadow-sidebar-primary/18 ring-sidebar-primary/22"
                : "text-sidebar-foreground/72 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOrganizationExpanded((isExpanded) => !isExpanded)}
            className={cn(
              "h-auto w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
              isOnOrganizationPage
                ? "bg-sidebar-primary/16 text-sidebar-foreground shadow-sm ring-1 shadow-sidebar-primary/18 ring-sidebar-primary/22"
                : "text-sidebar-foreground/72 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span className="flex-1 text-left">Organization</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isOrganizationExpanded && "rotate-180"
              )}
            />
          </Button>

          {isOrganizationExpanded && (
            <div className="mt-1 ml-4 space-y-1 border-l border-sidebar-border/80 pl-3">
              {ORGANIZATION_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all",
                    pathname === item.to
                      ? "bg-sidebar-accent font-medium text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="space-y-1 px-3 pb-2">
        <div className="mb-2 border-t border-sidebar-border" />
        <ThemeToggle />
        {EXTERNAL_LINKS.map((item) => (
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
