import { z } from "zod"
import { userSchema } from "@/features/users/schemas/user.schema"
import { paginatedSchema } from "@/lib/utils/pagination"

export const OVERLAY_COMMENT_PERMISSIONS = [
  "team_only",
  "email_required",
] as const
export const MACHINE_RESOURCE_MIN = 0.5
export const MACHINE_RESOURCE_MAX = 2
export const DATABASE_TYPES = ["mongo", "postgres", "redis"] as const
export const DATABASE_REPLICAS_MAX = 3
export const DATABASE_STORAGE_MAX = 5

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

const databaseTypeSchema = z.enum(DATABASE_TYPES)

export const projectDatabaseConfigurationSchema = z.object({
  name: z.string(),
  type: databaseTypeSchema,
  enabled: z.boolean(),
  username: z.string().optional(),
  hasPassword: z.boolean().optional(),
  replicaCount: z.number().optional(),
  ram: z.number().optional(),
  cpuCores: z.number().optional(),
  storage: z.number().optional(),
})

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
  // Missing on projects created before managed databases.
  databaseConfigurations: z
    .array(projectDatabaseConfigurationSchema)
    .default([]),
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

const databaseConfigurationSchema = z.object({
  type: databaseTypeSchema,
  username: z.string().trim().min(1, "Database username is required."),
  password: z.string().min(1, "Database password is required."),
  replicaCount: z.number().int().min(1).max(DATABASE_REPLICAS_MAX),
  ram: z.number().min(0.5),
  cpuCores: z.number().min(0.1),
  storage: z.number().int().min(1).max(DATABASE_STORAGE_MAX),
})

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
  databaseConfigurations: z.array(databaseConfigurationSchema),
})

export const projectSettingsSchema = z.object({
  description: projectDescriptionSchema,
  machineConfiguration: machineConfigurationSchema,
  commentPermission: overlayCommentPermissionSchema.optional(),
})
