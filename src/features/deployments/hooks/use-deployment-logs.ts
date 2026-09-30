import { useMutation } from "@tanstack/react-query"
import { getDeploymentLogs } from "@/features/deployments/api/get-deployment-logs"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

// Fetched on demand and never cached: logs are read once, when asked for.
export const useDeploymentLogs = (projectId: string) => {
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (deploymentId: string) =>
      getDeploymentLogs(
        requireOrganizationId(organizationId),
        projectId,
        deploymentId
      ),
    meta: { errorMessage: "Failed to load logs." },
  })
}
