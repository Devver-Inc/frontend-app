import { z } from "zod"
import { userSchema } from "@/features/users/schemas/user.schema"
import { paginatedSchema } from "@/lib/utils/pagination"

export const OVERLAY_COMMENT_PERMISSIONS = [
  "team_only",
  "email_required",
] as const
export const MACHINE_RESOURCE_MIN = 0.5
export const MACHINE_RESOURCE_MAX = 2

export const overlayCommentPermissionSchema = z.enum(
  OVERLAY_COMMENT_PERMISSIONS
)

export const projectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
})

export const projectListSchema = paginatedSchema(projectSummarySchema)

export const projectSchema = projectSummarySchema.extend({
  organizationId: z.string(),
  createdBy: userSchema.nullable(),
  machineConfiguration: z.object({
    cpuCores: z.number(),
    ram: z.number(),
  }),
  teamMembers: z.array(userSchema),
  overlayAccessControl: z.object({
    // Missing on projects created before the overlay access control.
    commentPermission: overlayCommentPermissionSchema.optional(),
  }),
  updatedAt: z.iso.datetime(),
})

const MACHINE_RESOURCE_MESSAGE = "CPU and RAM values must be between 0.5 and 2."

const machineResourceSchema = z
  .number()
  .min(MACHINE_RESOURCE_MIN, MACHINE_RESOURCE_MESSAGE)
  .max(MACHINE_RESOURCE_MAX, MACHINE_RESOURCE_MESSAGE)

const machineConfigurationSchema = z.object({
  cpuCores: machineResourceSchema,
  ram: machineResourceSchema,
})

const projectDescriptionSchema = z
  .string()
  .trim()
  .max(256, "Description must be 256 characters or fewer.")

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required.")
    .max(128, "Project name must be 128 characters or fewer."),
  description: projectDescriptionSchema,
  machineConfiguration: machineConfigurationSchema,
  teamMemberIds: z.array(z.string()),
  commentPermission: overlayCommentPermissionSchema,
})

export const projectSettingsSchema = z.object({
  description: projectDescriptionSchema,
  machineConfiguration: machineConfigurationSchema,
  commentPermission: overlayCommentPermissionSchema.optional(),
})
