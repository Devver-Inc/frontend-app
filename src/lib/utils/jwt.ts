// Reads the payload without verifying the signature: never trust it for
// authorization, only for hints such as the expiry.
export const decodeJwtPayload = (token: string): unknown => {
  const [, payload] = token.split(".")
  if (!payload) return undefined
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return undefined
  }
}
