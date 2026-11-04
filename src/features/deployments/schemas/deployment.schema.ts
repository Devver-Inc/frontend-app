import { z } from "zod"

export const REPO_NAME_PATTERN = /^[a-z0-9-]+$/
const BRANCH_PATTERN =
  /^(?!\/)(?!.*\.\.)(?!.*\/\/)(?!.*\s)[A-Za-z0-9._/-]{1,120}$/
const COMMIT_PATTERN = /^[0-9a-fA-F]{7,40}$/
const ENV_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

export const DATABASE_ENGINES = ["mongo", "postgres", "redis"] as const
export const SERVICE_TYPES = ["web", "api"] as const
export const PROCESS_ACTIONS = ["start", "stop", "restart"] as const
// In the order the agent runs them.
export const DEPLOY_PHASES = [
  "validation",
  "snapshot",
  "worktree",
  "install",
  "build",
  "process",
  "nginx",
] as const

export const repoSchema = z.object({
  id: z.string(),
  name: z.string(),
  pushUrl: z.string(),
  projectId: z.string(),
  createdAt: z.iso.datetime(),
})

export const repoListSchema = z.array(repoSchema)

const serviceResultSchema = z.object({
  port: z.number(),
  url: z.string(),
})

export const deploymentSchema = z.object({
  deploymentId: z.string(),
  repo: z.string(),
  branch: z.string(),
  commit: z.string(),
  service: z.object({
    web: serviceResultSchema.optional(),
    api: serviceResultSchema.optional(),
  }),
  process: z
    .object({
      name: z.string(),
      pm_id: z.number(),
      // Relayed from PM2 as is: online, stopped, errored, but also transient
      // states (launching, stopping…).
      status: z.string(),
      cpu: z.number(),
      memory: z.number(),
    })
    .nullable(),
})

export const deploymentListSchema = z.array(deploymentSchema)

export const deploymentLogsSchema = z.object({
  logs: z.array(
    z.object({
      service: z.string(),
      level: z.string(),
      message: z.string(),
      timestamp: z.string(),
    })
  ),
})

// Health and sync statuses are Argo CD's (Healthy, Progressing, Synced,
// OutOfSync…), relayed as plain strings.
export const argoCdStatusSchema = z.object({
  appName: z.string(),
  healthStatus: z.string(),
  syncStatus: z.string(),
  operationPhase: z.string().optional(),
  operationMessage: z.string().optional(),
  timestamp: z.string(),
  podReady: z.boolean(),
  applications: z
    .array(
      z.object({
        appName: z.string(),
        type: z.string(),
        healthStatus: z.string(),
        syncStatus: z.string(),
        operationPhase: z.string().optional(),
        operationMessage: z.string().optional(),
      })
    )
    .default([]),
})

export const createRepoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Repository name is required.")
    .regex(
      REPO_NAME_PATTERN,
      "Use lowercase letters, numbers, and hyphens only."
    ),
})

export const deployPhaseEventSchema = z.object({
  phase: z.string(),
  durationMs: z.number(),
})

export const deployCompleteEventSchema = z.object({
  deploymentId: z.string(),
  repo: z.string(),
  branch: z.string(),
  commit: z.string(),
  duration: z.number(),
})

export const deployErrorEventSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    logs: z.string().optional(),
    step: z.string().optional(),
    stage: z.string().optional(),
    rollback: z
      .object({
        attempted: z.boolean(),
        success: z.boolean(),
        message: z.string().optional(),
      })
      .optional(),
  }),
  duration: z.number(),
})

const ENV_LINE_MESSAGE = "Write one KEY=value per line."

const databaseLinkSchema = z.object({
  env: z
    .string()
    .trim()
    .regex(ENV_NAME_PATTERN, "Use letters, numbers, and underscores only."),
  engine: z.enum(DATABASE_ENGINES),
  database: z.string().trim().min(1, "Database name is required."),
})

const optionalCommand = z.string().trim()

export const parseEnvLines = (text: string): Record<string, string> =>
  Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=")
        return [line.slice(0, separator), line.slice(separator + 1)]
      })
  )

export const createDeploymentSchema = z.object({
  repo: z.string().min(1, "Pick a repository."),
  branch: z.string().trim().regex(BRANCH_PATTERN, "Enter a valid branch name."),
  commit: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || COMMIT_PATTERN.test(value),
      "Enter a commit hash of 7 to 40 characters."
    ),
  serviceType: z.enum(SERVICE_TYPES),
  root: z.string().trim(),
  install: optionalCommand,
  skipInstall: z.boolean(),
  build: optionalCommand,
  start: optionalCommand,
  env: z.string().refine(
    (text) =>
      text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith("#"))
        .every(
          (line) =>
            ENV_NAME_PATTERN.test(line.split("=", 1)[0] ?? "") &&
            line.includes("=")
        ),
    ENV_LINE_MESSAGE
  ),
  dbLinks: z
    .array(databaseLinkSchema)
    .refine(
      (links) => new Set(links.map(({ env }) => env)).size === links.length,
      "Each database link needs its own variable."
    ),
})

export const processActionResultSchema = z.object({
  success: z.boolean(),
  name: z.string(),
  action: z.string(),
})

export const gitTokenSchema = z.object({
  token: z.string(),
  pushUrl: z.string(),
})

export const projectDatabaseSchema = z.object({
  name: z.string(),
  sizeOnDisk: z.number().optional(),
  empty: z.boolean().optional(),
  keyCount: z.number().optional(),
  expiringKeyCount: z.number().optional(),
})

export const projectDatabaseListSchema = z.array(projectDatabaseSchema)

export const restoreResultSchema = z.object({
  restoredRepos: z.number(),
  restoredDeployments: z.number(),
})
