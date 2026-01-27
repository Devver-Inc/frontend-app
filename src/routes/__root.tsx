import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { useLogto } from '@logto/react'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import TanStackQueryDevtools from '../lib/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { Footer } from '@/components/_utils/footer'
import { Header } from '@/components/_utils/header'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { signIn, isAuthenticated, isLoading } = useLogto()

  useEffect(() => {
    if (!isAuthenticated) signIn('http://localhost:5173/callback')
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="size-full h-screen grid place-items-center">
        <LoaderCircle size={36} className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
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
