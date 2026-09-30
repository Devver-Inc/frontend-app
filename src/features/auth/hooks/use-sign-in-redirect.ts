import { useEffect, useRef } from "react"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"

// Sends the browser to the Logto sign-in page, which brings it back to
// `redirectTo`. Started from a component, not a guard: route preloads (link
// hover) must not leave the page.
export function useSignInRedirect(redirectTo: string) {
  const auth = useAuthClient()
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    void auth.signIn({ redirectTo })
  }, [auth, redirectTo])
}
