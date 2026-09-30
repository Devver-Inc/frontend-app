import { createFileRoute } from "@tanstack/react-router"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form"

export const Route = createFileRoute(
  "/_protected/_dashboard/organizations/new/"
)({ component: NewOrganizationPage })

function NewOrganizationPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
      <PageHeader
        title="Create an organization"
        description="Give your organization a name, an optional description, and a logo."
        icon={Building2}
      />
      <CreateOrganizationForm />
    </div>
  )
}
