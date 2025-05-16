'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  EmailIntegrationConfig,
  FormIntegration,
  IntegrationType,
  MakeIntegrationConfig,
  SlackIntegrationConfig,
  TelegramIntegrationConfig,
  WebhookIntegrationConfig,
  ZapierIntegrationConfig,
  IntegrationConfig,
} from '@/lib/types/integration'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MakeIntegrationForm } from './make'
import { EmailIntegrationForm } from './email'
import { SlackIntegrationForm } from './slack'
import { TelegramIntegrationForm } from './telegram'
import { WebhookIntegrationForm } from './webhook'
import { ZapierIntegrationForm } from './zapier'

interface IntegrationFormProps {
  formId: string
  integration?: FormIntegration
  onSave: (integration: FormIntegration) => Promise<void>
  onCancel: () => void
}

export function IntegrationForm({ formId, integration, onSave, onCancel }: IntegrationFormProps) {
  const [integrationType, setIntegrationType] = useState<IntegrationType>(integration?.integration_type || 'email')
  const [name, setName] = useState(integration?.config.name || '')
  const [nameError, setNameError] = useState('')
  const [isEnabled, setIsEnabled] = useState(integration?.is_enabled !== false)
  const [saving, setSaving] = useState(false)

  // State for type-specific configuration
  const [currentConfig, setCurrentConfig] = useState<Record<string, any>>({})
  const [isConfigValid, setIsConfigValid] = useState(true)

  // Handle updates from integration type components
  const handleConfigChange = <T extends Record<string, any>>(config: T, isValid: boolean) => {
    setCurrentConfig(config)
    setIsConfigValid(isValid)
  }

  // Handle form submission
  const handleSave = async () => {
    // Validate common fields
    if (!name.trim()) {
      setNameError('Please provide a name for this integration')
      return
    }

    // Ensure integration specific config is valid
    if (!isConfigValid) {
      return
    }

    setSaving(true)

    try {
      // Combine name with type-specific config
      const config = {
        name,
        ...currentConfig,
      }

      const updatedIntegration: FormIntegration = {
        id: integration?.id,
        form_id: formId,
        integration_type: integrationType,
        is_enabled: isEnabled,
        config: config as IntegrationConfig,
        created_at: integration?.created_at,
        updated_at: new Date().toISOString(),
      }

      await onSave(updatedIntegration)
    } catch (error) {
      console.error('Error saving integration:', error)
      toast.error('Failed to save integration')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration ? 'Edit Integration' : 'Add Integration'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="integration-name">Integration Name</Label>
          <Input
            id="integration-name"
            placeholder="e.g., Email Notification"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value.trim()) setNameError('')
            }}
            className={nameError ? 'border-destructive' : ''}
          />
          {nameError && <p className="text-sm text-destructive mt-1">{nameError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="integration-type">Integration Type</Label>
          <Select
            value={integrationType}
            onValueChange={(value) => {
              setIntegrationType(value as IntegrationType)
              setNameError('')
              // Reset config when changing integration type
              setCurrentConfig({})
            }}
            disabled={!!integration?.id}
          >
            <SelectTrigger id="integration-type">
              <SelectValue placeholder="Select integration type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Notification</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="zapier">Zapier</SelectItem>
              <SelectItem value="make">Make.com</SelectItem>
              <SelectItem value="webhook">Custom Webhook</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="integration-enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
          <Label htmlFor="integration-enabled">Enabled</Label>
        </div>

        {/* Email Configuration */}
        {integrationType === 'email' && (
          <EmailIntegrationForm
            initialConfig={
              integration?.integration_type === 'email' ? (integration.config as EmailIntegrationConfig) : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}

        {/* Slack Configuration */}
        {integrationType === 'slack' && (
          <SlackIntegrationForm
            initialConfig={
              integration?.integration_type === 'slack' ? (integration.config as SlackIntegrationConfig) : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}

        {/* Telegram Configuration */}
        {integrationType === 'telegram' && (
          <TelegramIntegrationForm
            initialConfig={
              integration?.integration_type === 'telegram'
                ? (integration.config as TelegramIntegrationConfig)
                : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}

        {/* Zapier Configuration */}
        {integrationType === 'zapier' && (
          <ZapierIntegrationForm
            initialConfig={
              integration?.integration_type === 'zapier' ? (integration.config as ZapierIntegrationConfig) : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}

        {/* Make.com Configuration */}
        {integrationType === 'make' && (
          <MakeIntegrationForm
            initialConfig={
              integration?.integration_type === 'make' ? (integration.config as MakeIntegrationConfig) : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}

        {/* Webhook Configuration */}
        {integrationType === 'webhook' && (
          <WebhookIntegrationForm
            initialConfig={
              integration?.integration_type === 'webhook' ? (integration.config as WebhookIntegrationConfig) : undefined
            }
            onConfigChange={handleConfigChange}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Integration'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
