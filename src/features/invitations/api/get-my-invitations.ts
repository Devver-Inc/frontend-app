import { invitationListSchema } from "@/features/invitations/schemas/invitation.schema"
import { api } from "@/lib/api/client"

export const getMyInvitations = (signal?: AbortSignal) =>
  api.get("/organizations/invitations/me", {
    schema: invitationListSchema,
    signal,
  })
