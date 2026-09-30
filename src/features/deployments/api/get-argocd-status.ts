import { argoCdStatusSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const getArgoCdStatus = (
  organizationId: string,
  projectId: string,
  signal?: AbortSignal
) =>
  api.get(`/projects/${encodeURIComponent(projectId)}/argocd/status`, {
    schema: argoCdStatusSchema,
    organizationId,
    signal,
  })
