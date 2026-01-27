import type { LogtoConfig } from '@logto/react'

export const config: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
  scopes: ['urn:logto:scope:organizations', 'profile', 'email'],
}
