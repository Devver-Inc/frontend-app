import { createFileRoute } from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { FullScreenLoader } from "@/components/common/full-screen-loader"
import { AuthCallbackCard } from "@/features/auth/components/auth-callback-card"
import { authKeys } from "@/features/auth/hooks/use-auth-user"
import { getErrorMessage } from "@/lib/api/api-error"

// Logto redirect URI (VITE_LOGTO_CALLBACK_URI).
export const Route = createFileRoute("/callback/")({
  ssr: false,
  beforeLoad: async ({ context }) => {
    const url = window.location.href
    if (!(await context.auth.isSignInCallback(url))) return
    // Logto then navigates to the page that asked for the sign-in.
    await context.auth.handleSignInCallback(url)
    await context.queryClient.invalidateQueries({ queryKey: authKeys.all })
  },
  pendingComponent: FullScreenLoader,
  pendingMs: 0,
  pendingMinMs: 0,
  errorComponent: CallbackError,
  component: CallbackComplete,
})

function CallbackComplete() {
  return (
    <AuthCallbackCard
      title="Authentication complete"
      description="You can continue to Devver."
      actionLabel="Continue"
    />
  )
}

function CallbackError({ error }: ErrorComponentProps) {
  return (
    <AuthCallbackCard
      title="Authentication failed"
      description={getErrorMessage(error)}
      actionLabel="Return to Devver"
    />
  )
}
