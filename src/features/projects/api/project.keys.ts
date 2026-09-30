import type { ProjectFilters } from "@/features/projects/types/project.types"

export const projectKeys = {
  all: ["projects"] as const,
  lists: (organizationId: string | null) =>
    [...projectKeys.all, organizationId, "list"] as const,
  list: (organizationId: string | null, filters: ProjectFilters) =>
    [...projectKeys.lists(organizationId), filters] as const,
  details: (organizationId: string | null) =>
    [...projectKeys.all, organizationId, "detail"] as const,
  detail: (organizationId: string | null, projectId: string) =>
    [...projectKeys.details(organizationId), projectId] as const,
}
