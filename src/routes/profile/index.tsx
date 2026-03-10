import { useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { getIdTokenClaims } = useLogto()
  const [profile, setProfile] = useState<Record<string, unknown>>()

  useEffect(() => {
    getIdTokenClaims().then(setProfile)
  }, [getIdTokenClaims])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
        Profile
      </h1>
      {profile && (
        <pre className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-800">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </div>
  )
}
