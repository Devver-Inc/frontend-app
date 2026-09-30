import { projectSchema } from "@/features/projects/schemas/project.schema"
import { api } from "@/lib/api/client"

export const removeProjectMember = (
  organizationId: string,
  projectId: string,
  userId: string
) =>
  api.delete(
    `/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`,
    { schema: projectSchema, organizationId }
  )
