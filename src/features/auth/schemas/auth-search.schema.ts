import { z } from "zod"

// Only same-site paths: `?redirect=https://evil.example` must not survive a
// sign-in. `//host` and `/\host` are protocol-relative URLs in browsers.
const relativePathSchema = z.string().regex(/^\/(?![/\\])/)

export const authSearchSchema = z.object({
  redirect: relativePathSchema.optional().catch(undefined),
})
