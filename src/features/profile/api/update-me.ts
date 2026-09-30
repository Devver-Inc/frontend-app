import type { UpdateMeInput } from "@/features/profile/types/profile.types"
import { api } from "@/lib/api/client"

export const updateMe = (organizationId: string | null, input: UpdateMeInput) =>
  api.patch("/users/me", { organizationId, body: input })
