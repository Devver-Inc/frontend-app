import { repoSchema } from "@/features/deployments/schemas/deployment.schema"
import type { CreateRepoInput } from "@/features/deployments/types/deployment.types"
import { api } from "@/lib/api/client"

export const createProjectRepo = (
  organizationId: string,
  projectId: string,
  input: CreateRepoInput
) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/repos`, {
    schema: repoSchema,
    organizationId,
    body: input,
  })
