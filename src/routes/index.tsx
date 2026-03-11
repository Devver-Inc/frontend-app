import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, FolderOpen, Plus, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { currentOrganizationId, organizations } = useOrganizationContext()

  const currentOrg = organizations.find((o) => o.id === currentOrganizationId)

  if (!currentOrganizationId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{currentOrg ? ` to ${currentOrg.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your organization from the sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/organization/settings">
          <Card className="cursor-pointer border-border/50 transition-all hover:border-border hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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
          <Card className="cursor-pointer border-border/50 transition-all hover:border-border hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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
          <Card className="cursor-pointer border-border/50 transition-all hover:border-border hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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
