import { z } from "zod"

export const PROFILE_PICTURE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
]
const PROFILE_PICTURE_MAX_SIZE = 8 * 1024 * 1024

export const profilePictureSchema = z
  .file()
  .max(PROFILE_PICTURE_MAX_SIZE, "File too large. Maximum size is 8 MB.")
  .mime(
    PROFILE_PICTURE_MIME_TYPES,
    "The picture must be a PNG, JPG or WEBP image."
  )

export const personalInformationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
})
