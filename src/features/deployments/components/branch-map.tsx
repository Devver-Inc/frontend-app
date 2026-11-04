import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { GitFork, Rocket } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DeploymentInspector } from "@/features/deployments/components/deployment-inspector"
import { useControlProcess } from "@/features/deployments/hooks/use-control-process"
import { useDeleteDeployment } from "@/features/deployments/hooks/use-delete-deployment"
import { useDeploymentLogs } from "@/features/deployments/hooks/use-deployment-logs"
import type {
  Deployment,
  DeploymentLogs,
  ProcessAction,
  Repo,
} from "@/features/deployments/types/deployment.types"
import {
  getProcessLabel,
  getProcessTone,
} from "@/features/deployments/utils/deployment-status"
import { spring } from "@/lib/motion"
import { assignLineColors } from "@/lib/utils/line-color"
import type { LineColor } from "@/lib/utils/line-color"
import type { DeployPrefill } from "@/features/deployments/components/deploy-sheet"

const PROCESS_TOASTS: Record<ProcessAction, string> = {
  start: "Deployment started.",
  stop: "Deployment stopped.",
  restart: "Deployment restarted.",
}

type StationProps = {
  deployment: Deployment
  isSelected: boolean
  panelId: string
  onSelect: () => void
}

function Station({ deployment, isSelected, panelId, onSelect }: StationProps) {
  const { branch, process } = deployment
  return (
    <li className="station" data-state={getProcessTone(process?.status)}>
      <button
        type="button"
        className="station-stop cursor-pointer"
        aria-expanded={isSelected}
        aria-controls={panelId}
        onClick={onSelect}
      >
        <span className="station-dot" />
        <span className="min-w-0">
          <span
            className="block truncate font-mono text-[.8125rem] leading-5 font-medium"
            title={branch}
          >
            {branch}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {getProcessLabel(process?.status)}
          </span>
        </span>
      </button>
    </li>
  )
}

type LaneProps = {
  projectId: string
  repo: string
  line: LineColor | undefined
  deployments: Deployment[]
  isPodReady: boolean
  onDeploy: (prefill: DeployPrefill) => void
}

function Lane({
  projectId,
  repo,
  line,
  deployments,
  isPodReady,
  onDeploy,
}: LaneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [logs, setLogs] = useState<{
    deploymentId: string
    lines: DeploymentLogs["logs"]
  } | null>(null)
  const deploymentLogs = useDeploymentLogs(projectId)
  const controlProcess = useControlProcess(projectId)
  const deleteDeployment = useDeleteDeployment(projectId)
  const panelId = `lane-${repo}`
  const inspectorRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Gone after a delete or a refresh: the inspector closes with it.
  const selected = deployments.find(
    ({ deploymentId }) => deploymentId === selectedId
  )

  const onGetLogs = (deploymentId: string) =>
    deploymentLogs.mutate(deploymentId, {
      onSuccess: ({ logs: lines }) => setLogs({ deploymentId, lines }),
    })

  const onProcessAction = (action: ProcessAction, name: string) =>
    controlProcess.mutate(
      { action, name },
      { onSuccess: () => toast.success(PROCESS_TOASTS[action]) }
    )

  const onDelete = (deploymentId: string) =>
    deleteDeployment.mutate(deploymentId, {
      onSuccess: () => toast.success("Deployment deleted."),
    })

  const onRedeploy = (deployment: Deployment) =>
    onDeploy({
      repo: deployment.repo,
      branch: deployment.branch,
      serviceType: deployment.service.api ? "api" : "web",
    })

  return (
    <section
      data-line={line}
      aria-label={`${repo} repository`}
      className="rounded-xl bg-card shadow-control ring-1 ring-border"
    >
      <div className="flex items-center gap-2 py-2 pr-2 pl-4">
        <GitFork
          className="size-3.5 shrink-0 text-line"
          strokeWidth={2}
          aria-hidden
        />
        <h3 className="min-w-0 flex-1 truncate font-medium">{repo}</h3>
        <Button
          variant="ghost"
          size="sm"
          disabled={!isPodReady}
          onClick={() => onDeploy({ repo })}
        >
          <Rocket />
          Deploy branch
        </Button>
      </div>

      {deployments.length === 0 ? (
        <p className="px-4 pb-4 text-muted-foreground">
          No branch deployed from this repository yet.
        </p>
      ) : (
        <div className="px-4 pb-3">
          <ol className="stations" data-layout="map">
            {deployments.map((deployment) => (
              <Station
                key={deployment.deploymentId}
                deployment={deployment}
                isSelected={deployment.deploymentId === selectedId}
                panelId={panelId}
                onSelect={() =>
                  setSelectedId((current) =>
                    current === deployment.deploymentId
                      ? null
                      : deployment.deploymentId
                  )
                }
              />
            ))}
          </ol>
        </div>
      )}

      <div id={panelId}>
        <AnimatePresence initial={false}>
          {selected && (
            <motion.div
              key="inspector"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={spring}
              onAnimationComplete={(definition: { height?: string }) => {
                if (definition.height !== "auto") return
                inspectorRef.current?.scrollIntoView({
                  block: "nearest",
                  behavior: shouldReduceMotion ? "auto" : "smooth",
                })
              }}
              ref={inspectorRef}
              className="scroll-mb-4 overflow-hidden rounded-b-xl"
            >
              <div className="border-t">
                <DeploymentInspector
                  key={selected.deploymentId}
                  deployment={selected}
                  logs={
                    logs?.deploymentId === selected.deploymentId
                      ? logs.lines
                      : undefined
                  }
                  isLogsPending={deploymentLogs.isPending}
                  isProcessPending={controlProcess.isPending}
                  isDeletePending={deleteDeployment.isPending}
                  isPodReady={isPodReady}
                  onGetLogs={onGetLogs}
                  onProcessAction={onProcessAction}
                  onRedeploy={onRedeploy}
                  onDelete={onDelete}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

type BranchMapProps = {
  projectId: string
  repos: Repo[]
  deployments: Deployment[]
  isPodReady: boolean
  onDeploy: (prefill: DeployPrefill) => void
}

// Repositories are lines and deployed branches their stations.
export function BranchMap({
  projectId,
  repos,
  deployments,
  isPodReady,
  onDeploy,
}: BranchMapProps) {
  const names = [
    ...new Set([
      ...repos.map(({ name }) => name),
      ...deployments.map(({ repo }) => repo),
    ]),
  ].sort()
  const lines = assignLineColors(names)

  return (
    <div className="space-y-4">
      {names.map((repo) => (
        <Lane
          key={repo}
          projectId={projectId}
          repo={repo}
          line={lines.get(repo)}
          deployments={deployments.filter(
            (deployment) => deployment.repo === repo
          )}
          isPodReady={isPodReady}
          onDeploy={onDeploy}
        />
      ))}
    </div>
  )
}
