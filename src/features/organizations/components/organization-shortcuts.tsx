import { Link } from "@tanstack/react-router"
import { Building2, FolderKanban, FolderOpen, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const SHORTCUTS = [
  {
    to: "/projects",
    title: "Projects",
    description: "Create and manage organization projects",
    icon: FolderKanban,
  },
  {
    to: "/organization/settings",
    title: "Organization Settings",
    description: "Manage name, avatar, and preferences",
    icon: Building2,
  },
  {
    to: "/organization/members",
    title: "Members",
    description: "Invite and manage team members",
    icon: Users,
  },
  {
    to: "/organizations/new",
    title: "New Organization",
    description: "Create another organization",
    icon: FolderOpen,
  },
] as const

export function OrganizationShortcuts() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SHORTCUTS.map(({ to, title, description, icon: Icon }) => (
        <Link key={to} to={to}>
          <Card className="glass-surface cursor-pointer border-border/50 transition-all hover:-translate-y-0.5 hover:border-border/70">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="page-header-icon">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
