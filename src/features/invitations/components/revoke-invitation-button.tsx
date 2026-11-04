import { X } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useRevokeInvitation } from "@/features/invitations/hooks/use-revoke-invitation"
import type { Invitation } from "@/features/invitations/types/invitation.types"

export function RevokeInvitationButton({
  invitation,
}: {
  invitation: Invitation
}) {
  const revokeInvitation = useRevokeInvitation()

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Revoke invitation for ${invitation.invitee}`}
        >
          <X />
        </Button>
      }
      title="Revoke this invitation?"
      description={`The link sent to ${invitation.invitee} stops working. You can invite them again later.`}
      actionLabel="Revoke invitation"
      onConfirm={() =>
        revokeInvitation.mutate(invitation.id, {
          onSuccess: () => toast.success("Invitation revoked."),
        })
      }
    />
  )
}
