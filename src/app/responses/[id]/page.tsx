'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Download, Search, SortAsc, SortDesc, BarChart, Sliders, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedPage } from '@/components/auth/protected-page'
import { useAuth } from '@/components/auth/auth-provider'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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

const ResponsesPage = () => {
  const params = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const router = useRouter()
  const { session } = useAuth()
  const formId = params.id as string
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [showResponseDetails, setShowResponseDetails] = useState(false)

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

  // Determine overall loading state
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

  // Set initial visible columns when columns are first loaded
  useMemo(() => {
    if (columns.length > 0 && visibleColumns.length === 0) {
      // Default to showing created_at and up to 4 other important columns
      const initialColumns = ['created_at']

      // Add additional columns, prioritizing shorter fields that might contain key data
      columns
        .filter((col) => col !== 'created_at')
        .sort((a, b) => {
          // Prioritize fields that have labels
          const aHasLabel = !!fieldLabelMap[a]
          const bHasLabel = !!fieldLabelMap[b]

          if (aHasLabel && !bHasLabel) return -1
          if (!aHasLabel && bHasLabel) return 1

          // Then sort by field name length
          return a.length - b.length
        })
        .slice(0, 4)
        .forEach((col) => initialColumns.push(col))

      setVisibleColumns(initialColumns)
    }
  }, [columns, visibleColumns, fieldLabelMap])

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== column))
    } else {
      setVisibleColumns([...visibleColumns, column])
    }
  }

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
  }

  // Apply sorting and filtering
  const filteredAndSortedResponses = useMemo(() => {
    let result = [...responses]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter((response) => {
        if (!response.answers) return false
        return columns.some((column) => {
          const value =
            column === 'created_at' ? new Date(response.created_at).toLocaleString() : response.answers[column]

          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(lowerSearchTerm)
        })
      })
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue, bValue

        if (sortConfig.key === 'created_at') {
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
        } else {
          aValue = a.answers?.[sortConfig.key]
          bValue = b.answers?.[sortConfig.key]
        }

        // Handle undefined values in sorting
        if (aValue === undefined) aValue = ''
        if (bValue === undefined) bValue = ''

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [responses, searchTerm, sortConfig, columns])

  // Format cell value for display
  const formatCellValue = (column: string, value: any) => {
    if (value === undefined || value === null) return '—'

    if (column === 'created_at') {
      return new Date(value).toLocaleString()
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  }

  // Create a summary of responses for basic metrics (for header info only)
  const responseStats = useMemo(() => {
    if (!responses.length) return null

    return {
      total: responses.length,
      recent: responses.filter((r) => {
        const date = new Date(r.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        return daysDiff < 7
      }).length,
    }
  }, [responses])

  // View response details
  const viewResponseDetails = (response: Response) => {
    setSelectedResponse(response)
    setShowResponseDetails(true)
  }

  // Export to CSV
  const exportToCSV = () => {
    try {
      // Skip export if no data
      if (!responses.length) {
        toast.error('No data to export')
        return
      }

      // Create CSV header row with proper display names
      const csvHeader = columns.map((column) => getFieldDisplayName(column)).join(',')

      // Create CSV rows from responses
      const csvRows = filteredAndSortedResponses
        .map((response) => {
          return columns
            .map((column) => {
              const value = column === 'created_at' ? response.created_at : response.answers?.[column]

              // Handle CSV formatting for different data types
              if (value === undefined || value === null) {
                return ''
              } else if (typeof value === 'string') {
                // Escape quotes and wrap in quotes if needed
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                  return `"${value.replace(/"/g, '""')}"`
                }
                return value
              } else if (typeof value === 'object') {
                // Stringify objects
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`
              }

              return String(value)
            })
            .join(',')
        })
        .join('\n')

      // Combine header and rows
      const csv = csvHeader + '\n' + csvRows

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${form?.title || 'form'}-responses-${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Export completed')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div className="border rounded-md">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state or form not found
  if (formError || !form) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Form Not Found</h2>
          <p className="text-muted-foreground mb-8">The form you are looking for could not be found.</p>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="self-start">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">{form?.title || 'Form Responses'}</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Responses</CardTitle>
              <CardDescription>
                {responseStats ? (
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span>{responseStats.total} total submissions</span>
                  </div>
                ) : null}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search responses..."
                  className="pl-8 w-full sm:w-[200px] md:w-[260px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-t border-b">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToCSV()}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              {/* Column visibility selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Sliders className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-2">
                  <div className="space-y-1 max-h-[300px] overflow-y-auto">
                    {columns.map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`col-${column}`}
                          checked={visibleColumns.includes(column)}
                          onChange={() => toggleColumnVisibility(column)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`col-${column}`} className="text-sm flex-1 cursor-pointer">
                          {getFieldDisplayName(column)}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" onClick={() => router.push(`/responses/${formId}/analytics`)}>
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          <div className="border-b">
            {responses.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="font-medium text-xl mb-2">No responses yet</h3>
                <p className="text-muted-foreground">Your form hasn&apos;t received any submissions.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead key={column} className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-primary"
                            onClick={() => handleSort(column)}
                          >
                            {getFieldDisplayName(column)}
                            {sortConfig?.key === column &&
                              (sortConfig.direction === 'asc' ? (
                                <SortAsc className="w-3 h-3" />
                              ) : (
                                <SortDesc className="w-3 h-3" />
                              ))}
                          </button>
                        </TableHead>
                      ))}
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        {visibleColumns.map((column) => {
                          const value = column === 'created_at' ? response.created_at : response.answers?.[column]

                          return (
                            <TableCell key={`${response.id}-${column}`} className="whitespace-nowrap">
                              {formatCellValue(column, value)}
                            </TableCell>
                          )
                        })}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => viewResponseDetails(response)}
                            title="View response details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination controls */}
          {responses.length > 0 && (
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {responses.length} of {filteredAndSortedResponses.length} responses
              </div>
              {/* TODO: add proper pagination with API filtering */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response details dialog - moved outside of table cell */}
      <Dialog open={showResponseDetails} onOpenChange={setShowResponseDetails}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            {selectedResponse && (
              <DialogDescription>
                Submitted on {new Date(selectedResponse.created_at).toLocaleString()}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {selectedResponse && (
              <Table>
                <TableBody>
                  {columns.map((column) => {
                    const value =
                      column === 'created_at' ? selectedResponse.created_at : selectedResponse.answers?.[column]
                    return (
                      <TableRow key={column}>
                        <TableCell className="font-medium">{getFieldDisplayName(column)}</TableCell>
                        <TableCell className="break-words">
                          {formatCellValue(column, value)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProtectedPage(ResponsesPage)
