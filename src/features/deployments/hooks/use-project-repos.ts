import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import { getProjectRepos } from "@/features/deployments/api/get-project-repos"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const projectReposQueryOptions = (
  organizationId: string | null,
  projectId: string
) =>
  queryOptions({
    queryKey: deploymentKeys.repos(organizationId, projectId),
    queryFn: organizationId
      ? ({ signal }) => getProjectRepos(organizationId, projectId, signal)
      : skipToken,
  })

export const useProjectRepos = (projectId: string) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(projectReposQueryOptions(organizationId, projectId))
}
