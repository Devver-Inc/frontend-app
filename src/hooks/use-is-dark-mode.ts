import { useSyncExternalStore } from "react"

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

const isDarkMode = () => document.documentElement.classList.contains("dark")

// The `dark` class of <html> is the theme actually applied (ThemeScript,
// ThemeSync), whatever the stored preference.
export const useIsDarkMode = (): boolean =>
  useSyncExternalStore(subscribe, isDarkMode, () => false)
