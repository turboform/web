'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const pathname = usePathname()
  const hideOnPaths = ['/f/*']
  // Check if current path matches any pattern in hideOnPaths (including wildcards)
  if (
    hideOnPaths.some((pattern) => {
      // Convert wildcard pattern to regex
      if (pattern.includes('*')) {
        const regexPattern = new RegExp('^' + pattern.replace('*', '.*') + '$')
        return regexPattern.test(pathname)
      }
      // Direct comparison for exact matches
      return pattern === pathname
    })
  ) {
    return null
  }

  return (
    <footer className="border-t py-6 mt-auto bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Left column: Logo and branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded">
                <Image
                  src="/images/logo.png"
                  alt="TurboForm Logo"
                  width={32}
                  height={32}
                  className="object-cover rounded-md"
                  priority
                />
              </div>
              <span className="font-semibold text-base">TurboForm</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">&copy; {currentYear} TurboForm</p>
          </div>

          {/* Right column: Links */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <nav className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
