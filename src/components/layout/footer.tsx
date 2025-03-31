"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
                  alt="Turboform.ai Logo"
                  width={32}
                  height={32}
                  className="object-cover rounded-md"
                  priority
                />
              </div>
              <span className="font-semibold text-base">Turboform.ai</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              &copy; {currentYear} Turboform.ai
            </p>
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
  );
}
