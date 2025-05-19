import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MakeIntegrationConfig } from '@/lib/types/integration'

export interface MakeIntegrationFormProps {
  initialConfig?: Partial<MakeIntegrationConfig>
  onConfigChange: (config: Omit<MakeIntegrationConfig, 'name'>, isValid: boolean) => void
  showValidationErrors?: boolean
}

export function MakeIntegrationForm({
  initialConfig,
  onConfigChange,
  showValidationErrors = false,
}: MakeIntegrationFormProps) {
  const [makeWebhookUrl, setMakeWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [makeWebhookUrlError, setMakeWebhookUrlError] = useState<string>('')

  // Validate the form without showing errors
  const validateForm = (): boolean => {
    return makeWebhookUrl.trim().length > 0
  }

  // Validate the form and show errors if needed
  const validateAndShowErrors = (): boolean => {
    // Clear previous errors
    setMakeWebhookUrlError('')

    // Validate required fields
    if (!makeWebhookUrl.trim()) {
      setMakeWebhookUrlError('Please provide a Make webhook URL')
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
    const config: Omit<MakeIntegrationConfig, 'name'> = {
      webhook_url: makeWebhookUrl,
    }

    // Determine validity without showing errors
    const isValid = validateForm()

    onConfigChange(config, isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeWebhookUrl])

  return (
    <div className="space-y-2">
      <Label htmlFor="make-webhook">Webhook URL</Label>
      <Input
        id="make-webhook"
        placeholder="https://hook.eu1.make.com/..."
        value={makeWebhookUrl}
        onChange={(e) => {
          setMakeWebhookUrl(e.target.value)
          if (e.target.value.trim()) setMakeWebhookUrlError('')
        }}
        className={makeWebhookUrlError ? 'border-destructive' : ''}
      />
      {showValidationErrors && makeWebhookUrlError && (
        <p className="text-sm text-destructive mt-1">{makeWebhookUrlError}</p>
      )}
    </div>
  )
}
