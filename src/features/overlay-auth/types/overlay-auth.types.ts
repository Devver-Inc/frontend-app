import type { z } from "zod"
import type { overlayAuthSearchSchema } from "@/features/overlay-auth/schemas/overlay-auth-search.schema"

export type OverlayAuthSearch = z.infer<typeof overlayAuthSearchSchema>

export type OverlayAuthErrorCode =
  "organization_access_denied" | "token_unavailable" | "unknown_error"

// Contract with the overlay (window.postMessage).
export type OverlayAuthMessage = {
  type: "devver-overlay-auth"
  nonce: string
  accessToken?: string
  expiresAt?: number
  userName?: string
  userEmail?: string
  profileOnly?: boolean
  errorCode?: OverlayAuthErrorCode
  error?: string
}
