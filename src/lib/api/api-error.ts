import { z } from "zod"

const SESSION_EXPIRED_MESSAGE = "Session expired. Please reconnect."
const SERVER_ERROR_MESSAGE = "An unexpected server error occurred."
const UNKNOWN_ERROR_MESSAGE = "An unexpected error occurred."

// The API answers with codes: those a person can act on get a sentence.
const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_DELETE_ORGANIZATION_WITH_MULTIPLE_MEMBERS:
    "Remove the other members before deleting this organization.",
  CANNOT_TRANSFER_OWNERSHIP_TO_YOURSELF: "You already own this organization.",
  NEW_OWNER_MUST_BE_ADMINISTRATOR:
    "The new owner must be an administrator of this organization.",
  DATABASE_NOT_ENABLED: "This database is not enabled for the project.",
  DATABASE_INSTANCE_UNREACHABLE:
    "The database is not reachable. Check that its pod is running.",
  DATABASES_FETCH_FAILED: "The databases could not be listed. Try again.",
  PROJECT_ACCESS_DENIED: "You are not a member of this project.",
  REPO_NOT_FOUND: "This repository no longer exists.",
  DEPLOYMENT_NOT_FOUND: "This deployment no longer exists.",
  INVALID_REPO_NAME: "Use lowercase letters, numbers, and hyphens only.",
  INVALID_BRANCH_NAME: "This branch name is not valid.",
  INVALID_COMMIT_HASH: "Enter a commit hash of 7 to 40 characters.",
}

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
    super(
      status === 401 ? SESSION_EXPIRED_MESSAGE : (ERROR_MESSAGES[code] ?? code)
    )
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
