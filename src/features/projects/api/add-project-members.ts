import { projectSchema } from "@/features/projects/schemas/project.schema"
import { api } from "@/lib/api/client"

export const addProjectMembers = (
  organizationId: string,
  projectId: string,
  userIds: string[]
) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/members`, {
    schema: projectSchema,
    organizationId,
    body: { userIds },
  })
