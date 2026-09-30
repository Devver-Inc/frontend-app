import type { z } from "zod"
import type { invitationSchema } from "@/features/invitations/schemas/invitation.schema"

export type Invitation = z.infer<typeof invitationSchema>

export type CreateInvitationInput = {
  invitee: string
  organizationRoleIds?: string[]
  message?: string
  expiresInHours?: number
}
