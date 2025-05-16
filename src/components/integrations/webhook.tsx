import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { WebhookIntegrationConfig } from '@/lib/types/integration'

export interface WebhookIntegrationFormProps {
  initialConfig?: Partial<WebhookIntegrationConfig>
  onConfigChange: (config: Omit<WebhookIntegrationConfig, 'name'>, isValid: boolean) => void
}

export function WebhookIntegrationForm({ initialConfig, onConfigChange }: WebhookIntegrationFormProps) {
  const [webhookUrl, setWebhookUrl] = useState<string>(initialConfig?.url || '')
  const [webhookUrlError, setWebhookUrlError] = useState<string>('')
  const [webhookMethod, setWebhookMethod] = useState<string>(initialConfig?.method || 'POST')
  const [webhookHeaders, setWebhookHeaders] = useState<string>(
    initialConfig?.headers ? JSON.stringify(initialConfig.headers, null, 2) : '{}'
  )
  const [webhookHeadersError, setWebhookHeadersError] = useState<string>('')
  const [includeFormData, setIncludeFormData] = useState<boolean>(initialConfig?.include_form_data !== false)

  // Validate the form and update parent component
  const validateAndUpdateConfig = () => {
    let isValid = true

    // Clear previous errors
    setWebhookUrlError('')
    setWebhookHeadersError('')

    // Validate required fields
    if (!webhookUrl.trim()) {
      setWebhookUrlError('Please provide a webhook URL')
      isValid = false
    }

    // Validate JSON format of headers
    let parsedHeaders: Record<string, string> = {}
    try {
      parsedHeaders = JSON.parse(webhookHeaders)
    } catch (error) {
      setWebhookHeadersError('Invalid JSON format for headers')
      isValid = false
    }

    if (!isValid) return false

    // Create config object
    const config: Omit<WebhookIntegrationConfig, 'name'> = {
      url: webhookUrl,
      method: webhookMethod as 'GET' | 'POST' | 'PUT' | 'PATCH',
      headers: parsedHeaders,
      include_form_data: includeFormData,
    }

    // Notify parent of config change and validity
    onConfigChange(config, isValid)

    return isValid
  }

  // Validate and update config when form values change
  useEffect(() => {
    validateAndUpdateConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookUrl, webhookMethod, webhookHeaders, includeFormData])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">URL</Label>
        <Input
          id="webhook-url"
          placeholder="https://example.com/webhook"
          value={webhookUrl}
          onChange={(e) => {
            setWebhookUrl(e.target.value)
            if (e.target.value.trim()) setWebhookUrlError('')
          }}
          className={webhookUrlError ? 'border-destructive' : ''}
        />
        {webhookUrlError && <p className="text-sm text-destructive mt-1">{webhookUrlError}</p>}
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
          onChange={(e) => {
            setWebhookHeaders(e.target.value)
            try {
              JSON.parse(e.target.value)
              setWebhookHeadersError('')
            } catch (error) {
              // Don't show error immediately while typing
            }
          }}
          rows={4}
          className={webhookHeadersError ? 'border-destructive' : ''}
        />
        {webhookHeadersError && <p className="text-sm text-destructive mt-1">{webhookHeadersError}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="include-form-data" checked={includeFormData} onCheckedChange={setIncludeFormData} />
        <Label htmlFor="include-form-data">Include form metadata</Label>
      </div>
    </div>
  )
}
