import { invitationListSchema } from "@/features/invitations/schemas/invitation.schema"
import { api } from "@/lib/api/client"

export const getInvitations = (organizationId: string, signal?: AbortSignal) =>
  api.get("/organizations/invitations", {
    schema: invitationListSchema,
    organizationId,
    signal,
  })
