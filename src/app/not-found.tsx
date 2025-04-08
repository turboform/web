'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Fun illustration of a form that's lost */}
        <div className="mx-auto w-32 h-32 relative mb-4">
          <div className="absolute inset-0 bg-primary/10 rounded-lg transform rotate-6"></div>
          <div className="absolute inset-0 bg-secondary/30 rounded-lg transform -rotate-3"></div>
          <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center">
            <Search className="h-12 w-12 text-primary/40" />
          </div>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text">
          404 - Form Not Found
        </h1>

        <p className="text-lg text-muted-foreground">
          Oops! This form seems to have wandered off. Maybe it's taking a coffee break?
        </p>

        <div className="grid gap-2 pt-4">
          <p className="text-sm text-muted-foreground">Don't worry, we'll help you get back on track.</p>

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Button onClick={() => router.back()} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
