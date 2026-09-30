import { create } from "zustand"

type UiState = {
  isMobileNavOpen: boolean
  setMobileNavOpen: (isMobileNavOpen: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
}))
