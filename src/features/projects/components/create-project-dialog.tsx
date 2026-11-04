import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Field } from "@/components/common/field"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MemberPicker } from "@/features/members/components/member-picker"
import { useMembers } from "@/features/members/hooks/use-members"
import { CommentPermissionRadios } from "@/features/projects/components/comment-permission-radios"
import { DatabaseConfigFields } from "@/features/projects/components/database-config-fields"
import { ResourceSlider } from "@/features/projects/components/resource-slider"
import { useCreateProject } from "@/features/projects/hooks/use-create-project"
import { createProjectSchema } from "@/features/projects/schemas/project.schema"
import type { CreateProjectValues } from "@/features/projects/types/project.types"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"

const DEFAULT_VALUES: CreateProjectValues = {
  name: "",
  description: "",
  machineConfiguration: { cpuCores: 1, ram: 1 },
  teamMemberIds: [],
  commentPermission: "email_required",
  databaseConfigurations: [],
}

function FormGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-t pt-5">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export function CreateProjectDialog({
  size = "default",
}: {
  size?: "default" | "sm"
}) {
  const [open, setOpen] = useState(false)
  const createProject = useCreateProject()
  const { data: members } = useMembers({ pageSize: 50 })
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const name = useWatch({ control: form.control, name: "name" })

  const onSubmit = form.handleSubmit(
    ({ description, commentPermission, databaseConfigurations, ...input }) =>
      createProject.mutate(
        {
          ...input,
          description: description || undefined,
          overlayAccessControl: { commentPermission },
          ...(databaseConfigurations.length > 0 && { databaseConfigurations }),
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            toast.success("Project created.")
          },
        }
      ),
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={size}>
          <Plus />
          Create project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>Create project</SheetTitle>
            <SheetDescription>
              It gets its own machine, repositories, and previews.
            </SheetDescription>
          </SheetHeader>
          <SheetBody className="space-y-5">
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field label="Name" htmlFor="project-name">
                  <Input
                    {...field}
                    id="project-name"
                    maxLength={128}
                    autoComplete="off"
                    required
                  />
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field label="Description" htmlFor="project-desc">
                  <Textarea
                    {...field}
                    id="project-desc"
                    maxLength={256}
                    rows={2}
                  />
                </Field>
              )}
            />

            <FormGroup title="Machine">
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
            </FormGroup>

            <FormGroup
              title="Databases"
              description="Available to every deployment. You can't add one later."
            >
              <DatabaseConfigFields control={form.control} />
            </FormGroup>

            <FormGroup title="Team">
              <Controller
                name="teamMemberIds"
                control={form.control}
                render={({ field }) => (
                  <MemberPicker
                    members={members?.data ?? []}
                    selectedIds={field.value}
                    onChange={field.onChange}
                    emptyMessage="Invite people to your organization to add them here."
                    className="max-h-56 overflow-y-auto"
                  />
                )}
              />
            </FormGroup>

            <FormGroup title="Comments on previews">
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
            </FormGroup>
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProject.isPending || !name.trim()}
            >
              {createProject.isPending ? "Creating…" : "Create project"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
