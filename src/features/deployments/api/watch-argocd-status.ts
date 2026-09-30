import { openEventStream } from "@/lib/api/event-stream"
import type { EventStreamHandlers } from "@/lib/api/event-stream"

export const watchArgoCdStatus = (
  organizationId: string,
  projectId: string,
  signal: AbortSignal,
  handlers: EventStreamHandlers
) =>
  openEventStream(
    `/projects/${encodeURIComponent(projectId)}/argocd/status/stream`,
    { organizationId, signal, ...handlers }
  )
