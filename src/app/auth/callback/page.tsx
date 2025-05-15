'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowserClient } from '@/lib/supabase/browser'
import { Loader2 } from 'lucide-react'
import { Provider } from '@supabase/supabase-js'

export default function AuthCallback() {
  // Simple centered spinner with no text
  return (
    <div className="flex min-h-screen justify-center pt-24">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <AuthCallbackClient />
      </Suspense>
    </div>
  )
}

function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Extract query parameters
        const errorCode = searchParams.get('error_code')
        const provider = searchParams.get('provider')
        const anonymousId = searchParams.get('anon')

        // Special handling for identity_already_exists error
        if (errorCode === 'identity_already_exists' && anonymousId) {
          await supabaseBrowserClient.auth.signInWithOAuth({
            provider: provider as Provider,
            options: {
              redirectTo: `${window.location.origin}/dashboard?anon=${anonymousId}`,
              skipBrowserRedirect: false,
            },
          })
          return
        }

        // Standard handling: try to get session and redirect to dashboard
        const { error } = await supabaseBrowserClient.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          // Redirect to home page on error
          router.push('/')
        } else {
          // Redirect to dashboard on success
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        // Redirect to home page on any error
        router.push('/')
      }
    }

    handleAuth()
  }, [router, searchParams])

  return <Loader2 className="h-8 w-8 animate-spin text-primary" />
}
