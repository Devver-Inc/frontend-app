import type { CSSProperties } from "react"
import { Toaster } from "sonner"
import { useIsDarkMode } from "@/hooks/use-is-dark-mode"

const TOAST_STYLE = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius-xl)",
  "--font": "var(--font-sans)",
} as CSSProperties

export function AppToaster() {
  const isDark = useIsDarkMode()

  return (
    <Toaster
      theme={isDark ? "dark" : "light"}
      position="bottom-right"
      style={TOAST_STYLE}
      toastOptions={{ className: "!shadow-float !text-sm !font-medium" }}
    />
  )
}
