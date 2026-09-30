import { createFileRoute, redirect } from "@tanstack/react-router"
import { SessionLoader } from "@/features/auth/components/session-loader"
import { authUserQueryOptions } from "@/features/auth/hooks/use-auth-user"
import { useSignInRedirect } from "@/features/auth/hooks/use-sign-in-redirect"
import { authSearchSchema } from "@/features/auth/schemas/auth-search.schema"

// No sign-in form: Logto hosts it. This page only sends the browser there.
export const Route = createFileRoute("/login/")({
  validateSearch: authSearchSchema,
  ssr: false,
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.query(
      authUserQueryOptions(context.auth)
    )
    if (user) throw redirect({ href: search.redirect ?? "/", replace: true })
  },
  component: LoginPage,
})

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch()
  useSignInRedirect(redirectTo ?? "/")
  return <SessionLoader />
}
