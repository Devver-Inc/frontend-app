import { createFileRoute } from "@tanstack/react-router"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { NoOrganizationSelected } from "@/features/organizations/components/no-organization-selected"
import { OrganizationShortcuts } from "@/features/organizations/components/organization-shortcuts"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useUserOrganizations } from "@/features/organizations/hooks/use-user-organizations"

export const Route = createFileRoute("/_protected/_dashboard/")({
  component: HomePage,
})

function HomePage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const { data: organizations = [] } = useUserOrganizations()
  const currentOrganization = organizations.find(
    ({ id }) => id === currentOrganizationId
  )

  if (!currentOrganizationId) return <NoOrganizationSelected />

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          currentOrganization
            ? `Welcome to ${currentOrganization.name}`
            : "Welcome"
        }
        description="Manage your organization from the sidebar."
        icon={Building2}
      />
      <OrganizationShortcuts />
    </div>
  )
}
