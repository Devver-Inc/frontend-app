import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { getProject } from "@/features/projects/api/get-project"
import { projectKeys } from "@/features/projects/api/project.keys"

export const projectQueryOptions = (
  organizationId: string | null,
  projectId: string
) =>
  queryOptions({
    queryKey: projectKeys.detail(organizationId, projectId),
    queryFn: organizationId
      ? ({ signal }) => getProject(organizationId, projectId, signal)
      : skipToken,
  })

export const useProject = (projectId: string) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(projectQueryOptions(organizationId, projectId))
}
