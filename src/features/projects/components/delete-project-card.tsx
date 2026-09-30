import { useNavigate } from "@tanstack/react-router"
import { AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmByNameDialog } from "@/components/common/confirm-by-name-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project"
import type { Project } from "@/features/projects/types/project.types"

export function DeleteProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()

  const onConfirm = () =>
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        toast.success("Project deleted.")
        void navigate({ to: "/projects" })
      },
    })

  return (
    <Card className="border-destructive/35">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Deleting this project will permanently remove its deployments, members
          assignment and all related data.
        </p>
        <ConfirmByNameDialog
          trigger={
            <Button variant="destructive" size="sm" className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              Delete Project
            </Button>
          }
          title="Delete Project"
          name={project.name}
          placeholder={project.name}
          actionLabel="Delete Project"
          isPending={deleteProject.isPending}
          onConfirm={onConfirm}
        />
      </CardContent>
    </Card>
  )
}
