import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ZapierIntegrationConfig } from '@/lib/types/integration'

export interface ZapierIntegrationFormProps {
  initialConfig?: Partial<ZapierIntegrationConfig>
  onConfigChange: (config: Omit<ZapierIntegrationConfig, 'name'>, isValid: boolean) => void
  showValidationErrors?: boolean
}

export function ZapierIntegrationForm({
  initialConfig,
  onConfigChange,
  showValidationErrors = false,
}: ZapierIntegrationFormProps) {
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [zapierWebhookUrlError, setZapierWebhookUrlError] = useState<string>('')

  // Validate the form without showing errors
  const validateForm = (): boolean => {
    return zapierWebhookUrl.trim().length > 0
  }

  // Validate the form and show errors if needed
  const validateAndShowErrors = (): boolean => {
    // Clear previous errors
    setZapierWebhookUrlError('')

    // Validate required fields
    if (!zapierWebhookUrl.trim()) {
      setZapierWebhookUrlError('Please provide a Zapier webhook URL')
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
    const config: Omit<ZapierIntegrationConfig, 'name'> = {
      webhook_url: zapierWebhookUrl,
    }

    // Determine validity without showing errors
    const isValid = validateForm()

    onConfigChange(config, isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zapierWebhookUrl])

  return (
    <div className="space-y-2">
      <Label htmlFor="zapier-webhook">Webhook URL</Label>
      <Input
        id="zapier-webhook"
        placeholder="https://hooks.zapier.com/hooks/catch/..."
        value={zapierWebhookUrl}
        onChange={(e) => {
          setZapierWebhookUrl(e.target.value)
          if (e.target.value.trim()) setZapierWebhookUrlError('')
        }}
        className={zapierWebhookUrlError ? 'border-destructive' : ''}
      />
      {showValidationErrors && zapierWebhookUrlError && (
        <p className="text-sm text-destructive mt-1">{zapierWebhookUrlError}</p>
      )}
    </div>
  )
}
