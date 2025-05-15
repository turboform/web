'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabaseBrowserClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { linkAnonymousAccountToUser } from '@/lib/utils/auth'

// Export the subscription type for reuse
export interface SubscriptionWithDetails {
  id: string
  status: string
  current_period_end: string
  current_period_start: string
  cancel_at_period_end?: boolean
  created: string
  plan: {
    id: string
    name: string
    amount: number
    interval: string
  }
  prices?: {
    products?: {
      name?: string
      description?: string
    }
    unit_amount?: number
    currency?: string
    interval?: string
  }
}

type AuthContextType = {
  user: User | null
  subscription: SubscriptionWithDetails | null
  subscriptionLoading: boolean
  session: Session | null
  isLoading: boolean
  isAnonymous: boolean
  signOut: () => Promise<void>
  signInAnonymously: (captchaToken: string) => Promise<{ session: Session | null; success: boolean; error?: string }>
  linkAnonymousAccount: (
    email: string,
    password: string,
    captchaToken: string
  ) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // First, try to get the current session
    const initializeAuth = async () => {
      try {
        setIsLoading(true)

        // Get the current session
        const {
          data: { session: currentSession },
        } = await supabaseBrowserClient.auth.getSession()

        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          // Check if the user is anonymous
          setIsAnonymous(!!currentSession.user?.is_anonymous)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      // Update anonymous status
      if (newSession?.user) {
        setIsAnonymous(!!newSession.user.is_anonymous)
      }

      setIsLoading(false)

      // Force a router refresh when auth state changes
      // This ensures all server components reflect the new auth state
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Function to create an anonymous user when needed
  const signInAnonymously = async (captchaToken: string) => {
    try {
      // If user is already signed in, don't create a new anonymous account
      if (user) {
        return { success: true, session }
      }

      // Create an anonymous user using Supabase's built-in method
      const { data, error } = await supabaseBrowserClient.auth.signInAnonymously({ options: { captchaToken } })

      if (error) {
        console.error('Error signing in anonymously:', error)
        return { success: false, error: error.message, session: null }
      }

      if (data?.user) {
        setIsAnonymous(true)
        setSession(data.session)
        return { success: true, session: data.session }
      }

      return { success: false, error: 'Failed to create anonymous account', session: null }
    } catch (error: any) {
      console.error('Error signing in anonymously:', error)
      return { success: false, error: error.message, session: null }
    }
  }

  // Function to link anonymous account to a real email/password
  const linkAnonymousAccount = async (email: string, password: string, captchaToken: string) => {
    try {
      if (!isAnonymous || !user) {
        return { success: false, error: 'No anonymous account to link' }
      }

      // Store the anonymous user ID before any auth changes
      const anonymousUserId = user.id

      const { data: existingUserData, error: signInError } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      })

      // If sign-in was successful, we need to handle the case of linking the anonymous data
      if (!signInError && existingUserData?.user) {
        // Get the current session for the auth token
        const { data: sessionData } = await supabaseBrowserClient.auth.getSession()
        const authToken = sessionData.session?.access_token

        await linkAnonymousAccountToUser(anonymousUserId, existingUserData.user.id, authToken)

        // User is already signed in to their existing account at this point
        setIsAnonymous(false)
        return { success: true }
      }

      // Otherwise, let's try to update the anonymous account with the email/password
      // This will work for new accounts when the email doesn't exist yet
      const { error } = await supabaseBrowserClient.auth.updateUser({
        email,
        password,
      })

      if (error) {
        // If the update fails, it's likely because the email is already taken
        // but the password didn't match, or some other error
        return { success: false, error: error.message }
      }

      setIsAnonymous(false)
      return { success: true }
    } catch (error: any) {
      console.error('Error linking account:', error)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await supabaseBrowserClient.auth.signOut()
      setUser(null)
      setSession(null)
      setIsAnonymous(false)

      // Force a router refresh after signout
      router.replace('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const { data, isLoading: subscriptionLoading } = useSWR(
    session?.access_token && !session.user.is_anonymous ? [`/api/user`, session.access_token] : null,
    ([url, token]) => fetcher<{ subscription: SubscriptionWithDetails | null }>(url, token),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAnonymous,
        subscription: data?.subscription ?? null,
        subscriptionLoading,
        signOut,
        signInAnonymously,
        linkAnonymousAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useSubscription() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within an AuthProvider')
  }
  return { subscription: context.subscription, subscriptionLoading: context.subscriptionLoading }
}
