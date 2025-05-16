import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmailIntegrationConfig } from '@/lib/types/integration'

export interface EmailIntegrationFormProps {
  initialConfig?: Partial<EmailIntegrationConfig>
  onConfigChange: (config: Omit<EmailIntegrationConfig, 'name'>, isValid: boolean) => void
}

export function EmailIntegrationForm({ initialConfig, onConfigChange }: EmailIntegrationFormProps) {
  const [emailTo, setEmailTo] = useState<string>(initialConfig?.to?.join(', ') || '')
  const [emailToError, setEmailToError] = useState<string>('')
  const [emailCc, setEmailCc] = useState<string>(initialConfig?.cc?.join(', ') || '')
  const [emailSubject, setEmailSubject] = useState<string>(initialConfig?.subject_template || '')

  // Validate the form and update parent component
  const validateAndUpdateConfig = () => {
    let isValid = true

    // Clear previous errors
    setEmailToError('')

    // Validate required fields
    if (!emailTo.trim()) {
      setEmailToError('Please provide at least one recipient email address')
      isValid = false
    }

    // Create config object
    const config: Omit<EmailIntegrationConfig, 'name'> = {
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

    // Notify parent of config change and validity
    onConfigChange(config, isValid)

    return isValid
  }

  // Validate and update config when form values change
  useEffect(() => {
    validateAndUpdateConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailTo, emailCc, emailSubject])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-to">To (comma separated)</Label>
        <Input
          id="email-to"
          placeholder="recipient@example.com, another@example.com"
          value={emailTo}
          onChange={(e) => {
            setEmailTo(e.target.value)
            if (e.target.value.trim()) setEmailToError('')
          }}
          className={emailToError ? 'border-destructive' : ''}
        />
        {emailToError && <p className="text-sm text-destructive mt-1">{emailToError}</p>}
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
        <p className="text-xs text-muted-foreground">Use {'{form_name}'} to include the form name in the subject</p>
      </div>
    </div>
  )
}
