import { api } from "@/lib/api/client"

export const revokeInvitation = (
  organizationId: string,
  invitationId: string
) =>
  api.patch(
    `/organizations/invitations/${encodeURIComponent(invitationId)}/status`,
    { organizationId, body: { status: "Revoked" } }
  )
