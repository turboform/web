"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { Turnstile } from '@marsidev/react-turnstile';

interface FormGeneratorProps {
  onFormGenerated: (form: any) => void;
}

export function FormGenerator({ onFormGenerated }: FormGeneratorProps) {
  const { user, signInAnonymously } = useAuth();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description of your form");
      return;
    }

    try {
      setIsGenerating(true);

      // Sign in anonymously if needed (only when generating a form)
      if (!user) {
        const { success, error } = await signInAnonymously(captchaToken);
        if (!success) {
          console.error("Error signing in anonymously:", error);
          // Continue anyway, the API will handle the case where there's no user
        }
      }

      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate form");
      }

      const data = await response.json();
      onFormGenerated(data);
      toast.success("Form generated successfully!");
    } catch (error) {
      console.error("Error generating form:", error);
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle keyboard shortcuts for form submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (!isGenerating && description.trim()) {
        e.preventDefault(); // Prevent default to avoid new line insertion
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
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
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isGenerating || !description.trim()}
          >
            {/* TODO: Add proper keyboard shortcut icons and tooltip */}
            {isGenerating ? "Generating..." : "Generate Form (Cmd+Enter)"}
          </Button>
        </CardFooter>
      </form>
      <Turnstile
        className='w-full flex items-center justify-center'
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setCaptchaToken(token)}
        options={{ size: 'invisible' }}
      />
    </Card>
  );
}
