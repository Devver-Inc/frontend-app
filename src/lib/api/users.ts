/**
 * Users API. Backend: POST /users/account, PATCH /users/me (multipart/form-data).
 */

import { apiFetch, apiJson } from './client'

export interface UpdateAccountInput {
  firstName: string
  lastName: string
  profilePictureFile?: File
}

/**
 * Create account for current user (e.g. after first sign-in).
 * Backend: POST /api/v1/users/account
 */
export async function createAccount(): Promise<unknown> {
  return apiJson<unknown>('/users/account', { method: 'POST' })
}

/**
 * Update current user account. Backend: PATCH /api/v1/users/me (multipart/form-data)
 */
export async function updateAccount(input: UpdateAccountInput): Promise<void> {
  const form = new FormData()
  form.append('firstName', input.firstName)
  form.append('lastName', input.lastName)
  if (input.profilePictureFile != null) {
    form.append('profilePictureFile', input.profilePictureFile)
  }

  const res = await apiFetch('/users/me', {
    method: 'PATCH',
    body: form,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Update account failed: ${res.status} ${text}`)
  }
}
