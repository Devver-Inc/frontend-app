import { memberListSchema } from "@/features/members/schemas/member.schema"
import type { MemberFilters } from "@/features/members/types/member.types"
import { api } from "@/lib/api/client"

export const getMembers = (
  organizationId: string,
  { page, pageSize, search }: MemberFilters,
  signal?: AbortSignal
) =>
  api.get("/organizations/members", {
    schema: memberListSchema,
    query: { page, pageSize, search },
    organizationId,
    signal,
  })
