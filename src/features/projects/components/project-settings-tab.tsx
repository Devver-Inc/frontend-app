import { useNavigate } from "@tanstack/react-router"
import { Controller } from "react-hook-form"
import { toast } from "sonner"
import { ConfirmByNameDialog } from "@/components/common/confirm-by-name-dialog"
import { SettingsRow } from "@/components/common/section"
import { UnsavedChangesBar } from "@/components/common/unsaved-changes-bar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CommentPermissionRadios } from "@/features/projects/components/comment-permission-radios"
import { ResourceSlider } from "@/features/projects/components/resource-slider"
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project"
import { useProjectSettingsForm } from "@/features/projects/hooks/use-project-settings-form"
import type { Project } from "@/features/projects/types/project.types"
import { RestoreProjectRow } from "@/features/deployments/components/restore-project-row"
import { formatDate, formatDateTime } from "@/lib/utils/format-date"

export function ProjectSettingsTab({
  project,
  isPodReady,
}: {
  project: Project
  isPodReady: boolean
}) {
  const navigate = useNavigate()
  const { form, isDirty, isSaving, save } = useProjectSettingsForm(project)
  const deleteProject = useDeleteProject()
  const creator = project.createdBy?.name ?? project.createdBy?.email

  const onConfirmDelete = () =>
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        toast.success("Project deleted.")
        void navigate({ to: "/projects" })
      },
    })

  return (
    <div>
      <SettingsRow title="Description">
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              aria-label="Description"
              maxLength={256}
              rows={3}
            />
          )}
        />
      </SettingsRow>

      <SettingsRow title="Machine">
        <div className="space-y-5">
          <Controller
            name="machineConfiguration.cpuCores"
            control={form.control}
            render={({ field }) => (
              <ResourceSlider
                id="project-cpu"
                label="CPU"
                unit="cores"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="machineConfiguration.ram"
            control={form.control}
            render={({ field }) => (
              <ResourceSlider
                id="project-ram"
                label="Memory"
                unit="GB"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </SettingsRow>

      <SettingsRow
        title="Comments on previews"
        description="Who can leave feedback on a deployed branch."
      >
        <Controller
          name="commentPermission"
          control={form.control}
          render={({ field }) => (
            <CommentPermissionRadios
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsRow>

      <SettingsRow title="About">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
          {creator && (
            <>
              <dt className="text-muted-foreground">Created by</dt>
              <dd className="truncate font-medium">{creator}</dd>
            </>
          )}
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium">{formatDate(project.createdAt)}</dd>
          <dt className="text-muted-foreground">Last updated</dt>
          <dd className="font-medium">{formatDateTime(project.updatedAt)}</dd>
        </dl>
      </SettingsRow>

      <RestoreProjectRow projectId={project.id} isPodReady={isPodReady} />

      <SettingsRow
        title="Delete project"
        description="Removes its deployments, repositories, and comments for good."
      >
        <ConfirmByNameDialog
          trigger={
            <Button variant="destructive-outline">Delete project</Button>
          }
          title="Delete project"
          name={project.name}
          placeholder="Project name"
          actionLabel="Delete project"
          isPending={deleteProject.isPending}
          onConfirm={onConfirmDelete}
        />
      </SettingsRow>

      <UnsavedChangesBar
        isVisible={isDirty}
        title="Unsaved changes"
        description="Save them to update the project."
      >
        <Button variant="ghost" onClick={() => form.reset()}>
          Discard
        </Button>
        <Button onClick={() => void save()} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </UnsavedChangesBar>
    </div>
  )
}
