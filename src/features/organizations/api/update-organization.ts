import { organizationSchema } from "@/features/organizations/schemas/organization.schema"
import type { UpdateOrganizationInput } from "@/features/organizations/types/organization.types"
import { api } from "@/lib/api/client"

export const updateOrganization = (
  organizationId: string,
  input: UpdateOrganizationInput
) =>
  api.patch("/organizations", {
    schema: organizationSchema,
    organizationId,
    body: input,
  })
