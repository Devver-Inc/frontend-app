import { z } from "zod"

const optionalParam = z.string().min(1).optional().catch(undefined)

// Sent by the overlay that opened this window: what to sign in for, and where
// to post the result.
export const overlayAuthSearchSchema = z.object({
  nonce: optionalParam,
  targetOrigin: optionalParam,
  organizationId: optionalParam,
  resource: optionalParam,
})
