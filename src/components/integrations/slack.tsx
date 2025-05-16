import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlackIntegrationConfig } from '@/lib/types/integration'

export interface SlackIntegrationFormProps {
  initialConfig?: Partial<SlackIntegrationConfig>
  onConfigChange: (config: Omit<SlackIntegrationConfig, 'name'>, isValid: boolean) => void
}

export function SlackIntegrationForm({ initialConfig, onConfigChange }: SlackIntegrationFormProps) {
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [slackWebhookUrlError, setSlackWebhookUrlError] = useState<string>('')
  const [slackChannel, setSlackChannel] = useState<string>(initialConfig?.channel || '')

  // Validate the form and update parent component
  const validateAndUpdateConfig = () => {
    let isValid = true

    // Clear previous errors
    setSlackWebhookUrlError('')

    // Validate required fields
    if (!slackWebhookUrl.trim()) {
      setSlackWebhookUrlError('Please provide a Slack webhook URL')
      isValid = false
    }

    // Create config object
    const config: Omit<SlackIntegrationConfig, 'name'> = {
      webhook_url: slackWebhookUrl,
      channel: slackChannel || undefined,
    }

    // Notify parent of config change and validity
    onConfigChange(config, isValid)

    return isValid
  }

  // Validate and update config when form values change
  useEffect(() => {
    validateAndUpdateConfig()
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
        {slackWebhookUrlError && <p className="text-sm text-destructive mt-1">{slackWebhookUrlError}</p>}
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
