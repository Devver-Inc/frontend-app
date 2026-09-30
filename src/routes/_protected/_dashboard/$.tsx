import { createFileRoute } from "@tanstack/react-router"
import { NotFoundState } from "@/components/common/not-found-state"

// Unknown URLs get the 404 inside the dashboard, behind the sign-in like every
// page (the root not-found would render outside both).
export const Route = createFileRoute("/_protected/_dashboard/$")({
  component: NotFoundState,
})
