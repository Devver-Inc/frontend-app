import type { z } from "zod"
import type {
  createOrganizationSchema,
  organizationGovernanceSchema,
  organizationSchema,
  organizationSettingsSchema,
} from "@/features/organizations/schemas/organization.schema"

export type Organization = z.infer<typeof organizationSchema>

export type OrganizationGovernance = z.infer<
  typeof organizationGovernanceSchema
>

export type CreateOrganizationInput = z.output<typeof createOrganizationSchema>

export type UpdateOrganizationInput = Partial<
  z.output<typeof organizationSettingsSchema>
>
