import { api } from "@/lib/api/client"

export const deleteProjectRepo = (
  organizationId: string,
  projectId: string,
  repoName: string
) =>
  api.delete(
    `/projects/${encodeURIComponent(projectId)}/repos/${encodeURIComponent(repoName)}`,
    { organizationId }
  )
