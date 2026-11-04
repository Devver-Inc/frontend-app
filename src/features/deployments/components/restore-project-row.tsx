import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { SettingsRow } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { useRestoreProject } from "@/features/deployments/hooks/use-restore-project"

type RestoreProjectRowProps = {
  projectId: string
  isPodReady: boolean
}

export function RestoreProjectRow({
  projectId,
  isPodReady,
}: RestoreProjectRowProps) {
  const restoreProject = useRestoreProject(projectId)

  const onRestore = () =>
    restoreProject.mutate(undefined, {
      onSuccess: ({ restoredRepos, restoredDeployments }) =>
        toast.success(
          `Restored ${restoredRepos} repositories and ${restoredDeployments} deployments.`
        ),
    })

  return (
    <SettingsRow
      title="Restore repositories and deployments"
      description="Use this after the machine was replaced and lost its state."
    >
      <ConfirmDialog
        trigger={
          <Button
            variant="outline"
            disabled={!isPodReady || restoreProject.isPending}
          >
            {restoreProject.isPending ? "Restoring…" : "Restore project"}
          </Button>
        }
        title="Restore this project?"
        description="Every repository and active deployment is replayed on the machine. Running previews may restart."
        actionLabel="Restore project"
        onConfirm={onRestore}
      />
    </SettingsRow>
  )
}
