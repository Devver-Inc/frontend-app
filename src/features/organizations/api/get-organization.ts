import { organizationSchema } from "@/features/organizations/schemas/organization.schema"
import { api } from "@/lib/api/client"

export const getOrganization = (organizationId: string, signal?: AbortSignal) =>
  api.get("/organizations", {
    schema: organizationSchema,
    organizationId,
    signal,
  })
