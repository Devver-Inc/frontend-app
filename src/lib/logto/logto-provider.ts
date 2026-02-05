import { UserScope } from '@logto/react'
import type { LogtoConfig } from '@logto/react'

export const config: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
  scopes: [
    'access:api',
    UserScope.Organizations,
    UserScope.Email,
    UserScope.Profile,
  ],
}
