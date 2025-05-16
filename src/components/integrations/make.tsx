import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MakeIntegrationConfig } from '@/lib/types/integration'

export interface MakeIntegrationFormProps {
  initialConfig?: Partial<MakeIntegrationConfig>
  onConfigChange: (config: Omit<MakeIntegrationConfig, 'name'>, isValid: boolean) => void
}

export function MakeIntegrationForm({ initialConfig, onConfigChange }: MakeIntegrationFormProps) {
  const [makeWebhookUrl, setMakeWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [makeWebhookUrlError, setMakeWebhookUrlError] = useState<string>('')

  // Validate the form and update parent component
  const validateAndUpdateConfig = () => {
    let isValid = true

    // Clear previous errors
    setMakeWebhookUrlError('')

    // Validate required fields
    if (!makeWebhookUrl.trim()) {
      setMakeWebhookUrlError('Please provide a Make.com webhook URL')
      isValid = false
    }

    // Create config object
    const config: Omit<MakeIntegrationConfig, 'name'> = {
      webhook_url: makeWebhookUrl,
    }

    // Notify parent of config change and validity
    onConfigChange(config, isValid)

    return isValid
  }

  // Validate and update config when form values change
  useEffect(() => {
    validateAndUpdateConfig()
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
      {makeWebhookUrlError && <p className="text-sm text-destructive mt-1">{makeWebhookUrlError}</p>}
    </div>
  )
}
