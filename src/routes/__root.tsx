import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { useLogto } from '@logto/react'
import { useEffect } from 'react'
import TanStackQueryDevtools from '../lib/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { signIn, signOut, isAuthenticated } = useLogto()

  useEffect(() => {
    if (!isAuthenticated) signIn('http://localhost:5173/callback')
  }, [isAuthenticated])

  return (
    <>
      {isAuthenticated && (
        <Button onClick={() => signOut('http://localhost:5173/')}>
          Se deconnecter
        </Button>
      )}
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  )
}
