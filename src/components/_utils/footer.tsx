import { Link } from '@tanstack/react-router'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <span className="text-lg font-bold text-white">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Devver</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              Building the future of development tools. Streamline your workflow
              and ship faster with Devver.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@devver.app"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Devver. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
