import { createFileRoute, redirect } from "@tanstack/react-router"
import { SessionLoader } from "@/features/auth/components/session-loader"
import { authUserQueryOptions } from "@/features/auth/hooks/use-auth-user"

export const Route = createFileRoute("/_protected")({
  // The session lives in the browser: the guard can only run there.
  ssr: false,
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.query(
      authUserQueryOptions(context.auth)
    )
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
        replace: true,
      })
    }
    return { user }
  },
  // Shown at once on the first load, like the Logto session check it waits
  // for.
  pendingComponent: SessionLoader,
  pendingMs: 0,
  pendingMinMs: 0,
})
