import { Suspense } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { getFormById } from "@/lib/supabase/actions";
import { FormSubmission } from "@/components/forms/form-submission";
import { notFound } from "next/navigation";

// Export a revalidate boundary for the page
export const revalidate = 3600; // Revalidate at most once per hour

// Return metadata for the page based on the form data
export async function generateMetadata({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id);
  
  if (!form) {
    return {
      title: 'Form Not Found'
    };
  }
  
  return {
    title: `${form.title} | TurboForm`,
    description: form.description
  };
}

// Server component for Form page
export default async function FormPage({ params }: { params: { id: string } }) {
  const formId = params.id;
  const form = await getFormById(formId);

  // If form not found, show 404
  if (!form) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-16 px-4 sm:px-6 mx-auto">
      <Toaster position="top-center" />

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold">{form.title}</CardTitle>
          <CardDescription className="text-base mt-2">{form.description}</CardDescription>
        </CardHeader>
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <FormSubmission form={form} />
        </Suspense>
      </Card>
    </div>
  );
}
