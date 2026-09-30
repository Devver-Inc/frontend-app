import { ScriptOnce } from "@tanstack/react-router"
import { applyTheme } from "@/lib/utils/theme"
import { PREFERENCES_STORAGE_KEY } from "@/stores/preferences.store"

// Runs before the first paint: the store only reads localStorage after
// hydration, so the shell would otherwise flash in the light theme.
const script = `(${applyTheme.toString()})((() => {
  try {
    return JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_STORAGE_KEY)})).state.theme
  } catch {
    return "system"
  }
})())`

export function ThemeScript() {
  return <ScriptOnce>{script}</ScriptOnce>
}
