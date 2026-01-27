/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGTO_ENDPOINT: string
  readonly VITE_LOGTO_APP_ID: string
  readonly VITE_LOGTO_CALLBACK_URI: string
  readonly VITE_LOGTO_SIGN_OUT_URI: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
