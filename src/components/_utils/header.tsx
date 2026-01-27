import { useLogto } from '@logto/react'
import { Link } from '@tanstack/react-router'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'

export function Header() {
  const { signOut, isAuthenticated } = useLogto()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Devver</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Home
                </Link>
                <Link
                  // @ts-expect-error - Route will exist after routeTree regeneration
                  to="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 border-l pl-4">
                  <Link
                    to="/profile"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URI)
                    }
                    className="flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:text-red-700"
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

          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Home
                  </Link>
                  <Link
                    // @ts-expect-error - Route will exist after routeTree regeneration
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut(`${window.location.origin}/`)
                    }}
                    className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
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
