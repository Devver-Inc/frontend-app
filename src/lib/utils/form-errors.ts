import type { FieldErrors, FieldValues } from "react-hook-form"

// For forms without a slot per field: the first message is shown in a toast.
export const getFirstErrorMessage = <TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>
): string | undefined => {
  for (const error of Object.values(errors)) {
    if (!error) continue
    if (typeof error.message === "string") return error.message
    const nested = getFirstErrorMessage(error as FieldErrors)
    if (nested) return nested
  }
  return undefined
}
