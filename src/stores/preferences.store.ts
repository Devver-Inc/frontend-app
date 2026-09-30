import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Theme } from "@/lib/utils/theme"

export const PREFERENCES_STORAGE_KEY = "preferences"

type PreferencesState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      // Rehydrated after mount (ThemeSync): the root layout is part of the
      // prerendered shell, whose HTML knows nothing about localStorage.
      skipHydration: true,
    }
  )
)
