import { useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { getIdTokenClaims } = useLogto()
  const [profile, setProfile] = useState<any>()

  useEffect(() => {
    getIdTokenClaims().then(setProfile)
  }, [])

  return (
    <pre className="bg-black/20 w-fit mx-auto mt-20 text-sm p-2 rounded-sm">
      {JSON.stringify(profile, null, 2)}
    </pre>
  )
}
