'use client'

import { useState } from 'react'
import { FormGenerator } from '@/components/forms/form-generator'
import { FormPreview } from '@/components/forms/form-preview'
import { FormActions } from '@/components/forms/form-actions'
import { SignInDialog } from '@/components/auth/sign-in-dialog'
import { toast } from 'sonner'
import { Sparkles, Clock, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const router = useRouter()
  const [generatedForm, setGeneratedForm] = useState<any>(null)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  return (
    <div className="container mx-auto py-12 px-4">
      {!generatedForm ? (
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
              TurboForm - Build Forms Faster
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text">
              Beautiful Forms Before Your Coffee Cools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-6">
              Stop wrestling with clunky form builders. Turn any idea into a polished, share-ready form in seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-2">
              <Badge variant="outline" className="border-primary/20 text-primary">
                No credit card required
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                Unlimited responses
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                Simple sharing
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-colors border border-transparent">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Instant Form Creation</h3>
              <p className="text-sm text-muted-foreground">
                Struggling to start from scratch? Skip the blank-page anxiety and see your form appear the moment you
                describe it.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-colors border border-transparent">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Save Hours of Work</h3>
              <p className="text-sm text-muted-foreground">
                Create complex, professional forms in under a minute that would take hours with traditional builders.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-colors border border-transparent">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">One-Click Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Forms stuck in your dashboard help no one. Share a memorable link and start collecting answers right
                away.
              </p>
            </div>
          </div>

          <div className="mb-12 p-8 rounded-xl bg-gradient-to-br from-muted to-card border border-border shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-destructive/70"></div>
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
              <div className="h-2 w-2 rounded-full bg-primary/60"></div>
              <div className="flex-1 h-8 bg-accent rounded-md mx-2"></div>
            </div>

            <FormGenerator onFormGenerated={setGeneratedForm} />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
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
