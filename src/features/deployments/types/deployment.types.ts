import type { z } from "zod"
import type {
  DATABASE_ENGINES,
  DEPLOY_PHASES,
  PROCESS_ACTIONS,
  argoCdStatusSchema,
  createDeploymentSchema,
  createRepoSchema,
  deployCompleteEventSchema,
  deployErrorEventSchema,
  deployPhaseEventSchema,
  deploymentLogsSchema,
  deploymentSchema,
  gitTokenSchema,
  projectDatabaseSchema,
  repoSchema,
} from "@/features/deployments/schemas/deployment.schema"

export type Repo = z.infer<typeof repoSchema>

export type Deployment = z.infer<typeof deploymentSchema>

export type DeploymentLogs = z.infer<typeof deploymentLogsSchema>

export type ArgoCdStatus = z.infer<typeof argoCdStatusSchema>

export type ArgoCdApplication = ArgoCdStatus["applications"][number]

export type CreateRepoInput = z.output<typeof createRepoSchema>

export type DatabaseEngine = (typeof DATABASE_ENGINES)[number]

export type ProcessAction = (typeof PROCESS_ACTIONS)[number]

export type DeployPhase = (typeof DEPLOY_PHASES)[number]

export type DeployPhaseEvent = z.infer<typeof deployPhaseEventSchema>

export type DeployCompleteEvent = z.infer<typeof deployCompleteEventSchema>

export type DeployErrorEvent = z.infer<typeof deployErrorEventSchema>

export type GitToken = z.infer<typeof gitTokenSchema>

export type ProjectDatabase = z.infer<typeof projectDatabaseSchema>

export type CreateDeploymentValues = z.input<typeof createDeploymentSchema>

type ServiceConfig = {
  root?: string
  install?: string
  skipInstall?: boolean
  build?: string
  start?: string
}

// Exactly one service per deployment.
export type CreateDeploymentInput = {
  repo: string
  branch: string
  commit?: string
  service: { web: ServiceConfig } | { api: ServiceConfig }
  dbLinks?: { env: string; engine: DatabaseEngine; database: string }[]
  env?: Record<string, string>
}
