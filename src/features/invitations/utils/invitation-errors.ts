const INVITATION_ERROR_MESSAGES: Array<[code: string, message: string]> = [
  [
    "INVITATION_NOT_FOR_CURRENT_USER",
    "This invitation was sent to another email address. Sign in with the invited account.",
  ],
  [
    "USER_MUST_HAVE_VERIFIED_EMAIL_FOR_INVITATIONS",
    "Verify your email address, then accept this invitation.",
  ],
  [
    "INVITATION_NOT_FOUND",
    "This invitation link is invalid or no longer available.",
  ],
  [
    "INVALID_INVITATION_ID",
    "This invitation link is invalid or no longer available.",
  ],
]

export const getInvitationErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) return "The invitation could not be loaded."
  const known = INVITATION_ERROR_MESSAGES.find(([code]) =>
    error.message.includes(code)
  )
  return known ? known[1] : error.message
}
