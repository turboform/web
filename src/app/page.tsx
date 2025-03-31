"use client";

import { useState } from "react";
import { FormGenerator } from "@/components/forms/form-generator";
import { FormPreview } from "@/components/forms/form-preview";
import { FormActions } from "@/components/forms/form-actions";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const examplePrompts = [
    "Customer satisfaction survey with ratings and open feedback questions",
    "Job application form with experience, education, and skills sections",
    "Event registration form with attendee details and meal preferences",
    "Product feedback form with ratings and improvement suggestions"
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      {!generatedForm ? (
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              Forms in Seconds, Not Hours
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Turboform.ai transforms your ideas into beautiful, functional forms using AI—no design skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">AI-Powered Design</h3>
              <p className="text-sm text-muted-foreground">Describe what you need and watch AI craft the perfect form</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Save Hours</h3>
              <p className="text-sm text-muted-foreground">Create in seconds what would take hours with traditional tools</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Instant Sharing</h3>
              <p className="text-sm text-muted-foreground">Share your form with anyone instantly with a simple link</p>
            </div>
          </div>

          <div className="bg-muted/50 p-6 sm:p-8 rounded-xl shadow-sm">
            <FormGenerator onFormGenerated={setGeneratedForm} />

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Try describing something like:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {examplePrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-background rounded border border-border hover:border-primary/50 hover:bg-muted/80 cursor-pointer transition-colors"
                    onClick={() => {
                      const textareaElement = document.querySelector('textarea');
                      if (textareaElement) {
                        textareaElement.value = prompt;
                        // Trigger the onChange event
                        const event = new Event('input', { bubbles: true });
                        textareaElement.dispatchEvent(event);
                      }
                    }}
                  >
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>
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

            <div className="flex flex-col items-center gap-4 p-6 border border-primary/20 rounded-lg bg-primary/5">
              <p className="text-center font-medium">
                Ready to use this form? Sign in to access your dashboard and get a shareable link!
              </p>
              <Button onClick={() => setIsSignInDialogOpen(true)} className="gap-1">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
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
          toast.success("Signed in successfully!");
          setIsSignInDialogOpen(false);
        }}
      />
    </div>
  );
}
