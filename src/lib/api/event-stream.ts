import { fetchEventSource } from "@microsoft/fetch-event-source"
import { ApiError } from "@/lib/api/api-error"
import { buildApiUrl } from "@/lib/api/client"
import { authClient } from "@/lib/auth/auth"

export type EventStreamHandlers = {
  onOpen: () => void
  // `event` is the name of the server-sent event, empty for plain messages.
  onMessage: (data: string, event: string) => void
  // Returns the delay before reconnecting, or throws to close the stream.
  onError: (error: unknown) => number
  onClose: () => void
}

export type EventStreamOptions = EventStreamHandlers & {
  organizationId: string
  signal: AbortSignal
  // Sent as JSON, with POST instead of GET.
  body?: unknown
}

// Server-sent events need headers (token, organization), which EventSource
// cannot send: fetch-event-source reads the stream over fetch instead.
export async function openEventStream(
  path: string,
  {
    organizationId,
    signal,
    body,
    onOpen,
    onMessage,
    onError,
    onClose,
  }: EventStreamOptions
): Promise<void> {
  const token = await authClient.getAccessToken({ organizationId })
  if (!token) throw new ApiError(401, "UNAUTHORIZED", null)

  await fetchEventSource(buildApiUrl(path).href, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-organization-id": organizationId,
      ...(body !== undefined && { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    openWhenHidden: true,
    async onopen(response) {
      if (!response.ok) throw await ApiError.fromResponse(response)
      onOpen()
    },
    onmessage: (event) => onMessage(event.data, event.event),
    onerror: onError,
    onclose: onClose,
  })
}
