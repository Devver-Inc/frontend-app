import { useEffect } from "react"
import { applyTheme } from "@/lib/utils/theme"
import { usePreferencesStore } from "@/stores/preferences.store"

export function ThemeSync() {
  useEffect(() => {
    void usePreferencesStore.persist.rehydrate()

    const apply = () => applyTheme(usePreferencesStore.getState().theme)
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    apply()
    media.addEventListener("change", apply)
    const unsubscribe = usePreferencesStore.subscribe(apply)
    return () => {
      media.removeEventListener("change", apply)
      unsubscribe()
    }
  }, [])

  return null
}
