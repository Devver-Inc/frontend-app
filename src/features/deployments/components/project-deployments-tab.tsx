import { Link } from "@tanstack/react-router"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BranchMap } from "@/features/deployments/components/branch-map"
import type { DeployPrefill } from "@/features/deployments/components/deploy-sheet"
import { MachineComponents } from "@/features/deployments/components/machine-components"
import { useProjectDeployments } from "@/features/deployments/hooks/use-project-deployments"
import { useProjectRepos } from "@/features/deployments/hooks/use-project-repos"
import type { ArgoCdApplication } from "@/features/deployments/types/deployment.types"

type DeploymentsContentProps = {
  projectId: string
  isPodReady: boolean
  onDeploy: (prefill: DeployPrefill) => void
}

function DeploymentsContent({
  projectId,
  isPodReady,
  onDeploy,
}: DeploymentsContentProps) {
  const repos = useProjectRepos(projectId)
  const deployments = useProjectDeployments(projectId, isPodReady)

  if (!isPodReady && !deployments.data) {
    return (
      <EmptyState
        title="The machine is getting ready"
        description="Your branches show up here as soon as it's running."
      />
    )
  }

  if (repos.isPending || deployments.isPending) {
    return (
      <div role="status" aria-label="Loading deployments" className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  if (!repos.data?.length && !deployments.data?.length) {
    return (
      <EmptyState
        title="No repositories yet"
        description="Add a repository and push your code to deploy your first branch."
        action={
          <Button asChild>
            <Link
              to="/projects/$projectId"
              params={{ projectId }}
              search={{ tab: "repositories" }}
            >
              Add a repository
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <BranchMap
      projectId={projectId}
      repos={repos.data ?? []}
      deployments={deployments.data ?? []}
      isPodReady={isPodReady}
      onDeploy={onDeploy}
    />
  )
}

type ProjectDeploymentsTabProps = DeploymentsContentProps & {
  applications: ArgoCdApplication[]
}

export function ProjectDeploymentsTab({
  applications,
  ...content
}: ProjectDeploymentsTabProps) {
  return (
    <div className="space-y-10">
      <DeploymentsContent {...content} />
      <MachineComponents applications={applications} />
    </div>
  )
}
