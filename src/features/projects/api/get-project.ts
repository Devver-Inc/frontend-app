import { projectSchema } from "@/features/projects/schemas/project.schema"
import { api } from "@/lib/api/client"

export const getProject = (
  organizationId: string,
  projectId: string,
  signal?: AbortSignal
) =>
  api.get(`/projects/${encodeURIComponent(projectId)}`, {
    schema: projectSchema,
    organizationId,
    signal,
  })
