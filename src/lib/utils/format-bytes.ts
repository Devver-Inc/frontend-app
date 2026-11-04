const UNITS = ["B", "KB", "MB", "GB", "TB"]

const FORMATTER = new Intl.NumberFormat("en", { maximumFractionDigits: 1 })

export const formatBytes = (bytes: number): string => {
  const exponent = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
    UNITS.length - 1
  )
  return `${FORMATTER.format(bytes / 1024 ** exponent)} ${UNITS[exponent]}`
}
