import { organizationRoleListSchema } from "@/features/members/schemas/member.schema"
import { api } from "@/lib/api/client"

export const getOrganizationRoles = (signal?: AbortSignal) =>
  api.get("/organizations/roles", {
    schema: organizationRoleListSchema,
    signal,
  })
