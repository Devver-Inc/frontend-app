import { z } from "zod"

export const ORGANIZATION_LOGO_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]
const ORGANIZATION_LOGO_MAX_SIZE = 5 * 1024 * 1024

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  coverImageUrl: z.string().nullable(),
})

const organizationNameSchema = z
  .string()
  .trim()
  .min(1, "Organization name is required.")
  .max(128, "Organization name must be 128 characters or fewer.")

const organizationDescriptionSchema = z
  .string()
  .trim()
  .max(256, "Description must be 256 characters or fewer.")

export const organizationLogoSchema = z
  .file()
  .mime(
    ORGANIZATION_LOGO_MIME_TYPES,
    "The logo must be a PNG, JPG, WEBP or SVG image."
  )

// The API accepts larger logos: the limit keeps the settings page light.
export const organizationSettingsLogoSchema = organizationLogoSchema.max(
  ORGANIZATION_LOGO_MAX_SIZE,
  "File too large. Maximum size is 5 MB."
)

export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
  description: organizationDescriptionSchema,
  logoFile: organizationLogoSchema.nullable(),
})

export const organizationSettingsSchema = z.object({
  name: organizationNameSchema,
  description: organizationDescriptionSchema,
})
