import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/common/page-header"
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form"

export const Route = createFileRoute(
  "/_protected/_dashboard/organizations/new/"
)({ component: NewOrganizationPage })

function NewOrganizationPage() {
  return (
    <div className="max-w-md">
      <PageHeader
        title="Create an organization"
        description="It holds your projects and the people working on them."
      />
      <CreateOrganizationForm />
    </div>
  )
}
