import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { getProjects } from "@/features/projects/api/get-projects"
import { projectKeys } from "@/features/projects/api/project.keys"
import type { ProjectFilters } from "@/features/projects/types/project.types"

export const projectsQueryOptions = (
  organizationId: string | null,
  filters: ProjectFilters
) =>
  queryOptions({
    queryKey: projectKeys.list(organizationId, filters),
    queryFn: organizationId
      ? ({ signal }) => getProjects(organizationId, filters, signal)
      : skipToken,
  })

export const useProjects = (filters: ProjectFilters) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(projectsQueryOptions(organizationId, filters))
}
