export type Theme = "light" | "dark" | "system"

// Also inlined in <head> by ThemeScript: it must stay self-contained.
export function applyTheme(theme: Theme): void {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", isDark)
}
