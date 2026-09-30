import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useIsDarkMode } from "@/hooks/use-is-dark-mode"
import { cn } from "@/lib/utils/cn"
import { usePreferencesStore } from "@/stores/preferences.store"

export function ThemeToggle() {
  const isDark = useIsDarkMode()
  const setTheme = usePreferencesStore((state) => state.setTheme)

  return (
    <div className="flex w-fit items-center justify-center text-sm text-sidebar-foreground/70">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!isDark}
        aria-label="Switch to light mode"
        onClick={() => setTheme("light")}
        className={cn(
          "cursor-pointer hover:bg-transparent",
          isDark ? "text-sidebar-foreground/60" : "text-sidebar-foreground"
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </Button>

      <Switch
        className="cursor-pointer !bg-primary"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isDark}
        aria-label="Switch to dark mode"
        onClick={() => setTheme("dark")}
        className={cn(
          "cursor-pointer hover:bg-transparent",
          isDark ? "text-sidebar-foreground" : "text-sidebar-foreground/60"
        )}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}
