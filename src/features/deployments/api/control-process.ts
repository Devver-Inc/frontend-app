import { processActionResultSchema } from "@/features/deployments/schemas/deployment.schema"
import type { ProcessAction } from "@/features/deployments/types/deployment.types"
import { api } from "@/lib/api/client"

export const controlProcess = (
  organizationId: string,
  projectId: string,
  action: ProcessAction,
  name: string
) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/pm2/${action}`, {
    schema: processActionResultSchema,
    organizationId,
    body: { name },
  })
