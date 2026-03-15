import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

const recentErrorToasts = new Map<string, number>()

function showErrorToastOnce(message: string) {
  const now = Date.now()
  const lastShownAt = recentErrorToasts.get(message) ?? 0
  if (now - lastShownAt < 5000) return
  recentErrorToasts.set(message, now)
  toast.error(message)
}

export function getContext() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        showErrorToastOnce(getErrorMessage(error))
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.options.onError) return
        showErrorToastOnce(getErrorMessage(error))
      },
    }),
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
