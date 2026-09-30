import { fetchEventSource } from "@microsoft/fetch-event-source"
import { ApiError } from "@/lib/api/api-error"
import { buildApiUrl } from "@/lib/api/client"
import { authClient } from "@/lib/auth/auth"

export type EventStreamHandlers = {
  onOpen: () => void
  onMessage: (data: string) => void
  // Returns the delay before reconnecting, or throws to close the stream.
  onError: (error: unknown) => number
  onClose: () => void
}

export type EventStreamOptions = EventStreamHandlers & {
  organizationId: string
  signal: AbortSignal
}

// Server-sent events need headers (token, organization), which EventSource
// cannot send: fetch-event-source reads the stream over fetch instead.
export async function openEventStream(
  path: string,
  {
    organizationId,
    signal,
    onOpen,
    onMessage,
    onError,
    onClose,
  }: EventStreamOptions
): Promise<void> {
  const token = await authClient.getAccessToken({ organizationId })
  if (!token) throw new ApiError(401, "UNAUTHORIZED", null)

  await fetchEventSource(buildApiUrl(path).href, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-organization-id": organizationId,
    },
    signal,
    openWhenHidden: true,
    async onopen(response) {
      if (!response.ok) throw await ApiError.fromResponse(response)
      onOpen()
    },
    onmessage: (event) => onMessage(event.data),
    onerror: onError,
    onclose: onClose,
  })
}
