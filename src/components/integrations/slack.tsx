import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlackIntegrationConfig } from '@/lib/types/integration'

export interface SlackIntegrationFormProps {
  initialConfig?: Partial<SlackIntegrationConfig>
  onConfigChange: (config: Omit<SlackIntegrationConfig, 'name'>, isValid: boolean) => void
  showValidationErrors?: boolean
}

export function SlackIntegrationForm({
  initialConfig,
  onConfigChange,
  showValidationErrors = false,
}: SlackIntegrationFormProps) {
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [slackWebhookUrlError, setSlackWebhookUrlError] = useState<string>('')
  const [slackChannel, setSlackChannel] = useState<string>(initialConfig?.channel || '')

  // Validate the form without showing errors
  const validateForm = (): boolean => {
    return slackWebhookUrl.trim().length > 0
  }

  // Validate the form and show errors if needed
  const validateAndShowErrors = (): boolean => {
    // Clear previous errors
    setSlackWebhookUrlError('')

    // Validate required fields
    if (!slackWebhookUrl.trim()) {
      setSlackWebhookUrlError('Please provide a Slack webhook URL')
      return false
    }

    return true
  }

  // Run validation if showValidationErrors changes to true
  useEffect(() => {
    if (showValidationErrors) {
      validateAndShowErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showValidationErrors])

  // Update parent with current config whenever values change
  useEffect(() => {
    const config: Omit<SlackIntegrationConfig, 'name'> = {
      webhook_url: slackWebhookUrl,
      channel: slackChannel || undefined,
    }

    // Determine validity without showing errors
    const isValid = validateForm()

    onConfigChange(config, isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slackWebhookUrl, slackChannel])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="slack-webhook">Webhook URL</Label>
        <Input
          id="slack-webhook"
          placeholder="https://hooks.slack.com/services/..."
          value={slackWebhookUrl}
          onChange={(e) => {
            setSlackWebhookUrl(e.target.value)
            if (e.target.value.trim()) setSlackWebhookUrlError('')
          }}
          className={slackWebhookUrlError ? 'border-destructive' : ''}
        />
        {showValidationErrors && slackWebhookUrlError && (
          <p className="text-sm text-destructive mt-1">{slackWebhookUrlError}</p>
        )}
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
  )
}
