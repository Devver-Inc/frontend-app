import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { SearchInput } from "@/components/common/search-input"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { ProjectList } from "@/features/projects/components/project-list"
import { useProjects } from "@/features/projects/hooks/use-projects"

export const Route = createFileRoute("/_protected/_dashboard/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const [search, setSearch] = useState("")
  const trimmedSearch = search.trim()
  const { data: projects, isLoading } = useProjects({
    search: trimmedSearch || undefined,
    pageSize: 50,
  })

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage projects." />
    )
  }

  return (
    <>
      <PageHeader title="Projects" actions={<CreateProjectDialog />} />
      <div className="space-y-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search projects"
        />
        <ProjectList
          projects={projects?.data ?? []}
          isLoading={isLoading}
          isSearching={trimmedSearch !== ""}
        />
      </div>
    </>
  )
}
