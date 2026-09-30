import { z } from "zod"

export const REPO_NAME_PATTERN = /^[a-z0-9-]+$/

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
