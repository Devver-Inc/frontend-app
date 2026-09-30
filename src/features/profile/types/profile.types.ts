import type { z } from "zod"
import type { personalInformationSchema } from "@/features/profile/schemas/profile.schema"

export type UpdateMeInput = z.output<typeof personalInformationSchema>
