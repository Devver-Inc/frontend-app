import { deploymentListSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const getProjectDeployments = (
  organizationId: string,
  projectId: string,
  signal?: AbortSignal
) =>
  api.get(`/projects/${encodeURIComponent(projectId)}/deployments`, {
    schema: deploymentListSchema,
    organizationId,
    signal,
  })
