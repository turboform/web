import { Metadata } from 'next'
import { Suspense, CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FormSubmission } from '@/components/forms/form-submission'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { getFormByShortId } from '@/lib/supabase/actions'

export const revalidate = 3600 // Revalidate once per hour

export const runtime = 'edge'

type FormPageProps = Promise<{
  shortId: string
}>

export async function generateMetadata({ params }: { params: FormPageProps }): Promise<Metadata> {
  // Destructure params to avoid the Next.js warning
  const { shortId } = await params
  const form = await getFormByShortId(shortId)

  if (!form) {
    return {
      title: 'Form Not Found',
    }
  }

  return {
    title: `${form.title} | TurboForm`,
    description: form.description,
  }
}

export default async function FormShortPage({ params }: { params: FormPageProps }) {
  // Destructure params to avoid the Next.js warning
  const { shortId } = await params
  const form = await getFormByShortId(shortId)

  if (!form || form.is_draft) {
    notFound()
  }

  const customColorStyle = {
    '--form-primary-color': form.primary_color || 'var(--primary)',
    '--form-secondary-color': form.secondary_color || 'var(--secondary)',
  } as React.CSSProperties

  return (
    <div className="container max-w-3xl py-16 px-4 sm:px-6 mx-auto min-h-[calc(100vh-100px)] flex flex-col">
      <Card className="shadow-sm flex-1 flex flex-col" style={customColorStyle}>
        <CardHeader className="pb-4">
          {/* Display logo if it exists */}
          {form.logo_url && (
            <div className="w-full flex justify-center mb-4">
              <div className="relative h-16 w-auto max-w-full">
                <img src={form.logo_url} alt="Company Logo" className="h-full w-auto object-contain" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl font-semibold">{form.title}</CardTitle>
          <CardDescription className="text-base mt-2 whitespace-pre-line">{form.description}</CardDescription>
        </CardHeader>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12 flex-1">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <FormSubmission form={form} />
        </Suspense>

        <CardFooter className="flex justify-center pt-6 pb-4 text-xs text-muted-foreground mt-auto">
          <Link href="https://turboform.ai" target="_blank" className="transition-colors underline">
            Powered by TurboForm
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
