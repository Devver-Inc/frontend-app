import { z } from "zod"
import { userSchema } from "@/features/users/schemas/user.schema"
import { paginatedSchema } from "@/lib/utils/pagination"

export const memberListSchema = paginatedSchema(userSchema)

export const organizationRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const organizationRoleListSchema = z.array(organizationRoleSchema)
