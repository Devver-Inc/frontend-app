import { commentSchema } from "@/features/comments/schemas/comment.schema"
import type { CreateCommentInput } from "@/features/comments/types/comment.types"
import { api } from "@/lib/api/client"

export const createProjectComment = (
  organizationId: string,
  projectId: string,
  input: CreateCommentInput
) =>
  api.post(`/projects/${encodeURIComponent(projectId)}/comments`, {
    schema: commentSchema,
    organizationId,
    body: input,
  })
