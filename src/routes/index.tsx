import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, FolderKanban, FolderOpen, Plus, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { PageHeader } from '@/components/ui/page-header'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { currentOrganizationId, organizations } = useOrganizationContext()

  const currentOrg = organizations.find((o) => o.id === currentOrganizationId)
  const welcomeTitle = currentOrg ? `Welcome to ${currentOrg.name}` : 'Welcome'

  if (!currentOrganizationId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="page-shell px-8 py-10 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h2 className="mt-4 text-lg font-semibold">
            No organization selected
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create or select an organization to get started.
          </p>
          <Link to="/organizations/new">
            <Button className="mt-4 gap-1.5">
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={welcomeTitle}
        description="Manage your organization from the sidebar."
        icon={Building2}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/projects">
          <Card className="glass-surface cursor-pointer border-border/50 transition-all hover:-translate-y-0.5 hover:border-border/70">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="page-header-icon">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Projects</p>
                <p className="text-xs text-muted-foreground">
                  Create and manage organization projects
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/organization/settings">
          <Card className="glass-surface cursor-pointer border-border/50 transition-all hover:-translate-y-0.5 hover:border-border/70">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="page-header-icon">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Organization Settings</p>
                <p className="text-xs text-muted-foreground">
                  Manage name, avatar, and preferences
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/organization/members">
          <Card className="glass-surface cursor-pointer border-border/50 transition-all hover:-translate-y-0.5 hover:border-border/70">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="page-header-icon">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Members</p>
                <p className="text-xs text-muted-foreground">
                  Invite and manage team members
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/organizations/new">
          <Card className="glass-surface cursor-pointer border-border/50 transition-all hover:-translate-y-0.5 hover:border-border/70">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="page-header-icon">
                <FolderOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">New Organization</p>
                <p className="text-xs text-muted-foreground">
                  Create another organization
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
