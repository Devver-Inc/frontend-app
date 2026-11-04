import { organizationGovernanceSchema } from "@/features/organizations/schemas/organization.schema"
import { api } from "@/lib/api/client"

export const getOrganizationGovernance = (
  organizationId: string,
  signal?: AbortSignal
) =>
  api.get("/organizations/details", {
    schema: organizationGovernanceSchema,
    organizationId,
    signal,
  })
