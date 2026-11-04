import { DEPLOY_PHASES } from "@/features/deployments/schemas/deployment.schema"
import type { DeployRun } from "@/features/deployments/hooks/use-deploy-stream"
import type {
  DeployPhase,
  DeployPhaseEvent,
} from "@/features/deployments/types/deployment.types"
import { formatDuration } from "@/lib/utils/format-duration"

const PHASE_LABELS: Record<DeployPhase, string> = {
  validation: "Check the request",
  snapshot: "Save the current version",
  worktree: "Check out the code",
  install: "Install dependencies",
  build: "Build",
  process: "Start the app",
  nginx: "Publish the preview",
}

type PhaseState = "done" | "active" | "failed" | "skipped" | "pending"

const PHASE_STATE_LABELS: Partial<Record<PhaseState, string>> = {
  active: "In progress",
  failed: "Failed",
  skipped: "Skipped",
}

// The agent reports a phase when it ends, and skips some: a gap before the
// latest report was skipped, and the phase after it is the one running.
const getPhaseState = (
  phase: DeployPhase,
  index: number,
  run: Exclude<DeployRun, { status: "idle" }>,
  reports: Map<string, DeployPhaseEvent>
): PhaseState => {
  if (reports.has(phase)) return "done"
  const lastIndex = Math.max(
    -1,
    ...DEPLOY_PHASES.map((name, i) => (reports.has(name) ? i : -1))
  )
  if (index < lastIndex) return "skipped"
  if (run.status === "succeeded") return "skipped"
  if (index > lastIndex + 1) return "pending"
  return run.status === "failed" ? "failed" : "active"
}

export function PhaseRail({
  run,
}: {
  run: Exclude<DeployRun, { status: "idle" }>
}) {
  const reports = new Map(run.phases.map((report) => [report.phase, report]))

  return (
    <ol className="stations" data-layout="route" aria-label="Deployment steps">
      {DEPLOY_PHASES.map((phase, index) => {
        const state = getPhaseState(phase, index, run, reports)
        const duration = reports.get(phase)?.durationMs
        return (
          <li
            key={phase}
            className="station"
            data-phase={state}
            aria-current={state === "active" ? "step" : undefined}
          >
            <div className="station-stop">
              <span className="station-dot" />
              <span className="flex min-w-0 items-baseline justify-between gap-4">
                <span
                  className={
                    state === "pending" || state === "skipped"
                      ? "font-medium text-muted-foreground"
                      : "font-medium"
                  }
                >
                  {PHASE_LABELS[phase]}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {duration === undefined
                    ? PHASE_STATE_LABELS[state]
                    : formatDuration(duration)}
                </span>
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
