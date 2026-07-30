import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { useLogto } from '@logto/react'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import TanStackQueryDevtools from '../lib/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { setApiClientOptions } from '@/lib/api/client'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { useLoadOrganizationsFromToken } from '@/lib/auth/useUserOrganizations'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <div>404 - Not Found</div>,
})

const BARE_ROUTES = new Set([
  '/callback',
  '/callback/',
  '/invitations/join',
  '/invitations/join/',
  '/overlay-auth',
  '/overlay-auth/',
])

const AUTH_FLOW_ROUTES = new Set([
  '/callback',
  '/callback/',
  '/overlay-auth',
  '/overlay-auth/',
])

function RootComponent() {
  const { signIn, isAuthenticated, isLoading, getAccessToken } = useLogto()
  const { getOrganizationId } = useOrganizationContext()
  const isProd = import.meta.env.PROD

  const routerState = useRouterState()
  const isBareRoute = BARE_ROUTES.has(routerState.location.pathname)
  const isAuthFlowRoute = AUTH_FLOW_ROUTES.has(routerState.location.pathname)

  const getAccessTokenRef = useRef(getAccessToken)
  getAccessTokenRef.current = getAccessToken
  const unauthorizedInProgressRef = useRef(false)

  useEffect(() => {
    // Never redirect to Logto from the OAuth callback route: the SDK must finish
    // exchanging the code first; otherwise each navigation starts a new sign-in (loop).
    if (!isLoading && !isAuthenticated && !isAuthFlowRoute) {
      void signIn({
        redirectUri: import.meta.env.VITE_LOGTO_CALLBACK_URI,
        postRedirectUri: new URL(
          routerState.location.href,
          globalThis.location.origin,
        ),
      })
    }
  }, [
    isLoading,
    isAuthenticated,
    isAuthFlowRoute,
    routerState.location.href,
    signIn,
  ])

  if (isAuthenticated) {
    setApiClientOptions({
      getAccessToken: (...args) => getAccessTokenRef.current(...args),
      getOrganizationId,
      onUnauthorized: () => {
        if (unauthorizedInProgressRef.current) return
        unauthorizedInProgressRef.current = true
        void signIn({
          redirectUri: import.meta.env.VITE_LOGTO_CALLBACK_URI,
          postRedirectUri: new URL(
            routerState.location.href,
            globalThis.location.origin,
          ),
        })
      },
    })
  }

  useLoadOrganizationsFromToken()

  if (isLoading && !isAuthenticated) {
    return (
      <div className="grid h-screen place-items-center bg-background">
        <LoaderCircle
          size={36}
          className="animate-spin text-muted-foreground"
        />
      </div>
    )
  }

  return (
    <>
      {isBareRoute ? (
        <Outlet />
      ) : (
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      )}
      <Toaster richColors position="bottom-right" />
      {isProd === false && (
        <TanStackDevtools
          config={{ position: 'bottom-left' }}
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
