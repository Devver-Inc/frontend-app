const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

export const formatDate = (value: string | number): string =>
  new Date(value).toLocaleDateString()

export const formatDateTime = (value: string | number): string =>
  new Date(value).toLocaleString()

export const formatLongDate = (value: string | number): string =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export const formatRelativeDate = (value: string): string => {
  const date = new Date(value)
  const elapsedMs = Date.now() - date.getTime()
  const minutes = Math.floor(elapsedMs / MINUTE_MS)
  const hours = Math.floor(elapsedMs / HOUR_MS)
  const days = Math.floor(elapsedMs / DAY_MS)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}
