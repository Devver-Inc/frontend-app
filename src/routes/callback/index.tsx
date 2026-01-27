import { useHandleSignInCallback } from '@logto/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/callback/')({
  component: CallbackRoute,
})

function CallbackRoute() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, error } = useHandleSignInCallback()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/' })
    } else if (!isLoading && error) {
      console.error('Authentication error:', error)
      navigate({ to: '/' })
    }
  }, [isLoading, isAuthenticated, error, navigate])

  if (isLoading) {
    return (
      <div className="size-full h-screen grid place-items-center">
        <LoaderCircle size={36} className="animate-spin" />
      </div>
    )
  }

  return null
}
