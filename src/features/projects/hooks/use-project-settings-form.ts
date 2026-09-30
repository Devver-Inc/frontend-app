import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { useUpdateProject } from "@/features/projects/hooks/use-update-project"
import {
  MACHINE_RESOURCE_MAX,
  MACHINE_RESOURCE_MIN,
  projectSettingsSchema,
} from "@/features/projects/schemas/project.schema"
import type {
  Project,
  ProjectSettingsValues,
} from "@/features/projects/types/project.types"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"

const clampMachineResource = (value: number) =>
  Math.max(MACHINE_RESOURCE_MIN, Math.min(MACHINE_RESOURCE_MAX, value))

const toFormValues = (project: Project): ProjectSettingsValues => ({
  description: project.description ?? "",
  machineConfiguration: {
    cpuCores: clampMachineResource(project.machineConfiguration.cpuCores),
    ram: clampMachineResource(project.machineConfiguration.ram),
  },
  commentPermission: project.overlayAccessControl.commentPermission,
})

// The configuration card and the save bar sit apart on the project page:
// the page owns the form and hands it to both.
export function useProjectSettingsForm(project: Project) {
  const updateProject = useUpdateProject(project.id)
  const savedValues = useMemo(() => toFormValues(project), [project])
  const form = useForm({
    resolver: zodResolver(projectSettingsSchema),
    values: savedValues,
  })
  const [description, cpuCores, ram, commentPermission] = useWatch({
    control: form.control,
    name: [
      "description",
      "machineConfiguration.cpuCores",
      "machineConfiguration.ram",
      "commentPermission",
    ],
  })

  const isDirty =
    description.trim() !== savedValues.description ||
    cpuCores !== savedValues.machineConfiguration.cpuCores ||
    ram !== savedValues.machineConfiguration.ram ||
    commentPermission !== savedValues.commentPermission

  const save = form.handleSubmit(
    (input) =>
      updateProject.mutate(
        {
          description: input.description || undefined,
          machineConfiguration: input.machineConfiguration,
          overlayAccessControl: { commentPermission: input.commentPermission },
        },
        { onSuccess: () => toast.success("Project updated successfully.") }
      ),
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return { form, isDirty, isSaving: updateProject.isPending, save }
}
