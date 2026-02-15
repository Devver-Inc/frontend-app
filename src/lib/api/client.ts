/**
 * Authenticated API client for the backend.
 * Uses Logto access token for the API resource. When an organization is selected,
 * requests the organization token (includes organization_id) so the backend has context.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL

const API_INDICATOR =
  import.meta.env.VITE_LOGTO_API_INDICATOR ?? 'http://localhost:3000/api/v1'

export type ApiClientOptions = {
  /** Logto getAccessToken(resource?, organizationId?) */
  getAccessToken: (
    resource?: string,
    organizationId?: string,
  ) => Promise<string | undefined>
  /** Returns current organization ID so the token includes organization context. */
  getOrganizationId?: () => string | null
}

let getAccessTokenFn: (
  resource?: string,
  organizationId?: string,
) => Promise<string | undefined>
let getOrganizationIdFn: (() => string | null) | undefined

export function setApiClientOptions(options: ApiClientOptions) {
  getAccessTokenFn = options.getAccessToken
  getOrganizationIdFn = options.getOrganizationId
}

async function authHeaders(): Promise<HeadersInit> {
  const organizationId = getOrganizationIdFn?.() ?? undefined
  const token = getAccessTokenFn
    ? await getAccessTokenFn(API_INDICATOR, organizationId ?? undefined)
    : undefined
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/** FormData for multipart, or plain object for JSON body. */
export type ApiRequestBody = FormData | object

export async function apiFetch(
  path: string,
  init: Omit<RequestInit, 'body'> & { body?: ApiRequestBody } = {},
): Promise<Response> {
  const { body, ...rest } = init
  const headers = (await authHeaders()) as Record<string, string>

  if (body instanceof FormData) {
    return fetch(`${API_BASE}${path}`, {
      ...rest,
      body,
      headers: {
        ...headers,
        ...(init.headers as Record<string, string>),
      },
    })
  }

  if (body != null && typeof body === 'object') {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(`${API_BASE}${path}`, {
    ...rest,
    body:
      body != null && typeof body === 'object' && !(body instanceof FormData)
        ? JSON.stringify(body)
        : (body as BodyInit | undefined),
    headers: {
      ...headers,
      ...(init.headers as Record<string, string>),
    },
  })
}

export async function apiJson<T>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
): Promise<T> {
  const res = await apiFetch(path, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}
