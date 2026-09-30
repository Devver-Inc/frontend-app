import type { z } from "zod"
import type { organizationRoleSchema } from "@/features/members/schemas/member.schema"
import type { Pagination } from "@/types/pagination.types"

export type OrganizationRole = z.infer<typeof organizationRoleSchema>

export type MemberFilters = Pagination & {
  search?: string
}
