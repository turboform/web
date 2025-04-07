'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Minus, PencilLine, Check, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { DraggableField } from './draggable-field'
import type { Form, FormField } from '@/lib/types/form'

interface FormPreviewProps {
  form: Form
  editable?: boolean
  onFormChange?: (updatedForm: Form) => void
}

export function FormPreview({ form, editable = false, onFormChange }: FormPreviewProps) {
  const [editableForm, setEditableForm] = useState<Form>({ ...form })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [newOption, setNewOption] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  // Set up DnD sensors with more permissive settings
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Much more permissive activation constraints for smoother dragging
      activationConstraint: {
        distance: 1, // Minimal distance required to start dragging
        delay: 0, // No delay before starting the drag
        tolerance: 10, // Higher tolerance for better tracking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    if (typeof event.active.id === 'string') {
      setActiveId(event.active.id)
    }
  }

  // Handle drag end with improved error handling
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    // Enhanced error checking
    if (!active || !over || typeof active.id !== 'string' || typeof over.id !== 'string') {
      return
    }

    // Only update if the position actually changed
    if (active.id !== over.id) {
      // Find the indices of the items
      const oldIndex = editableForm.schema.findIndex((field) => field.id === active.id)
      const newIndex = editableForm.schema.findIndex((field) => field.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        console.log(`Moving item from index ${oldIndex} to ${newIndex}`)

        // Create new array with the updated order
        const newSchema = arrayMove(editableForm.schema, oldIndex, newIndex)

        // Update form
        const updatedForm = {
          ...editableForm,
          schema: newSchema,
        }

        // Ensure we're not triggering unnecessary re-renders
        if (JSON.stringify(updatedForm.schema) !== JSON.stringify(editableForm.schema)) {
          updateForm(updatedForm)
        }
      }
    }
  }

  // Update the parent component when form changes
  const updateForm = (updatedForm: Form) => {
    setEditableForm(updatedForm)
    if (onFormChange) {
      onFormChange(updatedForm)
    }
  }

  // Handle title edit
  const handleTitleChange = (title: string) => {
    updateForm({ ...editableForm, title })
  }

  // Handle description edit
  const handleDescriptionChange = (description: string) => {
    updateForm({ ...editableForm, description })
  }

  // Handle field label edit
  const handleFieldLabelChange = (id: string, label: string) => {
    const updatedSchema = editableForm.schema.map((field) => (field.id === id ? { ...field, label } : field))
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Handle field placeholder edit
  const handleFieldPlaceholderChange = (id: string, placeholder: string) => {
    const updatedSchema = editableForm.schema.map((field) => (field.id === id ? { ...field, placeholder } : field))
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Handle field type change
  const handleFieldTypeChange = (id: string, type: FormField['type']) => {
    const updatedSchema = editableForm.schema.map((field) => {
      if (field.id === id) {
        // Add default options if changing to radio, select, or multi_select
        if (
          (type === 'radio' || type === 'select' || type === 'multi_select') &&
          (!field.options || field.options.length === 0)
        ) {
          return { ...field, type, options: ['Option 1', 'Option 2'] }
        }
        return { ...field, type }
      }
      return field
    })
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Handle field required toggle
  const handleRequiredToggle = (id: string, required: boolean) => {
    const updatedSchema = editableForm.schema.map((field) => (field.id === id ? { ...field, required } : field))
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Handle option edit for radio/select fields
  const handleOptionChange = (fieldId: string, index: number, value: string) => {
    const updatedSchema = editableForm.schema.map((field) => {
      if (field.id === fieldId && field.options) {
        const updatedOptions = [...field.options]
        updatedOptions[index] = value
        return { ...field, options: updatedOptions }
      }
      return field
    })
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Add new option to radio/select fields
  const addOption = (fieldId: string) => {
    if (!newOption.trim()) return

    const updatedSchema = editableForm.schema.map((field) => {
      if (field.id === fieldId) {
        const options = field.options ? [...field.options, newOption] : [newOption]
        return { ...field, options }
      }
      return field
    })
    updateForm({ ...editableForm, schema: updatedSchema })
    setNewOption('')
  }

  // Remove option from radio/select fields
  const removeOption = (fieldId: string, optionIndex: number) => {
    const updatedSchema = editableForm.schema.map((field) => {
      if (field.id === fieldId && field.options && field.options.length > 1) {
        const updatedOptions = field.options.filter((_, index) => index !== optionIndex)
        return { ...field, options: updatedOptions }
      }
      return field
    })
    updateForm({ ...editableForm, schema: updatedSchema })
  }

  // Handle checkbox status for the active form
  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    // setFormResponses(prev => ({
    //   ...prev,
    //   [fieldId]: checked
    // }));
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        {editingTitle ? (
          <div className="space-y-2">
            <Input
              value={editableForm.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-2xl font-semibold"
              placeholder="Form Title"
            />
            <div className="flex space-x-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => setEditingTitle(false)}>
                <Check className="w-4 h-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        ) : (
          <CardTitle className="flex justify-between items-center">
            <span>{editableForm.title}</span>
            {editable && (
              <Button size="sm" variant="ghost" onClick={() => setEditingTitle(true)}>
                <PencilLine className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </CardTitle>
        )}

        {editingDescription ? (
          <div className="space-y-2 mt-2">
            <Textarea
              value={editableForm.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Form Description"
              rows={3}
            />
            <div className="flex space-x-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => setEditingDescription(false)}>
                <Check className="w-4 h-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        ) : (
          <CardDescription className="flex justify-between items-center mt-2">
            <span>{editableForm.description}</span>
            {editable && (
              <Button size="sm" variant="ghost" onClick={() => setEditingDescription(true)}>
                <PencilLine className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {editable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // Use a combination of modifiers for better control
            modifiers={[restrictToVerticalAxis]}
            // Add measuring strategy for better positioning
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            // Add automatic scrolling for large forms
            autoScroll={{
              enabled: true,
              threshold: {
                x: 0,
                y: 0.2,
              },
            }}
          >
            <SortableContext
              items={editableForm.schema.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {editableForm.schema.map((field, index) => (
                <DraggableField key={field.id} field={field}>
                  <div className="py-4 px-4">
                    {/* Field editing UI */}
                    {editingField === field.id ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div className="flex-grow space-y-2">
                            <Label>Question</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                              placeholder="Enter question text"
                            />
                          </div>

                          <div className="ml-2 flex flex-col space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) => handleFieldTypeChange(field.id, value as FormField['type'])}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Field Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="textarea">Text Area</SelectItem>
                                <SelectItem value="checkbox">Yes/No</SelectItem>
                                <SelectItem value="radio">Multiple Choice</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="multi_select">Multi-Select</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {(field.type === 'text' || field.type === 'textarea') && (
                          <div>
                            <Label>Placeholder Text</Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => handleFieldPlaceholderChange(field.id, e.target.value)}
                              placeholder="Enter placeholder text"
                            />
                          </div>
                        )}

                        {(field.type === 'radio' || field.type === 'select' || field.type === 'multi_select') &&
                          field.options && (
                            <div className="space-y-2 mt-4">
                              <div className="flex justify-between items-center">
                                <Label>Options</Label>
                                <div className="flex space-x-2 items-center">
                                  <Input
                                    placeholder="New option"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    className="w-32 h-8 text-sm"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => addOption(field.id)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {field.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex space-x-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => handleOptionChange(field.id, optionIndex, e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => removeOption(field.id, optionIndex)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="flex space-x-2 pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => handleRequiredToggle(field.id, checked)}
                            />
                            <Label>Required</Label>
                          </div>

                          <div className="flex-grow"></div>

                          <Button type="button" size="sm" variant="outline" onClick={() => setEditingField(null)}>
                            <Check className="h-4 w-4 mr-1" />
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Field display UI */}
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">
                            {index + 1}. {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          {editable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setEditingField(field.id)}
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {field.type === 'text' && <Input placeholder={field.placeholder} disabled={!editable} />}

                        {field.type === 'textarea' && <Textarea placeholder={field.placeholder} disabled={!editable} />}

                        {field.type === 'radio' && field.options && (
                          <div className="space-y-2 mt-2">
                            {field.options.map((option, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <input type="radio" disabled={!editable} />
                                <label>{option}</label>
                              </div>
                            ))}
                          </div>
                        )}

                        {field.type === 'select' && field.options && (
                          <Select disabled={!editable}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={field.placeholder || 'Select an option'} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option, optionIndex) => (
                                <SelectItem key={optionIndex} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {field.type === 'multi_select' && field.options && (
                          <MultiSelect
                            options={field.options.map((option) => ({
                              label: option,
                              value: option,
                            }))}
                            selected={[]}
                            onChange={() => {}}
                            placeholder={field.placeholder || 'Select options...'}
                            disabled={!editable}
                          />
                        )}

                        {field.type === 'checkbox' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Switch id={`switch-${field.id}`} disabled={!editable} />
                            <Label htmlFor={`switch-${field.id}`} className="cursor-default text-gray-500">
                              No
                            </Label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </DraggableField>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-8">
            {editableForm.schema.map((field, index) => (
              <div key={field.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="font-medium text-gray-800">
                  {index + 1}. {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </div>

                {field.type === 'text' && <Input type="text" placeholder={field.placeholder} disabled />}

                {field.type === 'textarea' && <Textarea placeholder={field.placeholder} disabled />}

                {field.type === 'radio' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <input type="radio" disabled />
                        <label>{option}</label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === 'select' && field.options && (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option, i) => (
                        <SelectItem key={i} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === 'multi_select' && field.options && (
                  <MultiSelect
                    options={field.options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    selected={[]}
                    onChange={() => {}}
                    placeholder={field.placeholder || 'Select options...'}
                    disabled
                  />
                )}

                {field.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Switch id={`switch-${field.id}`} disabled />
                    <Label htmlFor={`switch-${field.id}`} className="cursor-default text-gray-500">
                      No
                    </Label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
