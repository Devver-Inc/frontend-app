import { invitationSchema } from "@/features/invitations/schemas/invitation.schema"
import { api } from "@/lib/api/client"

// The invitee is not a member yet: no organization token.
export const getInvitation = (invitationId: string, signal?: AbortSignal) =>
  api.get(`/organizations/invitations/${encodeURIComponent(invitationId)}`, {
    schema: invitationSchema,
    signal,
  })
