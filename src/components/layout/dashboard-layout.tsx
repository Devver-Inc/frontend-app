import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setMobileOpen(true)}
        className="glass-surface-strong fixed left-4 top-4 z-30 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileOpen && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => setMobileOpen(false)}
          className="glass-surface-strong fixed right-4 top-4 z-50 lg:hidden"
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
