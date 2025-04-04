'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
}

export function TimePicker({ date, setDate, label = 'Pick a time' }: TimePickerProps) {
  // Generate hours options (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Generate minutes options (0, 15, 30, 45)
  const minutes = [0, 15, 30, 45]

  // Get current hours/minutes if date exists, or default to noon
  const currentHour = date ? date.getHours() : 12
  const currentMinute = date ? Math.floor(date.getMinutes() / 15) * 15 : 0

  const setTime = (hours: number, minutes: number) => {
    if (!date) {
      // If no date is set, create a new one for today
      const newDate = new Date()
      newDate.setHours(hours, minutes, 0, 0)
      setDate(newDate)
    } else {
      // Update the existing date's time
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, 0, 0)
      setDate(newDate)
    }
  }

  const handleHourChange = (value: string) => {
    setTime(parseInt(value), currentMinute)
  }

  const handleMinuteChange = (value: string) => {
    setTime(currentHour, parseInt(value))
  }

  // Format time display
  const formatTimeDisplay = () => {
    if (!date) return label

    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Format as HH:MM
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTimeDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Hours</span>
            <Select defaultValue={currentHour.toString()} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Minutes</span>
            <Select defaultValue={currentMinute.toString()} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
