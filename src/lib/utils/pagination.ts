import { z } from "zod"

export const paginationMetaSchema = z.object({
  currentPage: z.number(),
  totalItemsCount: z.number(),
  totalPagesCount: z.number(),
  itemsPerPage: z.number(),
})

export const paginatedSchema = <TItem extends z.ZodType>(item: TItem) =>
  z.object({ data: z.array(item), meta: paginationMetaSchema })
