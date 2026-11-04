import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { usePreferencesStore } from "@/stores/preferences.store"

const THEMES = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "system", label: "Match system theme", icon: Monitor },
] as const

export function ThemeToggle() {
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)

  return (
    <div role="group" aria-label="Theme" className="flex">
      {THEMES.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "grid size-6.5 cursor-pointer place-items-center rounded-md transition-colors duration-100 outline-none hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:scale-[.97]",
            theme === value
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-muted"
          )}
        >
          <Icon className="size-3.5" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}
