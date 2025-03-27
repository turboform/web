"use client";

import { useState } from "react";
import { FormGenerator } from "@/components/forms/form-generator";
import { FormPreview } from "@/components/forms/form-preview";
import { FormActions } from "@/components/forms/form-actions";

export default function CreateFormPage() {
  const [generatedForm, setGeneratedForm] = useState<any>(null);

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Create New Form</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Design your form with AI assistance or customize it to fit your exact needs.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {!generatedForm ? (
          <FormGenerator onFormGenerated={setGeneratedForm} />
        ) : (
          <div className="space-y-6">
            <FormPreview form={generatedForm} editable={true} onFormChange={setGeneratedForm} />
            <FormActions
              form={generatedForm}
              homePath="/dashboard"
              homeLabel="View All Forms"
            />
          </div>
        )}
      </div>
    </div>
  );
}
