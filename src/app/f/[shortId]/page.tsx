import { Metadata } from 'next';
import { Suspense } from "react";
import { notFound } from 'next/navigation';
import { FormSubmission } from '@/components/forms/form-submission';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { getFormByShortId } from '@/lib/supabase/actions';

export const revalidate = 3600; // Revalidate once per hour

type FormPageProps = Promise<{
  shortId: string;
}>;

export async function generateMetadata({ params }: { params: FormPageProps }): Promise<Metadata> {
  // Destructure params to avoid the Next.js warning
  const { shortId } = await params;
  const form = await getFormByShortId(shortId);

  if (!form) {
    return {
      title: 'Form Not Found',
    };
  }

  return {
    title: `${form.title} | TurboForm`,
    description: form.description,
  };
}

export default async function FormShortPage({ params }: { params: FormPageProps }) {
  // Destructure params to avoid the Next.js warning
  const { shortId } = await params;
  const form = await getFormByShortId(shortId);

  if (!form || form.is_draft) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-16 px-4 sm:px-6 mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold">{form.title}</CardTitle>
          <CardDescription className="text-base mt-2 whitespace-pre-line">{form.description}</CardDescription>
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
