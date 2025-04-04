import React, { useEffect, useState } from 'react'
import { supabaseBrowserClient } from '@/lib/supabase/browser'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

function ProtectedPage(WrappedComponent: React.FC) {
  return function AuthComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const getSession = async () => {
        const {
          data: { session },
        } = await supabaseBrowserClient.auth.getSession()
        setIsAuthenticated(!!session && !session.user?.is_anonymous)
        setIsLoading(false)

        if (!session || session.user?.is_anonymous) {
          redirect('/')
        }
      }

      getSession()
    })

    if (isLoading) {
      return (
        <div className="flex items-center justify-center px-4 py-8">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // or a loading indicator
    }

    return <WrappedComponent {...props} />
  }
}

export { ProtectedPage }
