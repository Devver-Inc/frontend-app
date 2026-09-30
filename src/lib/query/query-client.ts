import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError, getErrorMessage } from "@/lib/api/api-error"

declare module "@tanstack/react-query" {
  interface Register {
    // Toast shown when the request fails without a message of its own.
    queryMeta: { errorMessage?: string }
    mutationMeta: { errorMessage?: string }
  }
}

const ERROR_TOAST_DEDUPE_MS = 5_000
const lastErrorToastAt = new Map<string, number>()

// Several requests often fail for the same reason (expired session, API
// down): one toast is enough.
const toastErrorOnce = (message: string) => {
  const now = Date.now()
  if (now - (lastErrorToastAt.get(message) ?? 0) < ERROR_TOAST_DEDUPE_MS) return
  lastErrorToastAt.set(message, now)
  toast.error(message)
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) =>
        toastErrorOnce(getErrorMessage(error, query.meta?.errorMessage)),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) =>
        toastErrorOnce(getErrorMessage(error, mutation.meta?.errorMessage)),
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.isClientError) &&
          failureCount < 2,
      },
    },
  })
}
