'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/auth-provider'
import { Turnstile } from '@marsidev/react-turnstile'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, ArrowRight, Lightbulb } from 'lucide-react'
import axios from 'axios'
import { cn } from '@/lib/utils'

interface FormGeneratorProps {
  onFormGenerated: (form: any) => void
}

const examplePrompts = [
  'SaaS churn survey with questions about product quality, delivery experience, and suggestions for improvement',
  'Customer satisfaction survey with questions about general feedback, product features, and areas for improvement',
  'Lead generation form with questions about company size, industry, and contact information',
  'Research questionnaire about what problems users face when using a product',
]

export function FormGenerator({ onFormGenerated }: FormGeneratorProps) {
  const { user, session, signInAnonymously } = useAuth()
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [showCaptcha, setShowCaptcha] = useState(false)

  const handleSubmit = async (e: React.FormEvent, directPrompt?: string) => {
    e.preventDefault()

    // Use the direct prompt if provided (from example clicks) or fall back to the state
    const formDescription = directPrompt || description

    if (!formDescription.trim()) {
      toast.error('Please enter a description of your form')
      return
    }

    try {
      setIsGenerating(true)

      // Sign in anonymously if needed (only when generating a form)
      let authSession = session
      if (!user) {
        // Require CAPTCHA verification before proceeding
        if (!captchaToken) {
          setShowCaptcha(true)
          setIsGenerating(false)
          toast.info('Please verify that you are human before generating your form')
          return
        }

        const { session: newSession, success, error } = await signInAnonymously(captchaToken)
        if (!success) {
          console.error('Error signing in anonymously:', error)
          if (error && error.includes('verification')) {
            setCaptchaToken('') // Clear invalid token
            setShowCaptcha(true)
            toast.error('Verification failed. Please try again.')
            setIsGenerating(false)
            return
          }
        }

        authSession = newSession
      }

      const response = await axios.post(
        '/api/generate-form',
        {
          description: formDescription,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authSession?.access_token}`,
          },
        }
      )

      if (!response.data) {
        throw new Error('Failed to generate form')
      }

      const data = response.data
      onFormGenerated(data)
      toast.success('Form generated successfully!')
      setShowCaptcha(false)
    } catch (error) {
      console.error('Error generating form:', error)
      toast.error('Failed to generate form. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle keyboard shortcuts for form submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (!isGenerating && description.trim()) {
        e.preventDefault() // Prevent default to avoid new line insertion
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full overflow-hidden border-2 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4 space-y-2">
            <div className="flex items-center gap-2 justify-center">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <CardTitle className="text-4xl font-bold">Create a new form</CardTitle>
              </motion.div>
            </div>
            <CardDescription className="text-base text-center">
              Describe the form you want to create with all the questions you need. Start each question on a new line.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CardContent>
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Textarea
                    placeholder={`A customer feedback form with questions about product quality, delivery experience, and suggestions for improvement

- How was the product quality?
- How was the delivery experience?
- What suggestions do you have for improvement?`}
                    className="min-h-[220px] text-lg border-2 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </motion.div>
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  Cmd+Enter to generate
                </div>
              </div>

              {showCaptcha && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <div className="flex flex-col items-center p-5 border-2 border-primary/20 rounded-xl bg-primary/5">
                    <p className="text-sm mb-3 font-medium">Please verify you're human</p>
                    <Turnstile
                      className="w-full flex items-center justify-center"
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={(token) => {
                        setCaptchaToken(token)
                      }}
                      onError={(error) => {
                        console.error('Turnstile error:', error)
                        setCaptchaToken('') // Clear token on error
                      }}
                      options={{
                        size: showCaptcha ? 'normal' : 'invisible',
                        theme: 'light',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-6 px-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  className={cn(
                    'w-full group transition-all',
                    isGenerating
                      ? 'bg-primary/80'
                      : 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01]'
                  )}
                  size="lg"
                  disabled={isGenerating}
                >
                  <span className="flex items-center gap-2">
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        <span>Creating your form...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                        <span>Generate Form</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </CardFooter>
          </form>

          <div className="pt-2 pb-6 px-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-medium">Try one of these examples:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.4 }}
                >
                  <div
                    className="text-sm p-4 bg-muted/40 rounded-xl border-2 border-muted hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
                    onClick={() => {
                      setDescription(prompt)

                      // Only directly submit if user is already signed in
                      // or if we already have a captcha token
                      if (user || captchaToken) {
                        const event = new Event('submit') as unknown as React.FormEvent
                        handleSubmit(event, prompt)
                      } else {
                        // If not signed in and no token, follow the normal flow
                        // which will show captcha if needed
                        setShowCaptcha(true)
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="pr-8">"{prompt}"</span>
                      <Wand2 className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary/40 to-primary group-hover:w-full transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
