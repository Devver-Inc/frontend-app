import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import { getProjectDeployments } from "@/features/deployments/api/get-project-deployments"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const projectDeploymentsQueryOptions = (
  organizationId: string | null,
  projectId: string
) =>
  queryOptions({
    queryKey: deploymentKeys.list(organizationId, projectId),
    queryFn: organizationId
      ? ({ signal }) => getProjectDeployments(organizationId, projectId, signal)
      : skipToken,
  })

// The deploy agent only answers once the project pod is ready.
export const useProjectDeployments = (
  projectId: string,
  isPodReady: boolean
) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery({
    ...projectDeploymentsQueryOptions(organizationId, projectId),
    enabled: isPodReady,
  })
}
