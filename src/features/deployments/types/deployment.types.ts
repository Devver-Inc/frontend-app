import type { z } from "zod"
import type {
  argoCdStatusSchema,
  createRepoSchema,
  deploymentLogsSchema,
  deploymentSchema,
  repoSchema,
} from "@/features/deployments/schemas/deployment.schema"

export type Repo = z.infer<typeof repoSchema>

export type Deployment = z.infer<typeof deploymentSchema>

export type DeploymentLogs = z.infer<typeof deploymentLogsSchema>

export type ArgoCdStatus = z.infer<typeof argoCdStatusSchema>

export type CreateRepoInput = z.output<typeof createRepoSchema>
