import { zodResolver } from "@hookform/resolvers/zod"
import { GitBranch, Trash2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCreateProjectRepo } from "@/features/deployments/hooks/use-create-project-repo"
import { useDeleteProjectRepo } from "@/features/deployments/hooks/use-delete-project-repo"
import { useProjectRepos } from "@/features/deployments/hooks/use-project-repos"
import { createRepoSchema } from "@/features/deployments/schemas/deployment.schema"

type ProjectRepositoriesCardProps = {
  projectId: string
  isPodReady: boolean
}

export function ProjectRepositoriesCard({
  projectId,
  isPodReady,
}: ProjectRepositoriesCardProps) {
  const { data: repos = [] } = useProjectRepos(projectId)
  const createRepo = useCreateProjectRepo(projectId)
  const deleteRepo = useDeleteProjectRepo(projectId)
  const form = useForm({
    resolver: zodResolver(createRepoSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  })

  const onCreate = form.handleSubmit((input) =>
    createRepo.mutate(input, {
      onSuccess: () => {
        form.reset()
        toast.success("Repository created.")
      },
    })
  )

  const onDelete = (repoName: string) =>
    deleteRepo.mutate(repoName, {
      onSuccess: () => toast.success("Repository deleted."),
    })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <GitBranch className="h-4 w-4" />
          Repositories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex-1">
                <Input {...field} placeholder="Repository name" />
                {/* An empty name only disables the button. */}
                {fieldState.invalid && field.value.trim() !== "" && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Button
            onClick={() => void onCreate()}
            disabled={
              createRepo.isPending || !form.formState.isValid || !isPodReady
            }
          >
            {createRepo.isPending ? "Creating..." : "Create Repo"}
          </Button>
        </div>

        {!isPodReady && (
          <p className="text-sm text-muted-foreground">
            Creating repositories is available once the project is{" "}
            <span className="font-medium">pod ready</span>.
          </p>
        )}

        {repos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No repositories configured.
          </p>
        ) : (
          <div className="space-y-2">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{repo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {repo.pushUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(repo.name)}
                  disabled={deleteRepo.isPending}
                  className="text-muted-foreground hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
