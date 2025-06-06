'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type FooterLinkProps = {
  href: string
  children: React.ReactNode
  external?: boolean
}

const FooterLink = ({ href, children, external = false }: FooterLinkProps) => (
  <Link
    href={href}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  >
    {children}
  </Link>
)

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
    <footer className="border-t mt-auto bg-background">
      {/* Main Footer Content */}
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-1">
              <div className="relative h-8 w-8 overflow-hidden rounded-md shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="TurboForm Logo"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-semibold text-lg">TurboForm</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Create beautiful, high-converting forms with AI-powered analytics and integrations that drive results.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://x.com/turboform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  color="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>X</title>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
              <a
                href="https://github.com/turboform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  color="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>GitHub</title>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Product */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-sm">Product</h3>
              <div className="flex flex-col space-y-2.5">
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/changelog">Changelog</FooterLink>
                {/* TODO: Add these pages */}
                {/* <FooterLink href="#">Use Cases</FooterLink>
                <FooterLink href="#">Features</FooterLink>
                <FooterLink href="#">Integrations</FooterLink> */}
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-sm">Resources</h3>
              <div className="flex flex-col space-y-2.5">
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="https://github.com/turboform" external>
                  {/* TODO: Add these pages */}
                  {/* <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Guides</FooterLink> */}
                  GitHub
                </FooterLink>
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-sm">Company</h3>
              <div className="flex flex-col space-y-2.5">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TurboForm. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ in Amsterdam, Netherlands</p>
        </div>
      </div>
    </footer>
  )
}
