'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Download,
  Search,
  SortAsc,
  SortDesc,
  BarChart,
  Sliders,
  Eye,
  MessageSquare,
  TableIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedPage } from '@/components/auth/protected-page'
import { useAuth } from '@/components/auth/auth-provider'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/lib/types/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/chat/chat-interface'
import Link from 'next/link'

interface Response {
  id: string
  created_at: string
  responses: { [key: string]: any }
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
  const [activeTab, setActiveTab] = useState('chat')

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
    fetcher<Response[]>(url, token)
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
  const responses = responsesData || []

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
    if (!responses?.length) return []

    // Extract all unique fields from responses
    const allFields = new Set<string>()
    responses.forEach((response) => {
      if (response.responses && typeof response.responses === 'object') {
        Object.keys(response.responses).forEach((key) => allFields.add(key))
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
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim()
      result = result.filter((response) => {
        // Handle case where response has no answers
        if (!response.responses) {
          // Still check created_at even if no answers
          return new Date(response.created_at).toLocaleString().toLowerCase().includes(lowerSearchTerm)
        }

        // Special case for created_at field
        if (new Date(response.created_at).toLocaleString().toLowerCase().includes(lowerSearchTerm)) {
          return true
        }

        // Check all answer fields for the search term
        return Object.entries(response.responses).some(([key, value]) => {
          if (value === null || value === undefined) return false

          // Convert to string for comparison
          const stringValue = String(value).toLowerCase()
          return stringValue.includes(lowerSearchTerm)
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
          aValue = a.responses?.[sortConfig.key]
          bValue = b.responses?.[sortConfig.key]
        }

        // Handle undefined values in sorting
        if (aValue === undefined) aValue = ''
        if (bValue === undefined) bValue = ''

        // For string comparison, use localeCompare
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        // For other types (numbers, dates, etc)
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
  }, [responses, searchTerm, sortConfig])

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
              const value = column === 'created_at' ? response.created_at : response.responses?.[column]

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
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="h-[calc(100vh-2rem)] bg-transparent border-none shadow-none">
        <CardHeader className="pb-2">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{form?.title || 'Form'} Responses</CardTitle>
              <CardDescription>
                {responses.length} {responses.length === 1 ? 'response' : 'responses'} collected
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/responses/${formId}/analytics`}>
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] p-0">
          <Tabs defaultValue="chat" className="h-full" onValueChange={(value) => setActiveTab(value)}>
            <div className="px-6 pt-2 flex items-center justify-between flex-row">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat with Data
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4" />
                  All responses
                </TabsTrigger>
              </TabsList>

              {activeTab === 'table' && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search responses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Sliders className="w-4 h-4 mr-2" />
                        Columns ({visibleColumns.length})
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Toggle columns</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {columns.map((column) => (
                            <div key={column} className="flex items-center space-x-2">
                              <Checkbox
                                id={column}
                                checked={visibleColumns.includes(column)}
                                onCheckedChange={() => toggleColumnVisibility(column)}
                              />
                              <label htmlFor={column} className="text-sm font-normal cursor-pointer flex-1">
                                {getFieldDisplayName(column)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <TabsContent value="chat" className="h-[calc(100%-4rem)] mt-0 p-6 overflow-hidden">
              {session?.access_token && <ChatInterface formId={formId} authToken={session.access_token} />}
            </TabsContent>

            <TabsContent value="table" className="h-[calc(100%-4rem)] mt-4">
              <div className="h-full flex flex-col">
                {/* Table content */}
                <div className="flex-1 overflow-hidden">
                  {responses.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <p>No responses yet</p>
                      <p className="text-sm mt-2">Share your form to start collecting responses</p>
                    </div>
                  ) : (
                    <div className="overflow-auto h-full px-6">
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
                          {filteredAndSortedResponses.map((response) => (
                            <TableRow key={response.id}>
                              {visibleColumns.map((column) => {
                                const value =
                                  column === 'created_at' ? response.created_at : response.responses?.[column]

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
                  <div className="p-4 flex items-center justify-between border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredAndSortedResponses.length} of {responses.length} responses
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response details dialog */}
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
                      column === 'created_at' ? selectedResponse.created_at : selectedResponse.responses?.[column]
                    return (
                      <TableRow key={column}>
                        <TableCell className="font-medium">{getFieldDisplayName(column)}</TableCell>
                        <TableCell className="break-words">{formatCellValue(column, value)}</TableCell>
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
