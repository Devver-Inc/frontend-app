import { gitTokenSchema } from "@/features/deployments/schemas/deployment.schema"
import { api } from "@/lib/api/client"

export const createGitToken = (
  organizationId: string,
  projectId: string,
  repo: string
) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/git-tokens`, {
    schema: gitTokenSchema,
    organizationId,
    body: { repo },
  })
