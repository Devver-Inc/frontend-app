import type { MemberFilters } from "@/features/members/types/member.types"

export const memberKeys = {
  all: ["members"] as const,
  lists: (organizationId: string | null) =>
    [...memberKeys.all, organizationId, "list"] as const,
  list: (organizationId: string | null, filters: MemberFilters) =>
    [...memberKeys.lists(organizationId), filters] as const,
  roles: () => [...memberKeys.all, "roles"] as const,
}
