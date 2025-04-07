'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { supabaseBrowserClient } from '@/lib/supabase/browser'
import { useAuth } from '../auth/auth-provider'
import { Turnstile } from '@marsidev/react-turnstile'
import { LOCAL_STORAGE_KEYS } from '@/lib/types/constants'

interface SignInDialogProps {
  isOpen: boolean
  onClose: () => void
  onSignInSuccess: () => void
  onSignUpSuccess: () => void
}

// TODO: Refine the copy on this page

export function SignInDialog({ isOpen, onClose, onSignInSuccess, onSignUpSuccess }: SignInDialogProps) {
  const { user, linkAnonymousAccount } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const turnstileRef = useRef<any>(null)

  const hasUserPreviouslySignedIn = () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(LOCAL_STORAGE_KEYS.PREVIOUSLY_SIGNED_IN)
  }

  // Force refresh the CAPTCHA token when switching between forms
  const refreshCaptcha = () => {
    if (turnstileRef.current && turnstileRef.current.reset) {
      turnstileRef.current.reset()
      setCaptchaToken('')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (!captchaToken) {
      setError('Please wait for the security check to complete')
      refreshCaptcha()
      return
    }

    try {
      setIsSigningIn(true)
      setError('')

      // Check if user is anonymous
      const isAnonymousUser = !!user?.is_anonymous

      // If the current user is anonymous, link the account
      if (isAnonymousUser) {
        setIsLinking(true)
        const { success, error: linkError } = await linkAnonymousAccount(email, password)

        if (!success) {
          throw new Error(linkError)
        }

        onSignInSuccess()
        return
      }

      // Otherwise, perform regular sign in
      const { error } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken,
        },
      })

      if (error) {
        throw error
      }

      toast.success('Signed in successfully!')
      onSignInSuccess()
    } catch (error: any) {
      console.error('Error signing in:', error)
      setError(error.message || 'Failed to sign in')
      toast.error('Failed to sign in')
      refreshCaptcha()
    } finally {
      setIsSigningIn(false)
      setIsLinking(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (!captchaToken) {
      setError('Please wait for the security check to complete')
      refreshCaptcha()
      return
    }

    try {
      setIsRegistering(true)
      setError('')

      // Check if user is anonymous
      const isAnonymousUser = !!user?.is_anonymous

      // If the current user is anonymous, link the account
      if (isAnonymousUser && !hasUserPreviouslySignedIn()) {
        setIsLinking(true)
        const { success, error: linkError } = await linkAnonymousAccount(email, password)

        if (!success) {
          throw new Error(linkError)
        }

        onSignUpSuccess()
        return
      }

      // Otherwise, perform regular registration
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          captchaToken: captchaToken,
        },
      })

      if (error) {
        throw error
      }

      // Mark the user as previously signed in in localStorage
      if (data?.user) {
        // Use the same localStorage key defined in auth-provider.tsx
        if (typeof window !== 'undefined') {
          localStorage.setItem('_tf_usr_auth_state', data.user.id)
        }
      }

      setShowRegisterForm(false)
      onSignUpSuccess()
    } catch (error: any) {
      console.error('Error registering:', error)
      setError(error.message || 'Failed to register')
      toast.error('Failed to register')
      refreshCaptcha()
    } finally {
      setIsRegistering(false)
      setIsLinking(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError('')

      const isAnonymousUser = !!user?.is_anonymous

      if (isAnonymousUser && !hasUserPreviouslySignedIn()) {
        setIsLinking(true)
        const { data, error } = await supabaseBrowserClient.auth.linkIdentity({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })

        if (error) {
          throw new Error(error.message)
        }

        onSignInSuccess()
        return
      }

      // The browser will be redirected to Google's OAuth page, and then back to our callback URL
      await supabaseBrowserClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          // Don't skip the browser redirect - we want the full OAuth flow
          skipBrowserRedirect: false,
        },
      })

      // This code won't execute immediately as the browser will redirect
    } catch (error: any) {
      console.error('Error starting Google sign-in:', error)
      setError(error.message || 'Failed to start Google sign-in')
      toast.error('Failed to sign in with Google')
    }
  }

  // Listen for dialog open/close to refresh captcha
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose()
    } else {
      // Reset form errors when opening the dialog
      setError('')

      // Small delay to ensure Turnstile is properly mounted
      setTimeout(() => {
        refreshCaptcha()
      }, 500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{showRegisterForm ? 'Create an Account' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {showRegisterForm
              ? 'Create an account to save and share your forms.'
              : 'Sign in to save and share your forms.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showRegisterForm ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <Turnstile
                ref={turnstileRef}
                className="w-full flex items-center justify-center"
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setCaptchaToken(token)}
                options={{ size: 'invisible' }}
                onError={() => {
                  setCaptchaToken('')
                  setError('Security check failed. Please try again.')
                }}
                onExpire={() => {
                  setCaptchaToken('')
                  setError('Security check expired. Please refresh and try again.')
                }}
              />
            </div>

            <DialogFooter>
              <div className="w-full flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isRegistering || !captchaToken}>
                  {isRegistering ? 'Creating account...' : 'Create account'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowRegisterForm(false)
                    refreshCaptcha()
                  }}
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <Turnstile
                  ref={turnstileRef}
                  className="w-full flex items-center justify-center"
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(token) => setCaptchaToken(token)}
                  options={{ size: 'invisible' }}
                  onError={() => {
                    setCaptchaToken('')
                    setError('Security check failed. Please try again.')
                  }}
                  onExpire={() => {
                    setCaptchaToken('')
                    setError('Security check expired. Please refresh and try again.')
                  }}
                />
              </div>

              <DialogFooter>
                <div className="w-full flex flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={isSigningIn || !captchaToken}>
                    {isSigningIn ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowRegisterForm(true)
                      refreshCaptcha()
                    }}
                  >
                    Don&apos;t have an account? Register
                  </Button>
                </div>
              </DialogFooter>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button type="button" variant="outline" className="w-full" size="lg" onClick={signInWithGoogle}>
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-8 w-8"
                >
                  <title>google</title>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="invisible_box" data-name="invisible box">
                      <rect width="48" height="48" fill="none" />
                      <rect width="48" height="48" fill="none" />
                    </g>
                    <g id="icons_Q2" data-name="icons Q2">
                      <path d="M24.7,20.5v7.6H35.6a10.9,10.9,0,0,1-10.9,8,12.1,12.1,0,1,1,7.9-21.3l5.6-5.6A20,20,0,1,0,24.7,44c16.8,0,20.5-15.7,18.9-23.5Z" />
                    </g>
                  </g>
                </svg>
                <span className="font-semibold">Sign in with Google</span>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
