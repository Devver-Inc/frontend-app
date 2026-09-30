import { Menu, X } from "lucide-react"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import { useUiStore } from "@/stores/ui.store"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobileNavOpen = useUiStore((state) => state.isMobileNavOpen)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:translate-x-0",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setMobileNavOpen(true)}
        className="glass-surface-strong fixed top-4 left-4 z-30 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isMobileNavOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => setMobileNavOpen(false)}
          className="glass-surface-strong fixed top-4 right-4 z-50 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 pt-20 sm:px-6 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
