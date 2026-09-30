import { z } from "zod"

const SESSION_EXPIRED_MESSAGE = "Session expired. Please reconnect."
const SERVER_ERROR_MESSAGE = "An unexpected server error occurred."
const UNKNOWN_ERROR_MESSAGE = "An unexpected error occurred."

// NestJS error body: `message` is the error code, or the list of validation
// errors.
const errorBodySchema = z
  .object({
    message: z.union([z.string(), z.array(z.string())]),
    error: z.string(),
  })
  .partial()

const parseBody = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

const readCode = (body: unknown): string | undefined => {
  const parsed = errorBodySchema.safeParse(body)
  if (!parsed.success) return undefined
  const { message, error } = parsed.data
  if (Array.isArray(message)) {
    if (message.length > 0) return message.join(", ")
  } else if (message) {
    return message
  }
  return error || undefined
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly body: unknown

  constructor(status: number, code: string, body: unknown) {
    super(status === 401 ? SESSION_EXPIRED_MESSAGE : code)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.body = body
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const text = await response.text().catch(() => "")
    const body = parseBody(text)
    const code =
      readCode(body) ?? (text || response.statusText || SERVER_ERROR_MESSAGE)
    return new ApiError(response.status, code, body)
  }
}

export const isApiError = (
  error: unknown,
  status?: number
): error is ApiError =>
  error instanceof ApiError && (status === undefined || error.status === status)

export const getErrorMessage = (
  error: unknown,
  fallback = UNKNOWN_ERROR_MESSAGE
): string => (error instanceof Error && error.message) || fallback
