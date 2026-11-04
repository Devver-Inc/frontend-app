import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import type { ReactNode } from "react"
import { Logo } from "@/components/common/logo"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUiStore } from "@/stores/ui.store"
import { Content as DialogContentPrimitive } from "@radix-ui/react-dialog"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobileNavOpen = useUiStore((state) => state.isMobileNavOpen)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="fixed top-3 left-3 z-50 -translate-y-16 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground focus-visible:translate-y-0"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-sidebar-border lg:block">
        <Sidebar />
      </aside>

      <header className="material sticky top-0 z-30 flex h-14 items-center gap-3 px-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className="-ml-2"
        >
          <Menu />
        </Button>
        <Link to="/" className="rounded-md">
          <Logo />
        </Link>
      </header>

      <Dialog open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContentPrimitive
            aria-describedby={undefined}
            className="fixed inset-y-2 left-2 z-50 w-[min(18rem,calc(100%-3rem))] overflow-hidden rounded-2xl shadow-float duration-350 ease-spring outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left"
          >
            <DialogTitle className="sr-only">Navigation</DialogTitle>
            <Sidebar />
          </DialogContentPrimitive>
        </DialogPortal>
      </Dialog>

      <main id="main" tabIndex={-1} className="outline-none lg:pl-56">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-8 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  )
}
