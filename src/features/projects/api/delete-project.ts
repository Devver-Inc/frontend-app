import { api } from "@/lib/api/client"

export const deleteProject = (organizationId: string, projectId: string) =>
  api.delete(`/projects/${encodeURIComponent(projectId)}`, { organizationId })
