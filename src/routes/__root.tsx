import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { useLogto } from '@logto/react'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import TanStackQueryDevtools from '../lib/devtools'
import type { QueryClient } from '@tanstack/react-query'
import { setApiClientOptions } from '@/lib/api/client'
import { useOrganizationContext } from '@/lib/organization/organization-context'

import { DashboardShell } from '@/components/layout/dashboard-shell'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <div>404 - Not Found</div>,
})

function RootComponent() {
  const { signIn, isAuthenticated, isLoading, getAccessToken } = useLogto()
  const { getOrganizationId } = useOrganizationContext()
  const isProd = import.meta.env.PROD

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signIn(import.meta.env.VITE_LOGTO_CALLBACK_URI)
    }
  }, [isLoading, isAuthenticated, signIn])

  useEffect(() => {
    if (isAuthenticated) {
      setApiClientOptions({ getAccessToken, getOrganizationId })
    }
  }, [isAuthenticated, getAccessToken, getOrganizationId])

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)]"
        aria-live="polite"
        aria-label="Loading"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]"
          aria-hidden
        >
          <LoaderCircle size={24} className="animate-spin" />
        </div>
        <p className="text-sm font-medium text-[var(--muted-foreground)]">
          Loading…
        </p>
      </div>
    )
  }

  return (
    <>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
      {isProd === false && (
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
      )}
    </>
  )
}
