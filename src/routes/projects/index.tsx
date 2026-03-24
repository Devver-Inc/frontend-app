import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { FolderKanban, Search } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ProjectCard } from '@/components/projects/project-card'
import { StatsCards } from '@/components/projects/stats-cards'
import { PageHeader } from '@/components/ui/page-header'
import { useMembers } from '@/lib/hooks/use-members'
import { useProjects } from '@/lib/hooks/use-projects'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const navigate = useNavigate()
  const { currentOrganizationId } = useOrganizationContext()
  const [search, setSearch] = useState('')

  const { data: projectsData, isLoading } = useProjects({
    search: search.trim() || undefined,
    pageSize: 50,
  })
  const { data: membersData } = useMembers({ pageSize: 50 })

  if (!currentOrganizationId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Select an organization to manage projects.
        </p>
      </div>
    )
  }

  const projects = projectsData?.data ?? []
  const totalProjects = projectsData?.meta.totalItemsCount ?? projects.length
  const totalMembers = membersData?.meta.totalItemsCount ?? 0

  let projectsContent: ReactNode
  if (isLoading) {
    projectsContent = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {['p-1', 'p-2', 'p-3'].map((key) => (
          <Skeleton key={key} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    )
  } else if (projects.length === 0) {
    projectsContent = (
      <div className="page-shell py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No projects yet. Create your first project to get started.
        </p>
      </div>
    )
  } else {
    projectsContent = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() =>
              navigate({
                to: '/projects/$projectId',
                params: { projectId: project.id },
              })
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Create, track and manage your organization projects."
        icon={FolderKanban}
        rightSlot={<CreateProjectDialog />}
      />

      <StatsCards
        totalDeployments={0}
        activeProjects={totalProjects}
        teamMembers={totalMembers}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {projectsContent}
    </div>
  )
}
