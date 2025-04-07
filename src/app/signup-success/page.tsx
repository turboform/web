import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, Mail } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Verification - Turboform',
  description: 'Please verify your email address to complete your registration',
}

export default function SignupSuccessPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 mx-auto">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent you a verification link to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm">Click the verification link in the email</p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm">After verification, you'll be able to access all your forms and data</p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm">Don't see the email? Check your spam folder or request a new verification email</p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2">
            <p>
              Need help? Contact{' '}
              <a href="mailto:support@turboform.ai" className="text-primary hover:underline">
                support@turboform.ai
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to home page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
