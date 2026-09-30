import { projectListSchema } from "@/features/projects/schemas/project.schema"
import type { ProjectFilters } from "@/features/projects/types/project.types"
import { api } from "@/lib/api/client"

export const getProjects = (
  organizationId: string,
  { page, pageSize, search }: ProjectFilters,
  signal?: AbortSignal
) =>
  api.get("/projects", {
    schema: projectListSchema,
    query: { page, pageSize, search },
    organizationId,
    signal,
  })
