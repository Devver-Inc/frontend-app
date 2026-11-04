import { createFileRoute } from "@tanstack/react-router"
import { Rocket } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Monogram } from "@/components/common/monogram"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { ProjectCommentsTab } from "@/features/comments/components/project-comments-tab"
import { projectCommentsQueryOptions } from "@/features/comments/hooks/use-project-comments"
import { DeploySheet } from "@/features/deployments/components/deploy-sheet"
import type { DeployPrefill } from "@/features/deployments/components/deploy-sheet"
import { ProjectDatabasesTab } from "@/features/deployments/components/project-databases-tab"
import { ProjectDeploymentsTab } from "@/features/deployments/components/project-deployments-tab"
import { ProjectRepositoriesTab } from "@/features/deployments/components/project-repositories-tab"
import { ProjectStatus } from "@/features/deployments/components/project-status"
import { useArgoCdStatusStream } from "@/features/deployments/hooks/use-argocd-status-stream"
import {
  projectReposQueryOptions,
  useProjectRepos,
} from "@/features/deployments/hooks/use-project-repos"
import { membersQueryOptions } from "@/features/members/hooks/use-members"
import {
  ProjectDetailsSkeleton,
  ProjectLoadError,
  ProjectNotFound,
} from "@/features/projects/components/project-details-states"
import { ProjectSettingsTab } from "@/features/projects/components/project-settings-tab"
import {
  PROJECT_TABS,
  ProjectTabs,
} from "@/features/projects/components/project-tabs"
import { ProjectTeamTab } from "@/features/projects/components/project-team-tab"
import {
  projectQueryOptions,
  useProject,
} from "@/features/projects/hooks/use-project"
import type { Project } from "@/features/projects/types/project.types"
import { ApiError } from "@/lib/api/api-error"
import { useOrganizationStore } from "@/stores/organization.store"

const projectSearchSchema = z.object({
  tab: z.enum(PROJECT_TABS).optional().catch(undefined),
})

const ignoreError = () => undefined

export const Route = createFileRoute(
  "/_protected/_dashboard/projects/$projectId/"
)({
  // The tabs only mount once the project is loaded: their data is requested
  // here, alongside the project, without waiting for it.
  validateSearch: projectSearchSchema,
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
  const { data: project, error, isLoading, refetch } = useProject(projectId)
  const argoCdStatus = useArgoCdStatusStream(projectId)

  if (isLoading) return <ProjectDetailsSkeleton />
  if (!project) {
    const isMissing = error instanceof ApiError && error.isClientError
    if (error && !isMissing) {
      return <ProjectLoadError onRetry={() => void refetch()} />
    }
    return <ProjectNotFound />
  }

  return (
    <ProjectDetails
      key={project.id}
      project={project}
      argoCdStatus={argoCdStatus}
    />
  )
}

type ProjectDetailsProps = {
  project: Project
  argoCdStatus: ReturnType<typeof useArgoCdStatusStream>
}

function ProjectDetails({ project, argoCdStatus }: ProjectDetailsProps) {
  const { tab = "deployments" } = Route.useSearch()
  const { data: repos = [] } = useProjectRepos(project.id)
  const [deployPanel, setDeployPanel] = useState<{
    isOpen: boolean
    prefill: DeployPrefill
  }>({ isOpen: false, prefill: {} })

  const isPodReady = argoCdStatus.status?.podReady === true
  const engines = project.databaseConfigurations
    .filter(({ enabled }) => enabled)
    .map(({ type }) => type)

  const openDeployPanel = (prefill: DeployPrefill = {}) =>
    setDeployPanel({ isOpen: true, prefill })

  return (
    <>
      <PageHeader
        title={project.name}
        leading={<Monogram name={project.name} size="lg" />}
        description={
          <ProjectStatus
            status={argoCdStatus.status}
            isConnected={argoCdStatus.isConnected}
          />
        }
        actions={
          <Button
            disabled={!isPodReady || repos.length === 0}
            onClick={() => openDeployPanel()}
          >
            <Rocket />
            Deploy
          </Button>
        }
      />
      <ProjectTabs projectId={project.id} current={tab} />

      {tab === "deployments" && (
        <ProjectDeploymentsTab
          projectId={project.id}
          isPodReady={isPodReady}
          applications={argoCdStatus.status?.applications ?? []}
          onDeploy={openDeployPanel}
        />
      )}
      {tab === "repositories" && (
        <ProjectRepositoriesTab
          projectId={project.id}
          isPodReady={isPodReady}
        />
      )}
      {tab === "databases" && (
        <ProjectDatabasesTab
          projectId={project.id}
          configurations={project.databaseConfigurations}
          isPodReady={isPodReady}
        />
      )}
      {tab === "comments" && <ProjectCommentsTab projectId={project.id} />}
      {tab === "team" && <ProjectTeamTab project={project} />}
      {tab === "settings" && (
        <ProjectSettingsTab project={project} isPodReady={isPodReady} />
      )}

      <DeploySheet
        projectId={project.id}
        repos={repos}
        engines={engines}
        isPodReady={isPodReady}
        isOpen={deployPanel.isOpen}
        prefill={deployPanel.prefill}
        onOpenChange={(isOpen) =>
          setDeployPanel((panel) => ({ ...panel, isOpen }))
        }
      />
    </>
  )
}
