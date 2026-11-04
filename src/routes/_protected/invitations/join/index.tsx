import { Link, createFileRoute } from "@tanstack/react-router"
import { Logo } from "@/components/common/logo"
import { JoinInvitation } from "@/features/invitations/components/join-invitation"
import { joinInvitationSearchSchema } from "@/features/invitations/schemas/invitation.schema"

export const Route = createFileRoute("/_protected/invitations/join/")({
  validateSearch: joinInvitationSearchSchema,
  component: JoinInvitationPage,
})

function JoinInvitationPage() {
  const { invitationId } = Route.useSearch()

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-12 block w-fit rounded-sm">
          <Logo />
        </Link>
        <JoinInvitation invitationId={invitationId} />
      </div>
    </main>
  )
}
