import { createFileRoute } from "@tanstack/react-router"
import { Settings2 } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { ProjectCommentsCard } from "@/features/comments/components/project-comments-card"
import { projectCommentsQueryOptions } from "@/features/comments/hooks/use-project-comments"
import { ArgoCdStatusBanner } from "@/features/deployments/components/argocd-status-banner"
import { ProjectDeploymentsCard } from "@/features/deployments/components/project-deployments-card"
import { ProjectRepositoriesCard } from "@/features/deployments/components/project-repositories-card"
import { useArgoCdStatusStream } from "@/features/deployments/hooks/use-argocd-status-stream"
import { projectReposQueryOptions } from "@/features/deployments/hooks/use-project-repos"
import { membersQueryOptions } from "@/features/members/hooks/use-members"
import { DeleteProjectCard } from "@/features/projects/components/delete-project-card"
import {
  ProjectDetailsSkeleton,
  ProjectNotFound,
} from "@/features/projects/components/project-details-states"
import { ProjectSettingsCard } from "@/features/projects/components/project-settings-card"
import { ProjectSettingsSaveBar } from "@/features/projects/components/project-settings-save-bar"
import { ProjectTeamCard } from "@/features/projects/components/project-team-card"
import {
  projectQueryOptions,
  useProject,
} from "@/features/projects/hooks/use-project"
import { useProjectSettingsForm } from "@/features/projects/hooks/use-project-settings-form"
import type { Project } from "@/features/projects/types/project.types"
import { useOrganizationStore } from "@/stores/organization.store"

const ignoreError = () => undefined

export const Route = createFileRoute(
  "/_protected/_dashboard/projects/$projectId/"
)({
  // The cards only mount once the project is loaded: their data is requested
  // here, alongside the project, without waiting for it.
  loader: ({ context: { queryClient }, params: { projectId } }) => {
    const { currentOrganizationId } = useOrganizationStore.getState()
    if (!currentOrganizationId) return
    void queryClient
      .query(projectQueryOptions(currentOrganizationId, projectId))
      .catch(ignoreError)
    void queryClient
      .query(membersQueryOptions(currentOrganizationId, { pageSize: 50 }))
      .catch(ignoreError)
    void queryClient
      .query(
        projectCommentsQueryOptions(currentOrganizationId, projectId, {
          pageSize: 50,
        })
      )
      .catch(ignoreError)
    void queryClient
      .query(projectReposQueryOptions(currentOrganizationId, projectId))
      .catch(ignoreError)
  },
  component: ProjectPage,
})

function ProjectPage() {
  const { projectId } = Route.useParams()
  const { data: project, isLoading } = useProject(projectId)
  const argoCdStatus = useArgoCdStatusStream(projectId)

  if (isLoading) return <ProjectDetailsSkeleton />
  if (!project) return <ProjectNotFound />

  return <ProjectDetails project={project} argoCdStatus={argoCdStatus} />
}

type ProjectDetailsProps = {
  project: Project
  argoCdStatus: ReturnType<typeof useArgoCdStatusStream>
}

function ProjectDetails({ project, argoCdStatus }: ProjectDetailsProps) {
  const settings = useProjectSettingsForm(project)
  const isPodReady = argoCdStatus.status?.podReady === true

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description="Configure resources, access and team members."
        icon={Settings2}
      />
      <ArgoCdStatusBanner {...argoCdStatus} />
      <ProjectSettingsCard project={project} control={settings.form.control} />
      <ProjectTeamCard project={project} />
      <ProjectCommentsCard projectId={project.id} />
      <ProjectRepositoriesCard projectId={project.id} isPodReady={isPodReady} />
      <ProjectDeploymentsCard projectId={project.id} isPodReady={isPodReady} />
      {settings.isDirty && (
        <ProjectSettingsSaveBar
          isSaving={settings.isSaving}
          onSave={() => void settings.save()}
        />
      )}
      <DeleteProjectCard project={project} />
    </div>
  )
}
