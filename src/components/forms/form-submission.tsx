'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarX2, ChevronDown, ChevronUp, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import type { FormData } from '@/lib/supabase/actions'
import axios from 'axios'
import { FormField } from '@/lib/types/form'
import { isDarkColor } from '@/lib/utils'

const isFormExpired = (form: FormData): boolean => {
  if (!form.expires_at) return false
  const expirationDate = new Date(form.expires_at)
  const currentDate = new Date()
  return currentDate > expirationDate
}

export function FormSubmission({ form }: { form: FormData }) {
  const router = useRouter()
  const [formResponses, setFormResponses] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Check if the form is expired
  const expired = isFormExpired(form)

  // Focus the input field when step changes
  useEffect(() => {
    if (inputRef.current && !expired && !completed) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [currentStep, expired, completed])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const isCurrentFieldValid = () => {
    if (currentStep >= form.schema.length) return true

    const field = form.schema[currentStep]
    if (!field.required) return true

    // Skip validation for checkboxes
    if (field.type === 'checkbox') {
      return formResponses[field.id] !== undefined
    }

    // For other field types
    return !(
      formResponses[field.id] === undefined ||
      formResponses[field.id] === null ||
      (typeof formResponses[field.id] === 'string' && !formResponses[field.id].trim()) ||
      (Array.isArray(formResponses[field.id]) && formResponses[field.id].length === 0)
    )
  }

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!isCurrentFieldValid()) {
      toast.error('Please fill in this field before continuing')
      return
    }

    if (currentStep < form.schema.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleSubmit = async () => {
    // Prevent submission if form is expired
    if (expired) {
      toast.error('This form has expired and is no longer accepting responses')
      return
    }

    try {
      setSubmitting(true)

      const result = await axios.post('/api/forms/submit', {
        formId: form.id,
        responses: formResponses,
      })

      if (!result.data.success) {
        throw new Error('Failed to submit form')
      }

      // Show success message
      setCompleted(true)

      // Show toast and redirect to the form-submitted page
      toast.success('Form submitted successfully!')

      // Short delay to allow the toast to be seen
      setTimeout(() => {
        // Redirect to the form-submitted page with the form name
        router.push(`/form-submitted?formName=${encodeURIComponent(form.title)}`)
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form. Please try again.')
      setSubmitting(false)
    }
  }

  // Render the expiration notice when the form has expired
  if (expired) {
    return (
      <div className="space-y-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                <CalendarX2 className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-600">This form has expired</h3>
            <p className="text-gray-600">
              This form is no longer accepting responses as it has passed its expiration date.
            </p>
          </div>
        </CardContent>
      </div>
    )
  }

  // Render completion screen
  if (completed) {
    return (
      <div className="space-y-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-green-600">Form Submitted</h3>
            <p className="text-gray-600">Thank you for your response!</p>
          </div>
        </CardContent>
      </div>
    )
  }

  // Show loading spinner when submitting
  if (submitting) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  const field = form.schema[currentStep] as FormField
  const progress = (currentStep / form.schema.length) * 100

  return (
    <form onSubmit={handleNext} className="min-h-[400px] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-1 bg-primary transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
      </div>

      <CardContent className="py-8 flex-1 flex flex-col">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentStep + 1} of {form.schema.length}
          </div>
          <Label htmlFor={field.id} className="text-xl font-medium">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
        </div>

        <div className="space-y-4 flex-1">
          {field.type === 'text' && (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              id={field.id}
              placeholder={field.placeholder || ''}
              className="w-full p-3 text-lg"
              value={formResponses[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              onKeyDown={handleKeyDown}
              required={field.required}
              autoComplete="off"
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              id={field.id}
              placeholder={field.placeholder || ''}
              className="w-full p-3 text-lg border rounded-md min-h-[150px]"
              value={formResponses[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === 'checkbox' && (
            <div className="flex items-center space-x-3 p-3">
              <Switch
                id={field.id}
                checked={!!formResponses[field.id]}
                onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              />
              <Label htmlFor={field.id} className="text-lg">
                {field.placeholder || 'Yes'}
              </Label>
            </div>
          )}

          {field.type === 'radio' && field.options && (
            <RadioGroup
              value={formResponses[field.id] || ''}
              onValueChange={(value) => handleInputChange(field.id, value)}
              className="space-y-3"
            >
              {field.options.map((option: string) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 border pl-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} className="p-3 bg-gray-200" />
                  <Label htmlFor={`${field.id}-${option}`} className="text-lg cursor-pointer flex-1 p-3">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {field.type === 'select' && field.options && (
            <Select value={formResponses[field.id] || ''} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger className="w-full p-3 text-lg">
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option} className="text-lg">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === 'multi_select' && field.options && (
            <MultiSelect
              options={field.options.map((option: string) => ({
                label: option,
                value: option,
              }))}
              selected={formResponses[field.id] || []}
              onChange={(selected) => handleInputChange(field.id, selected)}
              placeholder={field.placeholder || 'Select options'}
              className="w-full"
            />
          )}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            Previous
          </Button>

          <Button
            type="submit"
            className="flex items-center gap-2"
            style={{
              backgroundColor: form.primary_color || '#000000',
              color: isDarkColor(form.primary_color || '#000000') ? '#ffffff' : '#000000',
            }}
          >
            {currentStep < form.schema.length - 1 ? (
              <>
                Next
                <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                Submit
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </form>
  )
}
