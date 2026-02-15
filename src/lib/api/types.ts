/**
 * Shared API types aligned with backend DTOs.
 */

export interface PaginationMeta {
  currentPage: number
  totalItemsCount: number
  totalPagesCount: number
  itemsPerPage: number
}

export interface PaginatedResponse<T> {
  data: T
  meta: PaginationMeta
}

export interface UserLight {
  id: string
  name: string | null
  avatarUrl: string | null
}

export interface MachineConfiguration {
  cpuCores: number
  ram: number
  storage: number
}

export interface AccessControl {
  requireEmailAuth: boolean
  publicAccess: boolean
  restrictToTeamMembers: boolean
}
