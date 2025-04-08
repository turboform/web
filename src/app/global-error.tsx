'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Inter } from 'next/font/google'
import * as Sentry from '@sentry/nextjs'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 16h.01" />
                <path d="M12 8v4" />
                <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Well, this is embarrassing</h1>
              <p className="text-muted-foreground">Our form builder seems to have encountered a critical error.</p>
              <p className="text-sm text-muted-foreground">Our team has been notified and we're working on a fix.</p>
            </div>

            <div className="pt-4">
              <Button onClick={() => reset()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/70">Error Reference: {error.digest}</p>
          </div>
        </div>
      </body>
    </html>
  )
}
