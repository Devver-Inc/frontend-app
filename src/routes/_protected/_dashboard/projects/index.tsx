import { createFileRoute } from "@tanstack/react-router"
import { FolderKanban } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { SearchInput } from "@/components/common/search-input"
import { useMembers } from "@/features/members/hooks/use-members"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { ProjectList } from "@/features/projects/components/project-list"
import { StatsCards } from "@/features/projects/components/stats-cards"
import { useProjects } from "@/features/projects/hooks/use-projects"

export const Route = createFileRoute("/_protected/_dashboard/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const [search, setSearch] = useState("")
  const { data: projects, isLoading } = useProjects({
    search: search.trim() || undefined,
    pageSize: 50,
  })
  const { data: members } = useMembers({ pageSize: 50 })

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage projects." />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Create, track and manage your organization projects."
        icon={FolderKanban}
        actions={<CreateProjectDialog />}
      />
      <StatsCards
        totalDeployments={0}
        activeProjects={projects?.meta.totalItemsCount ?? 0}
        teamMembers={members?.meta.totalItemsCount ?? 0}
      />
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search projects..."
      />
      <ProjectList projects={projects?.data ?? []} isLoading={isLoading} />
    </div>
  )
}
