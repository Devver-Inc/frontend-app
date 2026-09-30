import { api } from "@/lib/api/client"

export const deleteProfilePicture = (organizationId: string | null) =>
  api.delete("/users/me/picture", { organizationId })
