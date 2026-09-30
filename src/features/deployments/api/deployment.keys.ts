export const deploymentKeys = {
  all: ["deployments"] as const,
  project: (organizationId: string | null, projectId: string) =>
    [...deploymentKeys.all, organizationId, projectId] as const,
  repos: (organizationId: string | null, projectId: string) =>
    [...deploymentKeys.project(organizationId, projectId), "repos"] as const,
  list: (organizationId: string | null, projectId: string) =>
    [...deploymentKeys.project(organizationId, projectId), "list"] as const,
}
