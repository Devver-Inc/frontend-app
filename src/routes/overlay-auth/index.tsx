import { createFileRoute } from "@tanstack/react-router"
import { OverlayAuthStatus } from "@/features/overlay-auth/components/overlay-auth-status"
import { useOverlayAuthRelay } from "@/features/overlay-auth/hooks/use-overlay-auth-relay"
import { overlayAuthSearchSchema } from "@/features/overlay-auth/schemas/overlay-auth-search.schema"

// Popup opened by the overlay; also its own Logto redirect URI.
export const Route = createFileRoute("/overlay-auth/")({
  validateSearch: overlayAuthSearchSchema,
  ssr: false,
  component: OverlayAuthPage,
})

function OverlayAuthPage() {
  const message = useOverlayAuthRelay(Route.useSearch())
  return <OverlayAuthStatus message={message} />
}
