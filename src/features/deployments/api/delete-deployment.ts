import { api } from "@/lib/api/client"

export const deleteDeployment = (
  organizationId: string,
  projectId: string,
  deploymentId: string
) =>
  api.delete(
    `/projects/${encodeURIComponent(projectId)}/deployments/${encodeURIComponent(deploymentId)}`,
    { organizationId }
  )
