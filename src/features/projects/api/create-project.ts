import { projectSummarySchema } from "@/features/projects/schemas/project.schema"
import type { CreateProjectInput } from "@/features/projects/types/project.types"
import { api } from "@/lib/api/client"

export const createProject = (
  organizationId: string,
  input: CreateProjectInput
) =>
  api.post("/projects", {
    schema: projectSummarySchema,
    organizationId,
    body: input,
  })
