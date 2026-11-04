import { zodResolver } from "@hookform/resolvers/zod"
import { GitFork, Trash2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CopyButton } from "@/components/common/copy-button"
import { Field } from "@/components/common/field"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitPushDialog } from "@/features/deployments/components/git-push-dialog"
import { useCreateProjectRepo } from "@/features/deployments/hooks/use-create-project-repo"
import { useDeleteProjectRepo } from "@/features/deployments/hooks/use-delete-project-repo"
import { useProjectRepos } from "@/features/deployments/hooks/use-project-repos"
import { createRepoSchema } from "@/features/deployments/schemas/deployment.schema"
import { formatRelativeDate } from "@/lib/utils/format-date"
import { assignLineColors } from "@/lib/utils/line-color"

type ProjectRepositoriesTabProps = {
  projectId: string
  isPodReady: boolean
}

export function ProjectRepositoriesTab({
  projectId,
  isPodReady,
}: ProjectRepositoriesTabProps) {
  const { data: repos = [] } = useProjectRepos(projectId)
  const createRepo = useCreateProjectRepo(projectId)
  const deleteRepo = useDeleteProjectRepo(projectId)
  const form = useForm({
    resolver: zodResolver(createRepoSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  })
  const lines = assignLineColors(repos.map(({ name }) => name))

  const onCreate = form.handleSubmit((input) =>
    createRepo.mutate(input, {
      onSuccess: () => {
        form.reset()
        toast.success("Repository added.")
      },
    })
  )

  const onDelete = (repoName: string) =>
    deleteRepo.mutate(repoName, {
      onSuccess: () => toast.success("Repository deleted."),
    })

  return (
    <div className="space-y-10">
      <Section
        title="Repositories"
        description="Each one becomes a line on the deployment map."
      >
        <form onSubmit={onCreate} className="flex items-start gap-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="Repository name"
                htmlFor="repo-name"
                // An empty name only disables the button.
                error={
                  field.value.trim() !== ""
                    ? fieldState.error?.message
                    : undefined
                }
                hint={
                  isPodReady
                    ? "Lowercase letters, numbers, and hyphens."
                    : "You can add repositories once the machine is ready."
                }
                className="max-w-sm flex-1"
              >
                <Input {...field} id="repo-name" autoComplete="off" />
              </Field>
            )}
          />
          <Button
            type="submit"
            className="mt-7"
            disabled={
              createRepo.isPending || !form.formState.isValid || !isPodReady
            }
          >
            {createRepo.isPending ? "Adding…" : "Add repository"}
          </Button>
        </form>

        {repos.length > 0 && (
          <RowList>
            {repos.map((repo) => (
              <Row key={repo.id}>
                <div className={ROW_CONTENT}>
                  <GitFork
                    data-line={lines.get(repo.name)}
                    className="size-3.5 shrink-0 text-line"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-medium">{repo.name}</p>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        Added {formatRelativeDate(repo.createdAt)}
                      </p>
                    </div>
                    <p className="flex h-5 items-center gap-1 text-sm text-muted-foreground">
                      <span className="truncate font-mono text-xs">
                        {repo.pushUrl}
                      </span>
                      <CopyButton value={repo.pushUrl} label="Copy push URL" />
                    </p>
                  </div>
                  <GitPushDialog
                    projectId={projectId}
                    repo={repo.name}
                    isPodReady={isPodReady}
                  />
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${repo.name}`}
                        disabled={deleteRepo.isPending || !isPodReady}
                      >
                        <Trash2 />
                      </Button>
                    }
                    title={`Delete ${repo.name}?`}
                    description="Its code and all its deployments are removed. Previews from this repository go offline."
                    actionLabel="Delete repository"
                    onConfirm={() => onDelete(repo.name)}
                  />
                </div>
              </Row>
            ))}
          </RowList>
        )}
      </Section>
    </div>
  )
}
