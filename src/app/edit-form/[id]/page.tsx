'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Calendar, Settings, ListChecks } from 'lucide-react'
import { FormPreview } from '@/components/forms/form-preview'
import { useAuth } from '@/components/auth/auth-provider'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IntegrationsList } from '@/components/integrations/integrations-list'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { ProtectedPage } from '@/components/auth/protected-page'

export const runtime = 'edge'

function EditFormPage() {
  const { user, session } = useAuth()
  const params = useParams()
  const formId = params.id as string
  const router = useRouter()

  const [form, setForm] = useState<any>(null)
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)

  // Fetch the form data using SWR
  const { data: formData, isLoading } = useSWR(
    user && session?.access_token ? [`/api/forms/${formId}`, session.access_token] : null,
    ([url, token]) => fetcher<{ form: any }>(url, token)
  )

  // Set form data when it loads
  useEffect(() => {
    if (formData?.form) {
      setForm(formData.form)
      if (formData.form.expires_at) {
        setExpirationDate(new Date(formData.form.expires_at))
      }
    }
  }, [formData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center mb-10">
        <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Edit Form</h1>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {form && (
          <div className="space-y-6">
            <Tabs defaultValue="form">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form" className="flex items-center">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Form Builder
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Integrations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Form Expiration</CardTitle>
                    </div>
                    <CardDescription>Set a date when this form will stop accepting responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                      <DateTimePicker
                        date={expirationDate}
                        setDate={setExpirationDate}
                        label="Set expiration date and time"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {expirationDate
                          ? `This form will stop accepting responses after ${expirationDate.toLocaleDateString()} at ${expirationDate.toLocaleTimeString()}.`
                          : 'After this date, the form will no longer accept new responses.'}
                      </p>
                      {expirationDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setExpirationDate(undefined)}
                        >
                          Remove Expiration
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <FormPreview
                  key={`form-preview-${form.id}`}
                  form={form}
                  editable={true}
                  onFormChange={(updatedForm) => setForm(updatedForm)}
                />
              </TabsContent>

              <TabsContent value="integrations" className="mt-6">
                <IntegrationsList formId={formId} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProtectedPage(EditFormPage)
