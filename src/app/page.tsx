"use client";

import { useState } from "react";
import { FormGenerator } from "@/components/forms/form-generator";
import { FormPreview } from "@/components/forms/form-preview";
import { FormActions } from "@/components/forms/form-actions";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { toast } from "sonner";

export default function Home() {
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">TurboForm Builder</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Create professional forms in seconds using AI. Just describe what you need, and we&apos;ll generate it for you.
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
              onHomeAction={() => setGeneratedForm(null)}
              homeLabel="Create Another Form"
            />
          </div>
        )}
      </div>

      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignInSuccess={() => {
          setIsSignInDialogOpen(false);
          toast.success("Signed in successfully!");
        }}
      />
    </div>
  );
}
