import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TelegramIntegrationConfig } from '@/lib/types/integration'

export interface TelegramIntegrationFormProps {
  initialConfig?: Partial<TelegramIntegrationConfig>
  onConfigChange: (config: Omit<TelegramIntegrationConfig, 'name'>, isValid: boolean) => void
  showValidationErrors?: boolean
}

export function TelegramIntegrationForm({
  initialConfig,
  onConfigChange,
  showValidationErrors = false,
}: TelegramIntegrationFormProps) {
  const [telegramBotToken, setTelegramBotToken] = useState<string>(initialConfig?.bot_token || '')
  const [telegramBotTokenError, setTelegramBotTokenError] = useState<string>('')
  const [telegramChatId, setTelegramChatId] = useState<string>(initialConfig?.chat_id || '')
  const [telegramChatIdError, setTelegramChatIdError] = useState<string>('')

  // Validate the form without showing errors
  const validateForm = (): boolean => {
    return telegramBotToken.trim().length > 0 && telegramChatId.trim().length > 0
  }

  // Validate the form and show errors if needed
  const validateAndShowErrors = (): boolean => {
    // Clear previous errors
    setTelegramBotTokenError('')
    setTelegramChatIdError('')

    let isValid = true

    // Validate required fields
    if (!telegramBotToken.trim()) {
      setTelegramBotTokenError('Please provide a Telegram bot token')
      isValid = false
    }

    if (!telegramChatId.trim()) {
      setTelegramChatIdError('Please provide a Telegram chat ID')
      isValid = false
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
    const config: Omit<TelegramIntegrationConfig, 'name'> = {
      bot_token: telegramBotToken,
      chat_id: telegramChatId,
    }

    // Determine validity without showing errors
    const isValid = validateForm()

    onConfigChange(config, isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegramBotToken, telegramChatId])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="telegram-token">Bot Token</Label>
        <Input
          id="telegram-token"
          placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
          value={telegramBotToken}
          onChange={(e) => {
            setTelegramBotToken(e.target.value)
            if (e.target.value.trim()) setTelegramBotTokenError('')
          }}
          className={telegramBotTokenError ? 'border-destructive' : ''}
        />
        {showValidationErrors && telegramBotTokenError && (
          <p className="text-sm text-destructive mt-1">{telegramBotTokenError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="telegram-chat">Chat ID</Label>
        <Input
          id="telegram-chat"
          placeholder="-1001234567890"
          value={telegramChatId}
          onChange={(e) => {
            setTelegramChatId(e.target.value)
            if (e.target.value.trim()) setTelegramChatIdError('')
          }}
          className={telegramChatIdError ? 'border-destructive' : ''}
        />
        {showValidationErrors && telegramChatIdError && (
          <p className="text-sm text-destructive mt-1">{telegramChatIdError}</p>
        )}
      </div>
    </div>
  )
}
