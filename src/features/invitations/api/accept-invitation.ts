import { api } from "@/lib/api/client"

// The invitee is not a member yet: no organization token.
export const acceptInvitation = (invitationId: string) =>
  api.patch(
    `/organizations/invitations/${encodeURIComponent(invitationId)}/status`,
    { body: { status: "Accepted" } }
  )
