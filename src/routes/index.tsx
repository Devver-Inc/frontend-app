import { useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { IdTokenClaims } from '@logto/react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, getIdTokenClaims } = useLogto()
  const [user, setUser] = useState<IdTokenClaims>()

  useEffect(() => {
    ;(async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims()
        setUser(claims)
      }
    })()
  }, [getIdTokenClaims, isAuthenticated])

  return <div className="">{JSON.stringify(user, null, 2)}</div>
}
