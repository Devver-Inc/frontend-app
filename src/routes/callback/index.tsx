import { useHandleSignInCallback } from '@logto/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/callback/')({
  component: CallbackRoute,
})

function CallbackRoute() {
  const { isLoading, error } = useHandleSignInCallback()

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <LoaderCircle size={36} className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid h-screen place-items-center px-4">
        <div className="page-shell max-w-md space-y-4 px-8 py-10 text-center">
          <h1 className="text-lg font-semibold">Authentication failed</h1>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Link to="/">
            <Button>Return to Devver</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-screen place-items-center px-4">
      <div className="page-shell max-w-md space-y-4 px-8 py-10 text-center">
        <h1 className="text-lg font-semibold">Authentication complete</h1>
        <p className="text-sm text-muted-foreground">
          You can continue to Devver.
        </p>
        <Link to="/">
          <Button>Continue</Button>
        </Link>
      </div>
    </div>
  )
}
