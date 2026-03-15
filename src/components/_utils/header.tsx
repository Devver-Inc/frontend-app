import { useLogto } from '@logto/react'
import { Link } from '@tanstack/react-router'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher'

export function Header() {
  const { signOut, isAuthenticated } = useLogto()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="glass-surface sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <img
                src="/logo.png"
                alt="Devver Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground">Devver</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                <OrganizationSwitcher />
                <Link
                  to="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  to="/organizations/new"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  New organization
                </Link>
                <div className="flex items-center space-x-2 border-l pl-4">
                  <Link
                    to="/profile"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URI)
                    }
                    className="flex items-center space-x-2 text-destructive-foreground hover:bg-destructive/15 hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/">
                <Button size="sm">Get Started</Button>
              </Link>
            )}
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <OrganizationSwitcher />
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    to="/organizations/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  >
                    New organization
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut(`${globalThis.location.origin}/`)
                    }}
                    className="justify-start text-destructive-foreground hover:bg-destructive/15 hover:text-destructive-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
