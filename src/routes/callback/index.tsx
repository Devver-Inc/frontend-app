import { useHandleSignInCallback, useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/callback/')({
  component: CallbackRoute,
})

function CallbackRoute() {
  const { isAuthenticated } = useLogto()
  const { isLoading } = useHandleSignInCallback(() => {
    window.location.replace('/')
  })

  useEffect(() => {
    if (isAuthenticated) window.location.replace('/')
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="size-full h-screen grid place-items-center">
        <LoaderCircle size={36} className="animate-spin" />
      </div>
    )
  }

  return null
}
