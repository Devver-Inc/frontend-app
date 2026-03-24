import { useHandleSignInCallback, useLogto } from '@logto/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/callback/')({
  component: CallbackRoute,
})

function CallbackRoute() {
  const { isAuthenticated } = useLogto()
  const navigate = useNavigate()

  const { isLoading } = useHandleSignInCallback(() => {
    navigate({ to: '/' })
  })

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/' })
  }, [isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <LoaderCircle size={36} className="animate-spin" />
      </div>
    )
  }

  return null
}
