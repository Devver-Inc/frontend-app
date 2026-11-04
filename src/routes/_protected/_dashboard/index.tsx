import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/common/page-header"
import { MyInvitations } from "@/features/invitations/components/my-invitations"
import { NoOrganizationSelected } from "@/features/organizations/components/no-organization-selected"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useUserOrganizations } from "@/features/organizations/hooks/use-user-organizations"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { RecentProjects } from "@/features/projects/components/recent-projects"
import { useRecentProjects } from "@/features/projects/hooks/use-projects"

export const Route = createFileRoute("/_protected/_dashboard/")({
  component: HomePage,
})

function HomePage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const { data: organizations = [] } = useUserOrganizations()
  const { data: recentProjects } = useRecentProjects()
  const currentOrganization = organizations.find(
    ({ id }) => id === currentOrganizationId
  )

  // Someone new may arrive with an invitation and no organization yet.
  if (!currentOrganizationId) {
    return (
      <div className="space-y-10">
        <MyInvitations />
        <NoOrganizationSelected />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={currentOrganization?.name ?? "Home"}
        // The getting started steps carry this action when there are no projects.
        actions={recentProjects?.data.length !== 0 && <CreateProjectDialog />}
      />
      <div className="space-y-10">
        <MyInvitations />
        <RecentProjects />
      </div>
    </>
  )
}
