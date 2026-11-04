import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import { getProjectDatabases } from "@/features/deployments/api/get-project-databases"
import type { DatabaseEngine } from "@/features/deployments/types/deployment.types"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const projectDatabasesQueryOptions = (
  organizationId: string | null,
  projectId: string,
  engine: DatabaseEngine
) =>
  queryOptions({
    queryKey: deploymentKeys.databases(organizationId, projectId, engine),
    queryFn: organizationId
      ? ({ signal }) =>
          getProjectDatabases(organizationId, projectId, engine, signal)
      : skipToken,
    meta: { silent: true },
  })

// Like deployments, databases are listed by the agent of the project pod.
export const useProjectDatabases = (
  projectId: string,
  engine: DatabaseEngine,
  isEnabled: boolean
) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery({
    ...projectDatabasesQueryOptions(organizationId, projectId, engine),
    enabled: isEnabled,
  })
}
