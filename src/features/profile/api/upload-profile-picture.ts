import { api } from "@/lib/api/client"

export const uploadProfilePicture = (
  organizationId: string | null,
  file: File
) => {
  const body = new FormData()
  body.append("profilePictureFile", file)
  return api.post("/users/me/picture", { organizationId, body })
}
