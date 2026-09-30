import { UserPlus } from "lucide-react"
import { useState } from "react"
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
import { MemberPicker } from "@/features/members/components/member-picker"
import { useMembers } from "@/features/members/hooks/use-members"
import { useAddProjectMembers } from "@/features/projects/hooks/use-add-project-members"
import type { Project } from "@/features/projects/types/project.types"

export function AddProjectMembersDialog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const addProjectMembers = useAddProjectMembers(project.id)
  const { data: members } = useMembers({ pageSize: 50 })

  const teamMemberIds = new Set(project.teamMembers.map(({ id }) => id))
  const availableMembers = (members?.data ?? []).filter(
    ({ id }) => !teamMemberIds.has(id)
  )

  const onAdd = () =>
    addProjectMembers.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("Members added to project.")
        setOpen(false)
        setSelectedIds([])
      },
    })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          Add Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add team members</DialogTitle>
          <DialogDescription>
            Select organization members to grant project access.
          </DialogDescription>
        </DialogHeader>

        <MemberPicker
          members={availableMembers}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          emptyMessage="No available members to add."
          className="max-h-72 space-y-2 overflow-y-auto pr-1"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onAdd}
            disabled={selectedIds.length === 0 || addProjectMembers.isPending}
          >
            {addProjectMembers.isPending ? "Adding..." : "Add Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
