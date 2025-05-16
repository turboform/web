import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ZapierIntegrationConfig } from '@/lib/types/integration'

export interface ZapierIntegrationFormProps {
  initialConfig?: Partial<ZapierIntegrationConfig>
  onConfigChange: (config: Omit<ZapierIntegrationConfig, 'name'>, isValid: boolean) => void
}

export function ZapierIntegrationForm({ initialConfig, onConfigChange }: ZapierIntegrationFormProps) {
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState<string>(initialConfig?.webhook_url || '')
  const [zapierWebhookUrlError, setZapierWebhookUrlError] = useState<string>('')

  // Validate the form and update parent component
  const validateAndUpdateConfig = () => {
    let isValid = true

    // Clear previous errors
    setZapierWebhookUrlError('')

    // Validate required fields
    if (!zapierWebhookUrl.trim()) {
      setZapierWebhookUrlError('Please provide a Zapier webhook URL')
      isValid = false
    }

    // Create config object
    const config: Omit<ZapierIntegrationConfig, 'name'> = {
      webhook_url: zapierWebhookUrl,
    }

    // Notify parent of config change and validity
    onConfigChange(config, isValid)

    return isValid
  }

  // Validate and update config when form values change
  useEffect(() => {
    validateAndUpdateConfig()
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
      {zapierWebhookUrlError && <p className="text-sm text-destructive mt-1">{zapierWebhookUrlError}</p>}
    </div>
  )
}
