import { zodResolver } from "@hookform/resolvers/zod"
import { CircleCheck, CircleX, ExternalLink } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Field } from "@/components/common/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DatabaseLinkFields } from "@/features/deployments/components/database-link-fields"
import { PhaseRail } from "@/features/deployments/components/phase-rail"
import { useProjectDeployments } from "@/features/deployments/hooks/use-project-deployments"
import { useDeployStream } from "@/features/deployments/hooks/use-deploy-stream"
import type { DeployRun } from "@/features/deployments/hooks/use-deploy-stream"
import {
  createDeploymentSchema,
  parseEnvLines,
} from "@/features/deployments/schemas/deployment.schema"
import type {
  CreateDeploymentInput,
  CreateDeploymentValues,
  DatabaseEngine,
  Repo,
} from "@/features/deployments/types/deployment.types"
import { getDeploymentService } from "@/features/deployments/utils/deployment-status"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"
import { formatDuration } from "@/lib/utils/format-duration"

export type DeployPrefill = Partial<
  Pick<CreateDeploymentValues, "repo" | "branch" | "serviceType">
>

// The API rejects empty commands: anything left blank is omitted.
const toDeploymentInput = ({
  repo,
  branch,
  commit,
  serviceType,
  root,
  install,
  skipInstall,
  build,
  start,
  env,
  dbLinks,
}: CreateDeploymentValues): CreateDeploymentInput => {
  const config = {
    ...(root && { root }),
    ...(skipInstall ? { skipInstall } : install && { install }),
    ...(build && { build }),
    ...(start && { start }),
  }
  const variables = parseEnvLines(env)
  return {
    repo,
    branch,
    ...(commit && { commit }),
    service: serviceType === "web" ? { web: config } : { api: config },
    ...(dbLinks.length > 0 && { dbLinks }),
    ...(Object.keys(variables).length > 0 && { env: variables }),
  }
}

type DeployFormProps = {
  repos: Repo[]
  prefill: DeployPrefill
  engines: DatabaseEngine[]
  onCancel: () => void
  onSubmit: (input: CreateDeploymentInput) => void
}

function DeployForm({
  repos,
  prefill,
  engines,
  onCancel,
  onSubmit,
}: DeployFormProps) {
  const form = useForm<CreateDeploymentValues>({
    resolver: zodResolver(createDeploymentSchema),
    defaultValues: {
      repo: prefill.repo ?? repos.at(0)?.name ?? "",
      branch: prefill.branch ?? "",
      commit: "",
      serviceType: prefill.serviceType ?? "web",
      root: "",
      install: "",
      skipInstall: false,
      build: "",
      start: "",
      env: "",
      dbLinks: [],
    },
  })
  const skipInstall = useWatch({ control: form.control, name: "skipInstall" })
  const submit = form.handleSubmit(
    (values) => onSubmit(toDeploymentInput(values)),
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <SheetBody className="space-y-5">
        <Controller
          name="repo"
          control={form.control}
          render={({ field }) => (
            <Field label="Repository" htmlFor="deploy-repo">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="deploy-repo" className="w-full">
                  <SelectValue placeholder="Pick a repository" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map(({ id, name }) => (
                    <SelectItem key={id} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="branch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="Branch"
                htmlFor="deploy-branch"
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="deploy-branch"
                  placeholder="main"
                  autoComplete="off"
                  required
                />
              </Field>
            )}
          />
          <Controller
            name="commit"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="Commit"
                htmlFor="deploy-commit"
                hint="Latest commit if left empty."
                error={fieldState.error?.message}
              >
                <Input {...field} id="deploy-commit" autoComplete="off" />
              </Field>
            )}
          />
        </div>
        <Controller
          name="serviceType"
          control={form.control}
          render={({ field }) => (
            <Field label="Service" htmlFor="deploy-service">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="deploy-service" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Website</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <section className="space-y-4 border-t pt-5">
          <div>
            <h3 className="text-sm font-medium">Build</h3>
            <p className="text-sm text-muted-foreground">All optional.</p>
          </div>
          <Controller
            name="root"
            control={form.control}
            render={({ field }) => (
              <Field label="Root directory" htmlFor="deploy-root">
                <Input
                  {...field}
                  id="deploy-root"
                  placeholder="./apps/web"
                  autoComplete="off"
                />
              </Field>
            )}
          />
          <Controller
            name="skipInstall"
            control={form.control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
                Skip dependency install
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </label>
            )}
          />
          {!skipInstall && (
            <Controller
              name="install"
              control={form.control}
              render={({ field }) => (
                <Field label="Install command" htmlFor="deploy-install">
                  <Input
                    {...field}
                    id="deploy-install"
                    placeholder="npm install"
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          )}
          <Controller
            name="build"
            control={form.control}
            render={({ field }) => (
              <Field label="Build command" htmlFor="deploy-build">
                <Input
                  {...field}
                  id="deploy-build"
                  placeholder="npm run build"
                  autoComplete="off"
                />
              </Field>
            )}
          />
          <Controller
            name="start"
            control={form.control}
            render={({ field }) => (
              <Field label="Start command" htmlFor="deploy-start">
                <Input
                  {...field}
                  id="deploy-start"
                  placeholder="npm run start"
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </section>

        <section className="space-y-4 border-t pt-5">
          <h3 className="text-sm font-medium">Environment</h3>
          <Controller
            name="env"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="Variables"
                htmlFor="deploy-env"
                hint="One KEY=value per line."
                error={fieldState.error?.message}
              >
                <Textarea
                  {...field}
                  id="deploy-env"
                  rows={4}
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono text-sm"
                />
              </Field>
            )}
          />
          {engines.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium">Databases</h4>
              <p className="text-xs text-muted-foreground">
                The variable receives the connection string.
              </p>
              <DatabaseLinkFields control={form.control} engines={engines} />
            </div>
          )}
        </section>
      </SheetBody>
      <SheetFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Deploy</Button>
      </SheetFooter>
    </form>
  )
}

type RunOutcomeProps = {
  run: Extract<DeployRun, { status: "succeeded" | "failed" }>
  previewUrl: string | undefined
}

function RunOutcome({ run, previewUrl }: RunOutcomeProps) {
  if (run.status === "succeeded") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-live" />
        <div className="min-w-0 space-y-3">
          <p className="font-medium">
            Deployed in {formatDuration(run.result.duration)}.
          </p>
          {previewUrl && (
            <Button size="sm" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Open preview
              </a>
            </Button>
          )}
        </div>
      </div>
    )
  }

  const { failure } = run
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
        <CircleX className="mt-0.5 size-5 shrink-0 text-danger" />
        <div className="min-w-0">
          <p className="font-medium">{failure.message}</p>
          {failure.rollback?.attempted && (
            <p className="mt-1 text-sm text-muted-foreground">
              {failure.rollback.success
                ? "The previous version is back online."
                : (failure.rollback.message ??
                  "The previous version could not be restored.")}
            </p>
          )}
        </div>
      </div>
      {failure.logs && (
        <pre className="max-h-72 overflow-auto rounded-lg bg-terminal p-3 font-mono text-xs leading-relaxed text-terminal-foreground">
          {failure.logs}
        </pre>
      )}
    </div>
  )
}

type DeploySheetProps = {
  projectId: string
  repos: Repo[]
  engines: DatabaseEngine[]
  isPodReady: boolean
  isOpen: boolean
  prefill: DeployPrefill
  onOpenChange: (isOpen: boolean) => void
}

// Lives on the project page rather than in a tab: closing the panel or changing
// tab must not cut the stream of a running deployment.
export function DeploySheet({
  projectId,
  repos,
  engines,
  isPodReady,
  isOpen,
  prefill,
  onOpenChange,
}: DeploySheetProps) {
  const { run, deploy, reset } = useDeployStream(projectId)
  const { data: deployments } = useProjectDeployments(projectId, isPodReady)

  useEffect(() => {
    if (run.status === "succeeded") toast.success("Branch deployed.")
    if (run.status === "failed") toast.error("Deployment failed.")
  }, [run.status])

  const deployed =
    run.status === "succeeded"
      ? deployments?.find(
          ({ deploymentId }) => deploymentId === run.result.deploymentId
        )
      : undefined

  const onOpen = (nextOpen: boolean) => {
    if (!nextOpen && run.status !== "running") reset()
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {run.status === "idle" ? "Deploy a branch" : "Deployment"}
          </SheetTitle>
          <SheetDescription>
            {run.status === "running"
              ? "You can close this panel. The deployment keeps running."
              : "Each branch gets its own preview URL."}
          </SheetDescription>
        </SheetHeader>
        {run.status === "idle" ? (
          <DeployForm
            repos={repos}
            prefill={prefill}
            engines={engines}
            onCancel={() => onOpen(false)}
            onSubmit={(input) => void deploy(input)}
          />
        ) : (
          <>
            <SheetBody className="space-y-5">
              <PhaseRail run={run} />
              <div aria-live="polite">
                {run.status !== "running" && (
                  <RunOutcome
                    run={run}
                    previewUrl={deployed && getDeploymentService(deployed)?.url}
                  />
                )}
              </div>
            </SheetBody>
            {run.status !== "running" && (
              <SheetFooter>
                {run.status === "failed" && (
                  <Button variant="outline" onClick={reset}>
                    Edit and retry
                  </Button>
                )}
                <Button onClick={() => onOpen(false)}>Close</Button>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
