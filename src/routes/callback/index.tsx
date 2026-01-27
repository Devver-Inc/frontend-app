import { useHandleSignInCallback } from '@logto/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
    return <div>Redirecting...</div>
  }

  return null
}
