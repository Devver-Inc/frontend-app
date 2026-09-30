import { Save } from "lucide-react"
import { UnsavedChangesBar } from "@/components/common/unsaved-changes-bar"
import { Button } from "@/components/ui/button"

type ProjectSettingsSaveBarProps = {
  isSaving: boolean
  onSave: () => void
}

export function ProjectSettingsSaveBar({
  isSaving,
  onSave,
}: ProjectSettingsSaveBarProps) {
  return (
    <UnsavedChangesBar
      title="Unsaved project changes"
      description="Save to apply project configuration updates."
    >
      <Button onClick={onSave} disabled={isSaving} className="gap-1.5">
        <Save className="h-4 w-4" />
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </UnsavedChangesBar>
  )
}
