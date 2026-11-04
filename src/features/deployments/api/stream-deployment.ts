import type { CreateDeploymentInput } from "@/features/deployments/types/deployment.types"
import { openEventStream } from "@/lib/api/event-stream"
import type { EventStreamHandlers } from "@/lib/api/event-stream"

export const streamDeployment = (
  organizationId: string,
  projectId: string,
  input: CreateDeploymentInput,
  signal: AbortSignal,
  handlers: EventStreamHandlers
) =>
  openEventStream(
    `/projects/${encodeURIComponent(projectId)}/deployments/stream`,
    { organizationId, signal, body: input, ...handlers }
  )
