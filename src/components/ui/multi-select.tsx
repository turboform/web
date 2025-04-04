'use client'

import * as React from 'react'
import { X, Check, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import * as SelectPrimitive from '@radix-ui/react-select'

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
}: MultiSelectProps) {
  // Toggle selection when an option is clicked
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  // Clear all selections
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange([])
  }

  // Remove a specific selection
  const handleRemove = (e: React.MouseEvent, value: string) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  return (
    <SelectPrimitive.Root
      open={false} // We're manually controlling this
      onOpenChange={() => {}} // No-op to prevent warnings
    >
      <div className="relative w-full">
        <SelectPrimitive.Trigger
          className={cn(
            'flex w-full min-h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'flex-wrap',
            className
          )}
          onClick={(e) => {
            // Find the select element and toggle it
            const selectElement = document.getElementById('multi-select-content')
            if (selectElement) {
              if (selectElement.style.display === 'none') {
                selectElement.style.display = 'block'
              } else {
                selectElement.style.display = 'none'
              }
            }
          }}
        >
          <div className="flex flex-wrap gap-1 items-center max-w-full overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1 max-w-full">
                {selected.map((value) => (
                  <Badge key={value} variant="secondary" className="mr-1 mb-1 max-w-[150px] truncate">
                    <span className="truncate">{options.find((option) => option.value === value)?.label || value}</span>
                    <X className="ml-1 h-3 w-3 cursor-pointer shrink-0" onClick={(e) => handleRemove(e, value)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center self-start pl-2">
            {selected.length > 0 && (
              <X className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100 mr-1 shrink-0" onClick={handleClear} />
            )}
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>
        </SelectPrimitive.Trigger>

        {/* The dropdown content */}
        <div
          id="multi-select-content"
          className="absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
          style={{ display: 'none' }}
        >
          <div className="w-full max-h-[200px] overflow-auto p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  selected.includes(option.value) && 'bg-accent/50'
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                      selected.includes(option.value) ? 'bg-primary border-primary' : 'border-input'
                    )}
                  >
                    {selected.includes(option.value) && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SelectPrimitive.Root>
  )
}
