import { XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive-foreground"
          title="Revoke invitation"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke the invitation for{" "}
            <span className="font-semibold">{invitation.invitee}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => revokeInvitation.mutate(invitation.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Revoke
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
