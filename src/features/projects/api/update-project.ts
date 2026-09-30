import { projectSchema } from "@/features/projects/schemas/project.schema"
import type { UpdateProjectInput } from "@/features/projects/types/project.types"
import { api } from "@/lib/api/client"

export const updateProject = (
  organizationId: string,
  projectId: string,
  input: UpdateProjectInput
) =>
  api.patch(`/projects/${encodeURIComponent(projectId)}`, {
    schema: projectSchema,
    organizationId,
    body: input,
  })
