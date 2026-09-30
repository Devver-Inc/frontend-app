import { z } from "zod"

export const invitationSchema = z.object({
  id: z.string(),
  invitee: z.string(),
  inviterId: z.string(),
  organizationId: z.string(),
  organizationName: z.string(),
  // Logto statuses: Pending, Accepted, Expired, Revoked.
  status: z.string(),
  createdAt: z.iso.datetime(),
  expiresAt: z.iso.datetime(),
  organizationRoles: z.array(z.string()),
  message: z.string().nullish(),
  acceptedAt: z.iso.datetime().optional(),
})

export const invitationListSchema = z.array(invitationSchema)

// Link sent by email: /invitations/join?invitationId=…
export const joinInvitationSearchSchema = z.object({
  invitationId: z
    .string()
    .refine((value) => value.trim() !== "")
    .optional()
    .catch(undefined),
})

export const inviteMemberSchema = z.object({
  invitee: z.string().trim().pipe(z.email("Enter a valid email address.")),
  // Empty until a role is picked: the dialog then uses its default role.
  organizationRoleId: z.string(),
})
