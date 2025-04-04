'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { TimePicker } from '@/components/ui/time-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
}

export function DateTimePicker({ date, setDate, label = 'Pick a date and time' }: DateTimePickerProps) {
  const formattedDate = date ? format(date, "PPP 'at' p") : label

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
        <div className="p-3 border-t border-border">
          <TimePicker date={date} setDate={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
