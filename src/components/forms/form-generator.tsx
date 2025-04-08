'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/auth-provider'
import { Turnstile } from '@marsidev/react-turnstile'
import axios from 'axios'

interface FormGeneratorProps {
  onFormGenerated: (form: any) => void
}

const examplePrompts = [
  'Customer satisfaction survey with ratings and open feedback questions',
  'Job application form with experience, education, and skills sections',
  'Event registration form with attendee details and meal preferences',
  'Product feedback form with ratings and improvement suggestions',
]

export function FormGenerator({ onFormGenerated }: FormGeneratorProps) {
  const { user, session, signInAnonymously } = useAuth()
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')

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
        const { session: newSession, success, error } = await signInAnonymously(captchaToken)
        if (!success) {
          console.error('Error signing in anonymously:', error)
        } else {
          authSession = newSession
        }
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
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create a new form</CardTitle>
          <CardDescription>
            Describe the form you want to create with all the questions you need. Start each question on a new line.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent>
            <Textarea
              placeholder={`Describe your form here... (e.g., A customer feedback form with questions about product quality, delivery experience, and suggestions for improvement)`}
              className="min-h-[200px] text-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {/* TODO: Add proper keyboard shortcut icons and tooltip */}
              {isGenerating ? 'Generating...' : 'Generate Form (Cmd+Enter)'}
            </Button>
          </CardFooter>
        </form>
        <Turnstile
          className="w-full flex items-center justify-center"
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setCaptchaToken(token)}
          options={{ size: 'invisible' }}
        />
      </Card>

      <div className="mt-8">
        <p className="text-sm font-medium mb-3">Try describing something like:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((prompt, index) => (
            <div
              key={index}
              className="text-sm p-3 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-accent cursor-pointer transition-all shadow-sm hover:shadow"
              onClick={() => {
                setDescription(prompt)
                const event = new Event('submit') as unknown as React.FormEvent
                handleSubmit(event, prompt)
              }}
            >
              "{prompt}"
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
