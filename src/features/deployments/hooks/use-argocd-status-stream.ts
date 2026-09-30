import { useEffect, useState } from "react"
import { getArgoCdStatus } from "@/features/deployments/api/get-argocd-status"
import { watchArgoCdStatus } from "@/features/deployments/api/watch-argocd-status"
import { argoCdStatusSchema } from "@/features/deployments/schemas/deployment.schema"
import type { ArgoCdStatus } from "@/features/deployments/types/deployment.types"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { isApiError } from "@/lib/api/api-error"

const RECONNECT_DELAY_MS = 3_000

type StreamState = {
  status: ArgoCdStatus | null
  isConnected: boolean
  lastEventAt: string | null
}

const INITIAL_STATE: StreamState = {
  status: null,
  isConnected: false,
  lastEventAt: null,
}

// Reconnecting cannot fix a refused access.
const isAccessError = (error: unknown) =>
  isApiError(error, 401) || isApiError(error, 403)

const parseStatus = (data: string): ArgoCdStatus | null => {
  try {
    const result = argoCdStatusSchema.safeParse(JSON.parse(data))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

const waitFor = (delayMs: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, delayMs)
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout)
        resolve()
      },
      { once: true }
    )
  })

// Live Argo CD status of the project: a snapshot, then server-sent events,
// reopened after a delay whenever the stream drops.
export function useArgoCdStatusStream(projectId: string): StreamState {
  const organizationId = useCurrentOrganizationId()
  const streamKey = `${organizationId}/${projectId}`
  const [stream, setStream] = useState({ key: streamKey, ...INITIAL_STATE })

  useEffect(() => {
    if (!organizationId) return
    const controller = new AbortController()
    const { signal } = controller

    const update = (patch: Partial<StreamState>) =>
      setStream((previous) => ({
        ...(previous.key === streamKey
          ? previous
          : { key: streamKey, ...INITIAL_STATE }),
        ...patch,
      }))
    const receive = (status: ArgoCdStatus) =>
      update({ status, lastEventAt: new Date().toISOString() })

    const run = async () => {
      while (!signal.aborted) {
        try {
          const snapshot = await getArgoCdStatus(
            organizationId,
            projectId,
            signal
          ).catch(() => null)
          if (snapshot) receive(snapshot)

          await watchArgoCdStatus(organizationId, projectId, signal, {
            onOpen: () => update({ isConnected: true }),
            onMessage: (data) => {
              const status = parseStatus(data)
              if (status) receive(status)
              else update({ lastEventAt: new Date().toISOString() })
            },
            onError: (error) => {
              update({ isConnected: false })
              if (isAccessError(error)) throw error
              return RECONNECT_DELAY_MS
            },
            onClose: () => update({ isConnected: false }),
          })
        } catch (error) {
          if (isAccessError(error)) return
          update({ isConnected: false })
        }
        await waitFor(RECONNECT_DELAY_MS, signal)
      }
    }

    void run()
    return () => controller.abort()
  }, [organizationId, projectId, streamKey])

  return stream.key === streamKey ? stream : INITIAL_STATE
}
