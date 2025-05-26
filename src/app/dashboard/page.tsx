'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PlusCircle, Eye, Edit, Trash2, AlertTriangle, BarChart, Globe, Lock, MoreVertical, Link } from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedPage } from '@/components/auth/protected-page'
import { useAuth } from '@/components/auth/auth-provider'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import { Form } from '@/lib/types/form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { linkAnonymousAccountToUser } from '@/lib/utils/auth'

function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session } = useAuth()
  const [formToDelete, setFormToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToUnpublish, setFormToUnpublish] = useState<{ id: string; title: string } | null>(null)

  const { data, error, isLoading, mutate } = useSWR(
    session?.access_token ? ['/api/forms', session?.access_token] : null,
    ([url, token]) => fetcher<{ forms: Form[] }>(url, token),
    { revalidateOnFocus: true }
  )

  const handleDeleteForm = async (formId: string) => {
    try {
      await axios.delete(`/api/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })

      // Update the forms list
      await mutate()
      toast.success('Form deleted successfully')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting form:', error)
      toast.error('Failed to delete form')
    }
  }

  const handleTogglePublish = async (formId: string, currentStatus: boolean) => {
    // If we're unpublishing (form is currently published/not draft), show confirmation dialog
    if (currentStatus) {
      const form = data?.forms.find((f) => f.id === formId)
      if (form) {
        setFormToUnpublish({ id: formId, title: form.title })
        return
      }
    }

    // Otherwise proceed with publishing directly
    try {
      const response = await axios.post(
        '/api/forms/publish',
        { formId, isPublished: !currentStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      if (response.data.success) {
        await mutate()
        toast.success(
          currentStatus
            ? 'Form has been unpublished and is now in draft mode'
            : 'Form has been published and is now live'
        )
      }
    } catch (error) {
      console.error('Error toggling form publish status:', error)
      toast.error('Failed to update form status')
    }
  }

  const confirmUnpublish = async () => {
    if (!formToUnpublish) return

    try {
      const response = await axios.post(
        '/api/forms/publish',
        // When unpublishing, we're setting isPublished to false
        { formId: formToUnpublish.id, isPublished: false },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      if (response.data.success) {
        await mutate()
        toast.success('Form has been unpublished and is now in draft mode')
      }
    } catch (error) {
      console.error('Error unpublishing form:', error)
      toast.error('Failed to unpublish form')
    } finally {
      setFormToUnpublish(null)
    }
  }

  const copyShortLink = (shortId: string) => {
    const shortLink = `${window.location.origin}/f/${shortId}`
    navigator.clipboard.writeText(shortLink)
    toast.success('Link copied to clipboard!')
  }

  useEffect(() => {
    const anonymousId = searchParams.get('anon')
    if (!!anonymousId && session?.user?.id && session?.access_token) {
      linkAnonymousAccountToUser(anonymousId, session?.user?.id, session?.access_token)
      router.replace('/dashboard')
      mutate()
    }
  }, [searchParams])

  return (
    <div className="container py-16 mx-auto max-w-7xl px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Forms</h1>
        <Button onClick={() => router.push('/create-form')} size="lg" className="rounded-lg font-semibold shadow-sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border border-border bg-card">
              <CardHeader className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <Skeleton className="h-20 w-full rounded" />
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-4 gap-3">
                <Skeleton className="h-9 w-28 rounded" />
                <Skeleton className="h-9 w-28 rounded" />
                <Skeleton className="h-9 w-28 rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : data?.forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/60 rounded-xl border border-border shadow-sm">
          <h3 className="mb-3 text-xl font-semibold">You haven&apos;t created any forms yet</h3>
          <p className="mb-8 text-muted-foreground max-w-md">
            Get started by creating your first form to collect data from users
          </p>
          <Button onClick={() => router.push('/create-form')} size="lg" className="rounded-lg font-semibold shadow">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Form
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(data?.forms || []).map((form) => (
            <Card
              key={form.id}
              className="relative overflow-hidden shadow-sm border border-border bg-card flex flex-col"
            >
              <CardHeader className="p-6 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold truncate text-foreground whitespace-break-spaces">
                    {form.title}
                  </CardTitle>
                  <div
                    className={`px-2 py-1 text-xs rounded-full absolute top-2 right-2 font-semibold shadow-sm ${
                      form.is_draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {form.is_draft ? 'Draft' : 'Published'}
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  Created{' '}
                  {new Date(form.created_at || '').toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {form.description || 'No description'}
                </p>
                <div className="flex justify-between">
                  <div className="text-xs text-muted-foreground font-medium">
                    {form.schema && Array.isArray(form.schema) ? (
                      <span>
                        {form.schema.length} question{form.schema.length === 1 ? '' : 's'}
                      </span>
                    ) : (
                      <span>Custom form</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    <span>
                      {form.responseCount} response{form.responseCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-2 p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center rounded-md"
                  onClick={() => copyShortLink(form.short_id)}
                  title="Copy form link"
                >
                  <Link className="w-4 h-4 mr-1" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center rounded-md"
                  onClick={() => handleTogglePublish(form.id, !form.is_draft)}
                  title={form.is_draft ? 'Publish this form' : 'Unpublish this form'}
                >
                  {form.is_draft ? <Globe className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                  {form.is_draft ? 'Publish' : 'Draft'}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-center rounded-md">
                      <MoreVertical className="w-4 h-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push(`/form/${form.id}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/edit-form/${form.id}`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/responses/${form.id}`)}>
                      <BarChart className="w-4 h-4 mr-2" />
                      Analyze Responses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => {
                        setFormToDelete(form.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Form
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog
                  open={deleteDialogOpen && formToDelete === form.id}
                  onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    if (!open) setFormToDelete(null)
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle className="h-5 w-5" />
                        <DialogTitle className="font-bold">Confirm deletion</DialogTitle>
                      </div>
                      <DialogDescription className="pt-2 text-muted-foreground">
                        Are you sure you want to delete this form? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded"
                        onClick={() => formToDelete && handleDeleteForm(formToDelete)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
              {!!form.expires_at && (
                <p className="text-xs text-muted-foreground text-center">
                  Form responses accepted until {new Date(form.expires_at).toLocaleDateString()} at{' '}
                  {new Date(form.expires_at).toLocaleTimeString('en-US', { hour12: false })}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
      <Dialog open={!!formToUnpublish} onOpenChange={(open) => !open && setFormToUnpublish(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unpublish Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to unpublish "{formToUnpublish?.title}"?
              <br />
              <br />
              <strong>Important:</strong> Once the form is moved to draft mode, the form will no longer be accessible to
              users and they will not be able to submit responses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormToUnpublish(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnpublish}>
              Unpublish Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProtectedPage(Dashboard)
