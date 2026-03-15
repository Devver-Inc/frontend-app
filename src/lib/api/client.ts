const API_BASE = import.meta.env.VITE_API_BASE_URL

const API_INDICATOR = import.meta.env.VITE_LOGTO_API_INDICATOR ?? API_BASE

export class ApiError extends Error {
  status: number
  details?: unknown
  isUnauthorized: boolean

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.isUnauthorized = status === 401
  }
}

export type ApiClientOptions = {
  getAccessToken: (
    resource?: string,
    organizationId?: string,
  ) => Promise<string | undefined>
  getOrganizationId?: () => string | null
  onUnauthorized?: () => void
}

let getAccessTokenFn:
  | ((
      resource?: string,
      organizationId?: string,
    ) => Promise<string | undefined>)
  | undefined
let getOrganizationIdFn: (() => string | null) | undefined
let onUnauthorizedFn: (() => void) | undefined
let unauthorizedNotifiedAt = 0

export function setApiClientOptions(options: ApiClientOptions) {
  getAccessTokenFn = options.getAccessToken
  getOrganizationIdFn = options.getOrganizationId
  onUnauthorizedFn = options.onUnauthorized
}

async function buildAuthHeaders(
  includeOrganization: boolean,
): Promise<Record<string, string>> {
  if (!getAccessTokenFn) {
    throw new Error('Authentication is initializing. Please retry.')
  }
  const organizationId = includeOrganization
    ? (getOrganizationIdFn?.() ?? undefined)
    : undefined
  const token = getAccessTokenFn
    ? await getAccessTokenFn(API_INDICATOR, organizationId)
    : undefined
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export type ApiRequestBody = FormData | object
type InternalRequestInit = Omit<RequestInit, 'body'> & {
  body?: ApiRequestBody
  _retriedAfter401?: boolean
}
type ApiErrorPayload = {
  message?: string | string[]
  error?: string
}

function buildFetchInit(
  headers: Record<string, string>,
  init: InternalRequestInit,
): RequestInit {
  const { body, ...rest } = init

  if (body instanceof FormData) {
    return {
      ...rest,
      body,
      headers: {
        ...headers,
        ...(init.headers as Record<string, string>),
      },
    }
  }

  if (body != null && typeof body === 'object') {
    headers['Content-Type'] = 'application/json'
  }

  return {
    ...rest,
    body:
      body != null && typeof body === 'object'
        ? JSON.stringify(body)
        : (body as BodyInit | undefined),
    headers: {
      ...headers,
      ...(init.headers as Record<string, string>),
    },
  }
}

async function internalFetch(
  path: string,
  includeOrganization: boolean,
  init: InternalRequestInit = {},
): Promise<Response> {
  const headers = await buildAuthHeaders(includeOrganization)
  const response = await fetch(`${API_BASE}${path}`, buildFetchInit(headers, init))

  if (response.status === 401 && !init._retriedAfter401) {
    return internalFetch(path, includeOrganization, {
      ...init,
      _retriedAfter401: true,
    })
  }

  if (response.status === 401) {
    const now = Date.now()
    if (now - unauthorizedNotifiedAt > 10_000) {
      unauthorizedNotifiedAt = now
      onUnauthorizedFn?.()
    }
  }

  return response
}

function parseApiErrorPayload(text: string): {
  parsed: unknown
  message: string | null
} {
  try {
    const parsed = JSON.parse(text) as ApiErrorPayload
    if (Array.isArray(parsed.message) && parsed.message.length > 0) {
      return { parsed, message: parsed.message.join(', ') }
    }
    if (typeof parsed.message === 'string' && parsed.message.length > 0) {
      return { parsed, message: parsed.message }
    }
    if (typeof parsed.error === 'string' && parsed.error.length > 0) {
      return { parsed, message: parsed.error }
    }
    return { parsed, message: null }
  } catch {
    return { parsed: undefined, message: null }
  }
}

async function internalJson<T>(
  path: string,
  includeOrganization: boolean,
  init: InternalRequestInit = {},
): Promise<T> {
  const res = await internalFetch(path, includeOrganization, init)
  if (!res.ok) {
    const text = await res.text()
    const parsedResult = text ? parseApiErrorPayload(text) : null
    const parsed = parsedResult?.parsed
    let message =
      parsedResult?.message ??
      (text || res.statusText || 'An unexpected server error occurred.')
    if (res.status === 401) {
      message = 'Session expired. Please reconnect.'
    }
    throw new ApiError(res.status, message, parsed)
  }
  return res.json() as Promise<T>
}

export function apiFetch(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
): Promise<Response> {
  return internalFetch(path, true, init)
}

export function apiFetchWithoutOrganization(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
): Promise<Response> {
  return internalFetch(path, false, init)
}

export function apiJson<T>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
): Promise<T> {
  return internalJson<T>(path, true, init)
}

export function apiJsonWithoutOrganization<T>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
): Promise<T> {
  return internalJson<T>(path, false, init)
}
