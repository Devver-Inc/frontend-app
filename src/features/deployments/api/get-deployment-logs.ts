import { deploymentLogsSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const getDeploymentLogs = (
  organizationId: string,
  projectId: string,
  deploymentId: string
) =>
  api.get(
    `/projects/${encodeURIComponent(projectId)}/deployments/${encodeURIComponent(deploymentId)}/logs`,
    { schema: deploymentLogsSchema, organizationId }
  )
