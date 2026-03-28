export const REPO_NAME_PATTERN = /^[a-z0-9-]+$/

export function isValidRepoName(value: string): boolean {
  return REPO_NAME_PATTERN.test(value)
}
