import type { z } from "zod"
import { ApiError } from "@/lib/api/api-error"
import { authClient } from "@/lib/auth/auth"
import { env } from "@/lib/env"

type QueryValue = string | number | boolean | null | undefined

export type RequestOptions = {
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
  // Requests an organization token: the API scopes the call to it.
  organizationId?: string | null
}

type ApiMethod = {
  <TSchema extends z.ZodType>(
    path: string,
    options: RequestOptions & { schema: TSchema }
  ): Promise<z.output<TSchema>>
  (path: string, options?: RequestOptions): Promise<void>
}

let isSigningInAgain = false

const signInAgain = () => {
  if (isSigningInAgain) return
  isSigningInAgain = true
  void authClient.signIn({ redirectTo: window.location.href })
}

export const buildApiUrl = (
  path: string,
  query: RequestOptions["query"] = {}
): URL => {
  const url = new URL(`${env.VITE_API_BASE_URL}${path}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== "")
      url.searchParams.set(key, String(value))
  }
  return url
}

async function send(
  method: string,
  path: string,
  options: RequestOptions,
  isRetry = false
): Promise<Response> {
  const { query, body, signal, organizationId } = options
  const headers = new Headers({ Accept: "application/json" })
  const token = await authClient.getAccessToken({ organizationId })
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const isFormData = body instanceof FormData
  // The browser sets the multipart boundary itself.
  if (body !== undefined && !isFormData)
    headers.set("Content-Type", "application/json")

  const response = await fetch(buildApiUrl(path, query), {
    method,
    headers,
    signal,
    body: isFormData || body === undefined ? body : JSON.stringify(body),
  })

  if (response.status !== 401) return response
  // One retry in case the token expired in flight, then the session is gone:
  // back to the Logto sign-in page.
  if (!isRetry) return send(method, path, options, true)
  signInAgain()
  return response
}

const createMethod = (method: string): ApiMethod =>
  (async (
    path: string,
    { schema, ...options }: RequestOptions & { schema?: z.ZodType } = {}
  ) => {
    const response = await send(method, path, options)
    if (!response.ok) throw await ApiError.fromResponse(response)
    return schema ? schema.parse(await response.json()) : undefined
  }) as ApiMethod

export const api = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  put: createMethod("PUT"),
  patch: createMethod("PATCH"),
  delete: createMethod("DELETE"),
}
