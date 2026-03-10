const API_BASE = import.meta.env.VITE_API_BASE_URL

const API_INDICATOR =
  import.meta.env.VITE_LOGTO_API_INDICATOR ?? API_BASE

export type ApiClientOptions = {
  getAccessToken: (
    resource?: string,
    organizationId?: string,
  ) => Promise<string | undefined>
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

async function buildAuthHeaders(
  includeOrganization: boolean,
): Promise<Record<string, string>> {
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

function buildFetchInit(
  headers: Record<string, string>,
  init: Omit<RequestInit, 'body'> & { body?: ApiRequestBody },
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
  init: Omit<RequestInit, 'body'> & { body?: ApiRequestBody } = {},
): Promise<Response> {
  const headers = await buildAuthHeaders(includeOrganization)
  return fetch(`${API_BASE}${path}`, buildFetchInit(headers, init))
}

async function internalJson<T>(
  path: string,
  includeOrganization: boolean,
  init: Omit<RequestInit, 'body'> & { body?: ApiRequestBody } = {},
): Promise<T> {
  const res = await internalFetch(path, includeOrganization, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
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
