// Stands in for src/lib/auth/logto-auth-client.ts: a signed-in user, no Logto.
const user = {
  id: "u-1",
  username: "camille",
  name: "Camille Moreau",
  email: "camille@northwind.dev",
  picture: null,
}

export const logtoAuthClient = {
  getUser: async () => user,
  getUserProfile: async () => ({
    ...user,
    givenName: "Camille",
    familyName: "Moreau",
    emailVerified: true,
    createdAt: Date.now() - 2e10,
    organizations: [
      {
        id: "org-1",
        name: "Northwind",
        description: "Commerce tools for small teams",
      },
    ],
  }),
  getUserOrganizations: async () => [{ id: "org-1", name: "Northwind" }],
  getAccessToken: async () => "demo",
  clearAccessTokens: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  isSignInCallback: async () => false,
  handleSignInCallback: async () => {},
}
