import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { MemberPicker } from "@/features/members/components/member-picker"
import { useMembers } from "@/features/members/hooks/use-members"
import { CommentPermissionRadios } from "@/features/projects/components/comment-permission-radios"
import { useCreateProject } from "@/features/projects/hooks/use-create-project"
import {
  MACHINE_RESOURCE_MAX,
  MACHINE_RESOURCE_MIN,
  createProjectSchema,
} from "@/features/projects/schemas/project.schema"
import type { CreateProjectValues } from "@/features/projects/types/project.types"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"

const DEFAULT_VALUES: CreateProjectValues = {
  name: "",
  description: "",
  machineConfiguration: { cpuCores: 1, ram: 1 },
  teamMemberIds: [],
  commentPermission: "email_required",
}

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const createProject = useCreateProject()
  const { data: members } = useMembers({ pageSize: 50 })
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const name = useWatch({ control: form.control, name: "name" })

  const onSubmit = form.handleSubmit(
    ({ description, commentPermission, ...input }) =>
      createProject.mutate(
        {
          ...input,
          description: description || undefined,
          overlayAccessControl: { commentPermission },
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            toast.success("Project created successfully.")
          },
        }
      ),
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project in your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    {...field}
                    id="project-name"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="project-desc">Description</Label>
                  <Textarea
                    {...field}
                    id="project-desc"
                    placeholder="What is this project about?"
                    rows={3}
                  />
                </div>
              )}
            />
            <div className="space-y-2">
              <Label>Machine configuration</Label>
              <div className="space-y-4 rounded-md border border-border/60 p-3">
                <Controller
                  name="machineConfiguration.cpuCores"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="project-cpu">CPU Cores</Label>
                        <span className="text-xs text-muted-foreground">
                          {field.value.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        id="project-cpu"
                        min={MACHINE_RESOURCE_MIN}
                        max={MACHINE_RESOURCE_MAX}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </div>
                  )}
                />
                <Controller
                  name="machineConfiguration.ram"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="project-ram">RAM (GB)</Label>
                        <span className="text-xs text-muted-foreground">
                          {field.value.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        id="project-ram"
                        min={MACHINE_RESOURCE_MIN}
                        max={MACHINE_RESOURCE_MAX}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </div>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="project-storage-future">Storage (GB)</Label>
                  <Input
                    id="project-storage-future"
                    value="Coming soon"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    Storage configuration will be available in a future release.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign team members</Label>
              <Controller
                name="teamMemberIds"
                control={form.control}
                render={({ field }) => (
                  <MemberPicker
                    members={members?.data ?? []}
                    selectedIds={field.value}
                    onChange={field.onChange}
                    emptyMessage="No organization members available."
                    className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-border/60 p-2"
                  />
                )}
              />
            </div>

            <Controller
              name="commentPermission"
              control={form.control}
              render={({ field }) => (
                <CommentPermissionRadios
                  value={field.value}
                  onChange={field.onChange}
                  groupClassName="rounded-md border border-border/60 p-3"
                />
              )}
            />
          </div>
          <DialogFooter className="mt-6">
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
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
