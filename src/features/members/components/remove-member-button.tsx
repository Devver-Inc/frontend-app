import { UserMinus } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useRemoveMember } from "@/features/members/hooks/use-remove-member"
import type { User } from "@/features/users/types/user.types"

export function RemoveMemberButton({ member }: { member: User }) {
  const removeMember = useRemoveMember()
  const label = member.name ?? member.email ?? "this member"

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Remove ${label}`}>
          <UserMinus />
        </Button>
      }
      title="Remove this member?"
      description={`${label} loses access to the organization and its projects. You can invite them again later.`}
      actionLabel="Remove member"
      onConfirm={() =>
        removeMember.mutate(member.id, {
          onSuccess: () => toast.success("Member removed."),
        })
      }
    />
  )
}
