import type { z } from "zod"
import type {
  commentPositionSchema,
  commentSchema,
} from "@/features/comments/schemas/comment.schema"
import type { Pagination } from "@/types/pagination.types"

export type Comment = z.infer<typeof commentSchema>

export type CommentFilters = Pagination & {
  search?: string
  repo?: string
  branch?: string
}

export type CreateCommentInput = {
  content: string
  guestEmail?: string
  repo?: string
  branch?: string
  position?: z.infer<typeof commentPositionSchema>
}
