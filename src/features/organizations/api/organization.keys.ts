export const organizationKeys = {
  all: ["organizations"] as const,
  mine: () => [...organizationKeys.all, "mine"] as const,
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (organizationId: string | null) =>
    [...organizationKeys.details(), organizationId] as const,
  governance: (organizationId: string | null) =>
    [...organizationKeys.all, "governance", organizationId] as const,
}
