import { repoListSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const getProjectRepos = (
  organizationId: string,
  projectId: string,
  signal?: AbortSignal
) =>
  api.get(`/projects/${encodeURIComponent(projectId)}/repos`, {
    schema: repoListSchema,
    organizationId,
    signal,
  })
