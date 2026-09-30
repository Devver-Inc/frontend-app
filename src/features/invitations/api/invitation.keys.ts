export const invitationKeys = {
  all: ["invitations"] as const,
  list: (organizationId: string | null) =>
    [...invitationKeys.all, organizationId, "list"] as const,
  details: () => [...invitationKeys.all, "detail"] as const,
  detail: (invitationId: string | undefined) =>
    [...invitationKeys.details(), invitationId] as const,
}
