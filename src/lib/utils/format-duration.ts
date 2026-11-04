const SECOND_MS = 1_000
const MINUTE_MS = 60 * SECOND_MS

const SECONDS_FORMATTER = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
})

export const formatDuration = (durationMs: number): string => {
  if (durationMs < SECOND_MS) return `${Math.round(durationMs)} ms`
  if (durationMs < MINUTE_MS) {
    return `${SECONDS_FORMATTER.format(durationMs / SECOND_MS)} s`
  }
  const minutes = Math.floor(durationMs / MINUTE_MS)
  const seconds = Math.round((durationMs % MINUTE_MS) / SECOND_MS)
  return `${minutes} min ${seconds} s`
}
