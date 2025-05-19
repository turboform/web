import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WebhookIntegrationConfig } from '@/lib/types/integration'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export interface WebhookIntegrationFormProps {
  initialConfig?: Partial<WebhookIntegrationConfig>
  onConfigChange: (config: Omit<WebhookIntegrationConfig, 'name'>, isValid: boolean) => void
  showValidationErrors?: boolean
}

export function WebhookIntegrationForm({
  initialConfig,
  onConfigChange,
  showValidationErrors = false,
}: WebhookIntegrationFormProps) {
  const [webhookUrl, setWebhookUrl] = useState<string>(initialConfig?.url || '')
  const [webhookUrlError, setWebhookUrlError] = useState<string>('')
  const [webhookMethod, setWebhookMethod] = useState<string>(initialConfig?.method || 'POST')
  const [webhookHeaders, setWebhookHeaders] = useState<string>(
    initialConfig?.headers ? JSON.stringify(initialConfig.headers, null, 2) : '{}'
  )
  const [webhookHeadersError, setWebhookHeadersError] = useState<string>('')
  const [includeFormData, setIncludeFormData] = useState<boolean>(initialConfig?.include_form_data !== false)

  // Validate the form without showing errors
  const validateForm = (): boolean => {
    return webhookUrl.trim().length > 0 && !!webhookMethod
  }

  // Validate the form and show errors if needed
  const validateAndShowErrors = (): boolean => {
    let isValid = true

    // Clear previous errors
    setWebhookUrlError('')
    setWebhookHeadersError('')

    // Validate required fields
    if (!webhookUrl.trim()) {
      setWebhookUrlError('Please provide a webhook URL')
      isValid = false
    }

    // Parse headers
    if (webhookHeaders.trim()) {
      try {
        JSON.parse(webhookHeaders)
      } catch (error) {
        setWebhookHeadersError('Headers must be a valid JSON object')
        isValid = false
      }
    }

    return isValid
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
    // Parse headers
    let parsedHeaders: Record<string, string> | undefined = undefined
    if (webhookHeaders.trim()) {
      try {
        parsedHeaders = JSON.parse(webhookHeaders)
      } catch (error) {
        // We'll handle this in validateAndShowErrors, not here
      }
    }

    const config: Omit<WebhookIntegrationConfig, 'name'> = {
      url: webhookUrl,
      method: webhookMethod as 'GET' | 'POST' | 'PUT' | 'PATCH',
      headers: parsedHeaders,
      include_form_data: includeFormData,
    }

    // Determine validity without showing errors
    const isValid = validateForm()

    onConfigChange(config, isValid)
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
        {showValidationErrors && webhookUrlError && <p className="text-sm text-destructive mt-1">{webhookUrlError}</p>}
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
              // We'll handle this in validateAndShowErrors, not here
            }
          }}
          rows={4}
          className={webhookHeadersError ? 'border-destructive' : ''}
        />
        {showValidationErrors && webhookHeadersError && (
          <p className="text-sm text-destructive mt-1">{webhookHeadersError}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="include-form-data" checked={includeFormData} onCheckedChange={setIncludeFormData} />
        <Label htmlFor="include-form-data">Include form metadata</Label>
      </div>
    </div>
  )
}
