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
          <section id="form-generator" className="py-24 sm:py-32 scroll-mt-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center mb-12">
                <h2 className="text-lg font-semibold leading-7 text-secondary">Start Building</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Create Your Form Now
                </p>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Describe your form in plain English and our AI will generate it for you instantly. No coding required.
                </p>
              </div>
              <div className="mx-auto max-w-3xl border border-border rounded-xl shadow-lg p-6 bg-card">
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
