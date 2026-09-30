import { Link, createFileRoute } from "@tanstack/react-router"
import { JoinInvitationCard } from "@/features/invitations/components/join-invitation-card"
import { joinInvitationSearchSchema } from "@/features/invitations/schemas/invitation.schema"

export const Route = createFileRoute("/_protected/invitations/join/")({
  validateSearch: joinInvitationSearchSchema,
  component: JoinInvitationPage,
})

function JoinInvitationPage() {
  const { invitationId } = Route.useSearch()

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link
          to="/"
          className="mx-auto mb-6 flex w-fit items-center gap-1 text-foreground"
        >
          <img src="/favicon.png" alt="" className="h-7 w-7" />
          <span className="text-xl font-bold tracking-widest">DEVVER</span>
        </Link>
        <JoinInvitationCard invitationId={invitationId} />
      </div>
    </main>
  )
}
