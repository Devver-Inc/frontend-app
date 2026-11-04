import type { z } from "zod"
import type {
  DATABASE_TYPES,
  createProjectSchema,
  overlayCommentPermissionSchema,
  projectSchema,
  projectSettingsSchema,
  projectSummarySchema,
} from "@/features/projects/schemas/project.schema"
import type { Pagination } from "@/types/pagination.types"

export type ProjectSummary = z.infer<typeof projectSummarySchema>

export type Project = z.infer<typeof projectSchema>

export type OverlayCommentPermission = z.infer<
  typeof overlayCommentPermissionSchema
>

export type MachineConfiguration = Project["machineConfiguration"]

export type DatabaseType = (typeof DATABASE_TYPES)[number]

export type DatabaseConfiguration = Project["databaseConfigurations"][number]

export type ProjectFilters = Pagination & {
  search?: string
  sortBy?: "name" | "createdAt" | "updatedAt"
  sortDirection?: "ASC" | "DESC"
}

export type CreateProjectValues = z.input<typeof createProjectSchema>

export type ProjectSettingsValues = z.input<typeof projectSettingsSchema>

export type CreateProjectInput = {
  name: string
  description?: string
  machineConfiguration: MachineConfiguration
  teamMemberIds: string[]
  overlayAccessControl: { commentPermission: OverlayCommentPermission }
  databaseConfigurations?: CreateProjectValues["databaseConfigurations"]
}

export type UpdateProjectInput = {
  description?: string
  machineConfiguration?: MachineConfiguration
  overlayAccessControl?: { commentPermission?: OverlayCommentPermission }
}
