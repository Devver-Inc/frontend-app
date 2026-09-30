export type AuthUser = {
  id: string
  username: string | null
  name: string | null
  email: string | null
  picture: string | null
}

export type UserOrganization = {
  id: string
  name: string
}

export type UserProfile = {
  id: string
  username: string | null
  name: string | null
  givenName: string | null
  familyName: string | null
  email: string | null
  emailVerified: boolean
  picture: string | null
  createdAt: number | null
  organizations: Array<UserOrganization & { description: string | null }>
}

export type AccessTokenOptions = {
  organizationId?: string | null
  // Defaults to the Devver API.
  resource?: string
}

export type SignInOptions = {
  // Path or URL to land on once signed in.
  redirectTo: string
  // Redirect URI that finishes the flow; defaults to /callback.
  callbackUrl?: string
  keepTokens?: boolean
}

export interface AuthClient {
  getUser: () => Promise<AuthUser | null>
  getUserProfile: () => Promise<UserProfile>
  getUserOrganizations: () => Promise<UserOrganization[]>
  getAccessToken: (options?: AccessTokenOptions) => Promise<string | null>
  clearAccessTokens: () => Promise<void>
  signIn: (options: SignInOptions) => Promise<void>
  signOut: () => Promise<void>
  isSignInCallback: (url: string) => Promise<boolean>
  handleSignInCallback: (url: string) => Promise<void>
}
