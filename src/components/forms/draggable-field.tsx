'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { GripVertical } from 'lucide-react'
import type { FormField } from '@/lib/types/form'
import { cn } from '@/lib/utils'

interface DraggableFieldProps {
  field: FormField
  children: React.ReactNode
}

export function DraggableField({ field, children }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, active } = useSortable({
    id: field.id,
    animateLayoutChanges: () => false, // Disable automatic layout changes
  })

  // Create a more effective style object for smooth dragging
  const style = {
    // Use Translate3d for hardware acceleration and keep width at 100%
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 999 : 1,
    // Prevent width distortion during dragging
    width: '100%',
    // Add will-change for better performance
    willChange: isDragging ? 'transform' : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} className={cn('mb-4 relative group', isDragging && 'opacity-95 touch-none')}>
      <Card
        className={cn(
          'transition-all duration-200 w-full',
          isDragging ? 'shadow-lg border-primary transform-none' : 'shadow-sm hover:shadow-md'
        )}
      >
        <div className="flex">
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'py-6 px-4 flex items-center justify-center cursor-grab',
              'hover:text-primary transition-colors',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              isDragging && 'cursor-grabbing bg-primary/5'
            )}
            tabIndex={0}
            aria-label="Drag to reorder"
            role="button"
            data-dnd-handle="true"
          >
            <GripVertical
              className={cn(
                'h-6 w-6 transition-transform',
                'group-hover:scale-110',
                isDragging && 'scale-110 text-primary'
              )}
            />
          </div>
          <div className="flex-1 py-1">{children}</div>
        </div>
      </Card>
    </div>
  )
}
