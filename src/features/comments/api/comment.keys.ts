import type { CommentFilters } from "@/features/comments/types/comment.types"

export const commentKeys = {
  all: ["comments"] as const,
  lists: (organizationId: string | null, projectId: string) =>
    [...commentKeys.all, organizationId, projectId, "list"] as const,
  list: (
    organizationId: string | null,
    projectId: string,
    filters: CommentFilters
  ) => [...commentKeys.lists(organizationId, projectId), filters] as const,
}
