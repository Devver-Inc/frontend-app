import { z } from "zod"
import { userSchema } from "@/features/users/schemas/user.schema"
import { paginatedSchema } from "@/lib/utils/pagination"

// Where the comment was pinned in the previewed page (overlay).
export const commentPositionSchema = z.object({
  pageUrl: z.string(),
  anchor: z.string(),
  normX: z.number(),
  normY: z.number(),
  anchorOffsetX: z.number(),
  anchorOffsetY: z.number(),
})

export const commentSchema = z.object({
  id: z.string(),
  author: userSchema.nullable(),
  repo: z.string().nullable(),
  branch: z.string().nullable(),
  content: z.string(),
  position: commentPositionSchema.nullable(),
  createdAt: z.iso.datetime(),
})

export const commentListSchema = paginatedSchema(commentSchema)

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Comment is required."),
})
