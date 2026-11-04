import { restoreResultSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const restoreProject = (organizationId: string, projectId: string) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/restore`, {
    schema: restoreResultSchema,
    organizationId,
  })
