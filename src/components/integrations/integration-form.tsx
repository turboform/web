'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { FormIntegration, IntegrationType } from '@/lib/types/integration'
import { Loader2 } from 'lucide-react'

interface IntegrationFormProps {
  formId: string
  integration?: FormIntegration
  onSave: (integration: FormIntegration) => Promise<void>
  onCancel: () => void
}

export function IntegrationForm({ formId, integration, onSave, onCancel }: IntegrationFormProps) {
  const [integrationType, setIntegrationType] = useState<IntegrationType>(integration?.integration_type || 'email')
  const [name, setName] = useState(integration?.config.name || '')
  const [isEnabled, setIsEnabled] = useState(integration?.is_enabled !== false)
  const [saving, setSaving] = useState(false)

  const [emailTo, setEmailTo] = useState<string>(
    integration?.integration_type === 'email' ? (integration.config as any).to?.join(', ') || '' : ''
  )
  const [emailCc, setEmailCc] = useState<string>(
    integration?.integration_type === 'email' ? (integration.config as any).cc?.join(', ') || '' : ''
  )
  const [emailSubject, setEmailSubject] = useState<string>(
    integration?.integration_type === 'email' ? (integration.config as any).subject_template || '' : ''
  )

  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>(
    integration?.integration_type === 'slack' ? (integration.config as any).webhook_url || '' : ''
  )
  const [slackChannel, setSlackChannel] = useState<string>(
    integration?.integration_type === 'slack' ? (integration.config as any).channel || '' : ''
  )

  const [telegramBotToken, setTelegramBotToken] = useState<string>(
    integration?.integration_type === 'telegram' ? (integration.config as any).bot_token || '' : ''
  )
  const [telegramChatId, setTelegramChatId] = useState<string>(
    integration?.integration_type === 'telegram' ? (integration.config as any).chat_id || '' : ''
  )

  const [zapierWebhookUrl, setZapierWebhookUrl] = useState<string>(
    integration?.integration_type === 'zapier' ? (integration.config as any).webhook_url || '' : ''
  )

  const [makeWebhookUrl, setMakeWebhookUrl] = useState<string>(
    integration?.integration_type === 'make' ? (integration.config as any).webhook_url || '' : ''
  )

  const [webhookUrl, setWebhookUrl] = useState<string>(
    integration?.integration_type === 'webhook' ? (integration.config as any).url || '' : ''
  )
  const [webhookMethod, setWebhookMethod] = useState<string>(
    integration?.integration_type === 'webhook' ? (integration.config as any).method || 'POST' : 'POST'
  )
  const [webhookHeaders, setWebhookHeaders] = useState<string>(
    integration?.integration_type === 'webhook'
      ? JSON.stringify((integration.config as any).headers || {}, null, 2)
      : '{}'
  )
  const [includeFormData, setIncludeFormData] = useState<boolean>(
    integration?.integration_type === 'webhook' ? (integration.config as any).include_form_data !== false : true
  )

  const handleSave = async () => {
    if (!name) {
      alert('Please provide a name for this integration')
      return
    }

    setSaving(true)

    try {
      let config: any = { name }

      switch (integrationType) {
        case 'email':
          if (!emailTo) {
            alert('Please provide at least one recipient email address')
            setSaving(false)
            return
          }
          config = {
            ...config,
            to: emailTo
              .split(',')
              .map((email) => email.trim())
              .filter(Boolean),
            cc: emailCc
              ? emailCc
                  .split(',')
                  .map((email) => email.trim())
                  .filter(Boolean)
              : [],
            subject_template: emailSubject || undefined,
          }
          break

        case 'slack':
          if (!slackWebhookUrl) {
            alert('Please provide a Slack webhook URL')
            setSaving(false)
            return
          }
          config = {
            ...config,
            webhook_url: slackWebhookUrl,
            channel: slackChannel || undefined,
          }
          break

        case 'telegram':
          if (!telegramBotToken || !telegramChatId) {
            alert('Please provide both a Telegram bot token and chat ID')
            setSaving(false)
            return
          }
          config = {
            ...config,
            bot_token: telegramBotToken,
            chat_id: telegramChatId,
          }
          break

        case 'zapier':
          if (!zapierWebhookUrl) {
            alert('Please provide a Zapier webhook URL')
            setSaving(false)
            return
          }
          config = {
            ...config,
            webhook_url: zapierWebhookUrl,
          }
          break

        case 'make':
          if (!makeWebhookUrl) {
            alert('Please provide a Make.com webhook URL')
            setSaving(false)
            return
          }
          config = {
            ...config,
            webhook_url: makeWebhookUrl,
          }
          break

        case 'webhook':
          if (!webhookUrl) {
            alert('Please provide a webhook URL')
            setSaving(false)
            return
          }

          let headers = {}
          try {
            headers = JSON.parse(webhookHeaders)
          } catch (error) {
            alert('Invalid JSON format for headers')
            setSaving(false)
            return
          }

          config = {
            ...config,
            url: webhookUrl,
            method: webhookMethod,
            headers,
            include_form_data: includeFormData,
          }
          break
      }

      const updatedIntegration: FormIntegration = {
        id: integration?.id,
        form_id: formId,
        integration_type: integrationType,
        is_enabled: isEnabled,
        config,
        created_at: integration?.created_at,
        updated_at: new Date().toISOString(),
      }

      await onSave(updatedIntegration)
    } catch (error) {
      console.error('Error saving integration:', error)
      alert('Failed to save integration')
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
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="integration-type">Integration Type</Label>
          <Select
            value={integrationType}
            onValueChange={(value) => setIntegrationType(value as IntegrationType)}
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To (comma separated)</Label>
              <Input
                id="email-to"
                placeholder="recipient@example.com, another@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-cc">CC (comma separated, optional)</Label>
              <Input
                id="email-cc"
                placeholder="cc@example.com, another-cc@example.com"
                value={emailCc}
                onChange={(e) => setEmailCc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject Template (optional)</Label>
              <Input
                id="email-subject"
                placeholder="New submission for {form_name}"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use {'{form_name}'} to include the form name in the subject
              </p>
            </div>
          </div>
        )}

        {/* Slack Configuration */}
        {integrationType === 'slack' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack-webhook">Webhook URL</Label>
              <Input
                id="slack-webhook"
                placeholder="https://hooks.slack.com/services/..."
                value={slackWebhookUrl}
                onChange={(e) => setSlackWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-channel">Channel (optional)</Label>
              <Input
                id="slack-channel"
                placeholder="#general"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default channel configured in the webhook
              </p>
            </div>
          </div>
        )}

        {/* Telegram Configuration */}
        {integrationType === 'telegram' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegram-token">Bot Token</Label>
              <Input
                id="telegram-token"
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram-chat">Chat ID</Label>
              <Input
                id="telegram-chat"
                placeholder="-1001234567890"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Zapier Configuration */}
        {integrationType === 'zapier' && (
          <div className="space-y-2">
            <Label htmlFor="zapier-webhook">Webhook URL</Label>
            <Input
              id="zapier-webhook"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={zapierWebhookUrl}
              onChange={(e) => setZapierWebhookUrl(e.target.value)}
            />
          </div>
        )}

        {/* Make.com Configuration */}
        {integrationType === 'make' && (
          <div className="space-y-2">
            <Label htmlFor="make-webhook">Webhook URL</Label>
            <Input
              id="make-webhook"
              placeholder="https://hook.eu1.make.com/..."
              value={makeWebhookUrl}
              onChange={(e) => setMakeWebhookUrl(e.target.value)}
            />
          </div>
        )}

        {/* Webhook Configuration */}
        {integrationType === 'webhook' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-method">Method</Label>
              <Select value={webhookMethod} onValueChange={setWebhookMethod}>
                <SelectTrigger id="webhook-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-headers">Headers (JSON)</Label>
              <Textarea
                id="webhook-headers"
                placeholder='{"Content-Type": "application/json", "X-Custom-Header": "value"}'
                value={webhookHeaders}
                onChange={(e) => setWebhookHeaders(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="include-form-data" checked={includeFormData} onCheckedChange={setIncludeFormData} />
              <Label htmlFor="include-form-data">Include form metadata</Label>
            </div>
          </div>
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
