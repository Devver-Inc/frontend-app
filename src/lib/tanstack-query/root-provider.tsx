import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          const msg = error instanceof Error ? error.message : ''
          if (msg.includes('401') || msg.includes('403') || msg.includes('500'))
            return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: Readonly<{
  children: React.ReactNode
  queryClient: QueryClient
}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
