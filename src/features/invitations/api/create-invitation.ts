import { invitationSchema } from "@/features/invitations/schemas/invitation.schema"
import type { CreateInvitationInput } from "@/features/invitations/types/invitation.types"
import { api } from "@/lib/api/client"

export const createInvitation = (
  organizationId: string,
  input: CreateInvitationInput
) =>
  api.post("/organizations/invitations", {
    schema: invitationSchema,
    organizationId,
    body: input,
  })
