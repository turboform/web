'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart } from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedPage } from '@/components/auth/protected-page'
import { useAuth } from '@/components/auth/auth-provider'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'

interface Response {
  id: string
  created_at: string
  answers: { [key: string]: any }
}

interface Form {
  id: string
  title: string
  description?: string
  responseCount?: number
  schema?: FormField[]
}

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export const runtime = 'edge'

const AnalyticsPage = () => {
  const params = useParams()
  const router = useRouter()
  const { session } = useAuth()
  const formId = params.id as string

  // Analytics state
  const [analysisType, setAnalysisType] = useState<'overview' | 'trends' | 'patterns'>('overview')

  // Fetch form details using SWR
  const {
    data: formData,
    error: formError,
    isLoading: formLoading,
  } = useSWR(session?.access_token ? [`/api/forms/${formId}`, session?.access_token] : null, ([url, token]) =>
    fetcher<{ form: Form }>(url, token)
  )

  // Fetch form responses using SWR
  const {
    data: responsesData,
    error: responsesError,
    isLoading: responsesLoading,
  } = useSWR(session?.access_token ? [`/api/responses/${formId}`, session?.access_token] : null, ([url, token]) =>
    fetcher<{ responses: Response[] }>(url, token)
  )

  // Handle any errors
  if (formError) {
    toast.error('Failed to load form details')
  }

  if (responsesError) {
    toast.error('Failed to load form responses')
  }

  // Combined loading state
  const isLoading = formLoading || responsesLoading

  // Get data from SWR responses
  const form = formData?.form || null
  const responses = responsesData?.responses || []

  // Create a map of field IDs to field labels
  const fieldLabelMap = useMemo(() => {
    const map: Record<string, string> = {
      created_at: 'Submission Date',
    }

    if (form?.schema && Array.isArray(form.schema)) {
      form.schema.forEach((field) => {
        if (field.id && field.label) {
          map[field.id] = field.label
        }
      })
    }

    return map
  }, [form])

  // Get unique columns from all responses
  const columns = useMemo(() => {
    if (!responses.length) return []

    // Extract all unique fields from responses
    const allFields = new Set<string>()
    responses.forEach((response) => {
      if (response.answers && typeof response.answers === 'object') {
        Object.keys(response.answers).forEach((key) => allFields.add(key))
      }
    })

    // Always include submission timestamp
    allFields.add('created_at')

    return Array.from(allFields)
  }, [responses])

  // Get field display name
  const getFieldDisplayName = (columnId: string) => {
    return fieldLabelMap[columnId] || columnId
  }

  // Create a summary of responses for key metrics
  const responseSummary = useMemo(() => {
    if (!responses.length) return null

    // Get submission timeline data
    const timelineData: Record<string, number> = {}
    responses.forEach((response) => {
      const date = new Date(response.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      timelineData[date] = (timelineData[date] || 0) + 1
    })

    // Get most common answers for top fields
    const commonAnswers: Record<string, { value: string; count: number }[]> = {}
    columns
      .filter((col) => col !== 'created_at')
      .slice(0, 5) // Only analyze top 5 fields to avoid performance issues
      .forEach((column) => {
        const valueCounts: Record<string, number> = {}
        responses.forEach((response) => {
          if (!response.answers || response.answers[column] === undefined) return

          const value = String(response.answers[column])
          valueCounts[value] = (valueCounts[value] || 0) + 1
        })

        commonAnswers[column] = Object.entries(valueCounts)
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      })

    return {
      total: responses.length,
      recent: responses.filter((r) => {
        const date = new Date(r.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        return daysDiff < 7
      }).length,
      timeline: timelineData,
      commonAnswers,
    }
  }, [responses, columns, getFieldDisplayName])

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 px-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-7 w-40 bg-muted animate-pulse rounded" />
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                  ))}
                </div>
                <div className="h-64 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check if form exists
  if (!form) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </Button>
          <Card className="py-12">
            <CardContent>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Form not found</h3>
                <p className="text-muted-foreground mb-6">
                  The form you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => router.push('/dashboard')}>Go back to dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!responseSummary) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/responses/${formId}`)}
              className="self-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Responses
            </Button>
            <h1 className="text-2xl font-bold">{form?.title || 'Form Analytics'}</h1>
          </div>
          <Card className="py-12">
            <CardContent>
              <div className="text-center">
                <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No data to analyze</h3>
                <p className="text-muted-foreground mb-6">
                  This form hasn't received any submissions yet, or the submissions don't contain analyzable data.
                </p>
                <Button onClick={() => router.push(`/responses/${formId}`)}>Back to responses</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(`/responses/${formId}`)} className="self-start">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Responses
        </Button>
        <h1 className="text-2xl font-bold">{form?.title || 'Form Analytics'}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Insights from {responseSummary.total} responses</CardDescription>
            </div>
            <div className="flex space-x-1">
              <Button
                variant={analysisType === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisType('overview')}
              >
                Overview
              </Button>
              <Button
                variant={analysisType === 'trends' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisType('trends')}
              >
                Trends
              </Button>
              <Button
                variant={analysisType === 'patterns' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisType('patterns')}
              >
                Patterns
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {analysisType === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-3xl font-bold">{responseSummary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Responses</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-3xl font-bold">{responseSummary.recent}</div>
                  <div className="text-sm text-muted-foreground">Last 7 Days</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Common Fields</h3>
                <div className="space-y-2">
                  {columns
                    .filter((col) => col !== 'created_at')
                    .slice(0, 5)
                    .map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <div className="text-sm font-medium">{getFieldDisplayName(field)}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {analysisType === 'trends' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Submission Timeline</h3>
                <div className="h-64 border rounded-lg p-4">
                  {Object.keys(responseSummary.timeline).length > 1 ? (
                    <div className="h-full flex items-end space-x-1">
                      {Object.entries(responseSummary.timeline)
                        .slice(-14) // Show last 14 days
                        .map(([date, count], i) => {
                          const maxCount = Math.max(...Object.values(responseSummary.timeline))
                          const height = (count / maxCount) * 100
                          return (
                            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                              <div
                                className="w-full bg-primary rounded-t"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                              />
                              <div className="text-sm truncate h-6 w-12">
                                {date}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Not enough data to show a trend
                    </div>
                  )}
                </div>
              </div>

              {/* TODO: Add this back later in a cleaner way */}
              {/* <div>
                <h3 className="text-lg font-medium mb-2">Submission Rate</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Daily average:</span>
                    <span className="font-medium">
                      {(responseSummary.total / (Object.keys(responseSummary.timeline).length || 1)).toFixed(1)}{' '}
                      responses
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Most active day:</span>
                    <span className="font-medium">
                      {Object.entries(responseSummary.timeline).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}(
                      {Object.entries(responseSummary.timeline).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} responses)
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          )}

          {analysisType === 'patterns' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Common Responses</h3>
              <div className="space-y-6">
                {Object.entries(responseSummary.commonAnswers)
                  .slice(0, 3)
                  .map(([field, answers]) => (
                    <div key={field} className="space-y-2">
                      <h4 className="font-medium">{getFieldDisplayName(field)}</h4>
                      {answers.length > 0 ? (
                        <div className="space-y-1">
                          {answers.map((answer, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="text-sm truncate max-w-[250px]">{answer.value || '(empty)'}</div>
                              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded"
                                  style={{ width: `${Math.round((answer.count / responseSummary.total) * 100)}%` }}
                                />
                              </div>
                              <div className="text-sm text-muted-foreground w-10 text-right">
                                {Math.round((answer.count / responseSummary.total) * 100)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProtectedPage(AnalyticsPage)
