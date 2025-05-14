'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/auth-provider'
import { FormIntegration } from '@/lib/types/integration'
import { IntegrationForm } from './integration-form'
import { Loader2, Plus, Trash2, Settings, Mail, MessageSquare, Webhook, ExternalLink } from 'lucide-react'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface IntegrationsListProps {
  formId: string
}

export function IntegrationsList({ formId }: IntegrationsListProps) {
  const { session } = useAuth()
  const [integrations, setIntegrations] = useState<FormIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<FormIntegration | undefined>(undefined)
  const [deletingIntegration, setDeletingIntegration] = useState<FormIntegration | undefined>(undefined)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/forms/${formId}/integrations`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
      setIntegrations(response.data.integrations || [])
    } catch (error) {
      console.error('Error fetching integrations:', error)
      toast.error('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.access_token) {
      fetchIntegrations()
    }
  }, [formId, session?.access_token])

  const handleSaveIntegration = async (integration: FormIntegration) => {
    try {
      if (integration.id) {
        await axios.put(
          `/api/integrations/${integration.id}`,
          {
            integration_type: integration.integration_type,
            is_enabled: integration.is_enabled,
            config: integration.config,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )
        toast.success('Integration updated successfully')
      } else {
        await axios.post(
          '/api/integrations',
          {
            form_id: formId,
            integration_type: integration.integration_type,
            is_enabled: integration.is_enabled,
            config: integration.config,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )
        toast.success('Integration created successfully')
      }

      await fetchIntegrations()
      setShowForm(false)
      setEditingIntegration(undefined)
    } catch (error) {
      console.error('Error saving integration:', error)
      toast.error('Failed to save integration')
    }
  }

  const handleToggleStatus = async (integration: FormIntegration) => {
    try {
      setUpdatingStatus(integration.id)
      await axios.put(
        `/api/integrations/${integration.id}`,
        {
          is_enabled: !integration.is_enabled,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
      
      setIntegrations(
        integrations.map((i) =>
          i.id === integration.id ? { ...i, is_enabled: !integration.is_enabled } : i
        )
      )
      
      toast.success(`Integration ${!integration.is_enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Error toggling integration status:', error)
      toast.error('Failed to update integration')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteIntegration = async () => {
    if (!deletingIntegration) return
    
    try {
      await axios.delete(`/api/integrations/${deletingIntegration.id}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
      
      setIntegrations(integrations.filter((i) => i.id !== deletingIntegration.id))
      toast.success('Integration deleted')
    } catch (error) {
      console.error('Error deleting integration:', error)
      toast.error('Failed to delete integration')
    } finally {
      setDeletingIntegration(undefined)
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />
      case 'slack':
      case 'telegram':
        return <MessageSquare className="h-5 w-5" />
      case 'zapier':
      case 'make':
        return <ExternalLink className="h-5 w-5" />
      case 'webhook':
        return <Webhook className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getIntegrationTitle = (type: string) => {
    switch (type) {
      case 'email':
        return 'Email Notification'
      case 'slack':
        return 'Slack'
      case 'telegram':
        return 'Telegram'
      case 'zapier':
        return 'Zapier'
      case 'make':
        return 'Make.com'
      case 'webhook':
        return 'Custom Webhook'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  if (showForm || editingIntegration) {
    return (
      <IntegrationForm
        formId={formId}
        integration={editingIntegration}
        onSave={handleSaveIntegration}
        onCancel={() => {
          setShowForm(false)
          setEditingIntegration(undefined)
        }}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Integrations</CardTitle>
              <CardDescription>
                Configure notifications and actions that trigger when a form is submitted
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : integrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No integrations configured yet.</p>
              <p className="text-sm mt-2">
                Add an integration to get notified when someone submits this form.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      {getIntegrationIcon(integration.integration_type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.config.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getIntegrationTitle(integration.integration_type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={integration.is_enabled}
                      onCheckedChange={() => handleToggleStatus(integration)}
                      disabled={updatingStatus === integration.id}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIntegration(integration)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingIntegration(integration)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingIntegration} onOpenChange={(open) => !open && setDeletingIntegration(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Integration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this integration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteIntegration} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
