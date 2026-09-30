import type { z } from "zod"
import type {
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

export type ProjectFilters = Pagination & {
  search?: string
}

export type CreateProjectValues = z.input<typeof createProjectSchema>

export type ProjectSettingsValues = z.input<typeof projectSettingsSchema>

export type CreateProjectInput = {
  name: string
  description?: string
  machineConfiguration: MachineConfiguration
  teamMemberIds: string[]
  overlayAccessControl: { commentPermission: OverlayCommentPermission }
}

export type UpdateProjectInput = {
  description?: string
  machineConfiguration?: MachineConfiguration
  overlayAccessControl?: { commentPermission?: OverlayCommentPermission }
}
