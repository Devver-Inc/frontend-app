import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import { streamDeployment } from "@/features/deployments/api/stream-deployment"
import {
  deployCompleteEventSchema,
  deployErrorEventSchema,
  deployPhaseEventSchema,
} from "@/features/deployments/schemas/deployment.schema"
import type {
  CreateDeploymentInput,
  DeployCompleteEvent,
  DeployErrorEvent,
  DeployPhaseEvent,
} from "@/features/deployments/types/deployment.types"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { getErrorMessage } from "@/lib/api/api-error"

export type DeployRun =
  | { status: "idle" }
  | { status: "running"; phases: DeployPhaseEvent[] }
  | {
      status: "succeeded"
      phases: DeployPhaseEvent[]
      result: DeployCompleteEvent
    }
  | {
      status: "failed"
      phases: DeployPhaseEvent[]
      failure: DeployErrorEvent["error"]
    }

const IDLE: DeployRun = { status: "idle" }

const parseJson = (data: string): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return undefined
  }
}

const getPhases = (run: DeployRun) => (run.status === "idle" ? [] : run.phases)

// One deployment, followed live: the agent reports each phase as it ends. The
// stream is never reopened: reconnecting would deploy the branch a second time.
export function useDeployStream(projectId: string) {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()
  const controllerRef = useRef<AbortController | null>(null)
  const [run, setRun] = useState<DeployRun>(IDLE)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const deploy = useCallback(
    async (input: CreateDeploymentInput) => {
      const controller = new AbortController()
      controllerRef.current = controller
      setRun({ status: "running", phases: [] })

      const fail = (failure: DeployErrorEvent["error"]) =>
        setRun((previous) => ({
          status: "failed",
          phases: getPhases(previous),
          failure,
        }))

      const onMessage = (data: string, event: string) => {
        const payload = parseJson(data)
        if (event === "phase") {
          const phase = deployPhaseEventSchema.safeParse(payload)
          if (!phase.success) return
          setRun((previous) => ({
            status: "running",
            phases: [...getPhases(previous), phase.data],
          }))
        } else if (event === "complete") {
          const result = deployCompleteEventSchema.safeParse(payload)
          if (!result.success) return
          setRun((previous) => ({
            status: "succeeded",
            phases: getPhases(previous),
            result: result.data,
          }))
        } else if (event === "error") {
          const failure = deployErrorEventSchema.safeParse(payload)
          if (failure.success) fail(failure.data.error)
        }
      }

      try {
        await streamDeployment(
          requireOrganizationId(organizationId),
          projectId,
          input,
          controller.signal,
          {
            onOpen: () => undefined,
            onMessage,
            onError: (error) => {
              throw error
            },
            onClose: () => undefined,
          }
        )
      } catch (error) {
        if (controller.signal.aborted) return
        const message = getErrorMessage(
          error,
          "The deployment was interrupted."
        )
        toast.error(message)
        fail({ code: "STREAM_FAILED", message })
      } finally {
        void queryClient.invalidateQueries({
          queryKey: deploymentKeys.list(organizationId, projectId),
        })
      }
    },
    [organizationId, projectId, queryClient]
  )

  const reset = useCallback(() => setRun(IDLE), [])

  return { run, deploy, reset }
}
