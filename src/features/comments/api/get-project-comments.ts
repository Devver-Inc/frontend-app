import { commentListSchema } from "@/features/comments/schemas/comment.schema"
import type { CommentFilters } from "@/features/comments/types/comment.types"
import { api } from "@/lib/api/client"

export const getProjectComments = (
  organizationId: string,
  projectId: string,
  { page, pageSize, search, repo, branch }: CommentFilters,
  signal?: AbortSignal
) =>
  api.get(`/projects/${encodeURIComponent(projectId)}/comments`, {
    schema: commentListSchema,
    query: { page, pageSize, search, repo, branch },
    organizationId,
    signal,
  })
