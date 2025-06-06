'use client'

import { useState } from 'react'
import { FormGenerator } from '@/components/forms/form-generator'
import { FormPreview } from '@/components/forms/form-preview'
import { FormActions } from '@/components/forms/form-actions'
import { SignInDialog } from '@/components/auth/sign-in-dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Integrations } from '@/components/landing/integrations'
import { Customization } from '@/components/landing/customization'
import { Testimonial } from '@/components/landing/testimonial'
import { UseCases } from '@/components/landing/use-cases'
import { FAQ } from '@/components/landing/faq'
import { Rocket } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [generatedForm, setGeneratedForm] = useState<any>(null)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  return (
    <div className="mx-auto">
      {!generatedForm ? (
        <div>
          {/* Hero Section */}
          <Hero />

          {/* Features Section */}
          <Features />

          {/* Integrations Section */}
          <Integrations />

          {/* Customization Section */}
          <Customization />

          {/* Testimonial CTA Section */}
          <Testimonial />

          {/* Use Cases Section */}
          <UseCases />

          {/* FAQ Section */}
          <FAQ />

          {/* Form Generator Section */}
          <section className="py-24 sm:py-32 scroll-mt-16">
            <div id="form-generator" className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center flex justify-center">
                <h2 className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
                  <Rocket className="h-4 w-4" />
                  Start Building
                </h2>
              </div>
              <div className="mx-auto max-w-3xl p-6">
                <FormGenerator onFormGenerated={setGeneratedForm} />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-16">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Form is Ready!</h2>
            <p className="text-muted-foreground">
              Preview your form below. Sign in to save it and get a shareable link.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-xl shadow-sm">
              <FormPreview form={generatedForm} editable={true} onFormChange={setGeneratedForm} />
            </div>

            <FormActions
              form={generatedForm}
              onHomeAction={() => setGeneratedForm(null)}
              homeLabel="Create Another Form"
            />
          </div>
        </div>
      )}

      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignInSuccess={() => {
          toast.success('Signed in successfully!')
          setIsSignInDialogOpen(false)
        }}
        onSignUpSuccess={() => {
          setIsSignInDialogOpen(false)
          router.push('/signup-success')
        }}
      />
    </div>
  )
}
