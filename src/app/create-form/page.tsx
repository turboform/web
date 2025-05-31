'use client'

import { useState } from 'react'
import { FormGenerator } from '@/components/forms/form-generator'
import { FormPreview } from '@/components/forms/form-preview'
import { FormActions } from '@/components/forms/form-actions'

export default function CreateFormPage() {
  const [generatedForm, setGeneratedForm] = useState<any>(null)

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto w-full">
        {!generatedForm ? (
          <FormGenerator onFormGenerated={setGeneratedForm} />
        ) : (
          <div className="space-y-6">
            <FormPreview form={generatedForm} editable={true} onFormChange={setGeneratedForm} />
            <FormActions form={generatedForm} homePath="/dashboard" homeLabel="View All Forms" />
          </div>
        )}
      </div>
    </div>
  )
}
