"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Minus, PencilLine, Check, X } from "lucide-react";

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormPreviewProps {
  form: {
    title: string;
    description: string;
    schema: FormField[];
  };
  editable?: boolean;
  onFormChange?: (updatedForm: any) => void;
}

export function FormPreview({ form, editable = false, onFormChange }: FormPreviewProps) {
  const [editableForm, setEditableForm] = useState({ ...form });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newOption, setNewOption] = useState("");

  // Update the parent component when form changes
  const updateForm = (updatedForm: any) => {
    setEditableForm(updatedForm);
    if (onFormChange) {
      onFormChange(updatedForm);
    }
  };

  // Handle title edit
  const handleTitleChange = (title: string) => {
    updateForm({ ...editableForm, title });
  };

  // Handle description edit
  const handleDescriptionChange = (description: string) => {
    updateForm({ ...editableForm, description });
  };

  // Handle field label edit
  const handleFieldLabelChange = (id: string, label: string) => {
    const updatedSchema = editableForm.schema.map(field => 
      field.id === id ? { ...field, label } : field
    );
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Handle field placeholder edit
  const handleFieldPlaceholderChange = (id: string, placeholder: string) => {
    const updatedSchema = editableForm.schema.map(field => 
      field.id === id ? { ...field, placeholder } : field
    );
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Handle field type change
  const handleFieldTypeChange = (id: string, type: FormField['type']) => {
    const updatedSchema = editableForm.schema.map(field => {
      if (field.id === id) {
        // Add default options if changing to radio or select
        if ((type === 'radio' || type === 'select') && (!field.options || field.options.length === 0)) {
          return { ...field, type, options: ['Option 1', 'Option 2'] };
        }
        return { ...field, type };
      }
      return field;
    });
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Handle field required toggle
  const handleRequiredToggle = (id: string, required: boolean) => {
    const updatedSchema = editableForm.schema.map(field => 
      field.id === id ? { ...field, required: required } : field
    );
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Handle option edit for radio/select fields
  const handleOptionChange = (fieldId: string, index: number, value: string) => {
    const updatedSchema = editableForm.schema.map(field => {
      if (field.id === fieldId && field.options) {
        const updatedOptions = [...field.options];
        updatedOptions[index] = value;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Add new option to radio/select fields
  const addOption = (fieldId: string) => {
    if (!newOption.trim()) return;
    
    const updatedSchema = editableForm.schema.map(field => {
      if (field.id === fieldId) {
        const options = field.options ? [...field.options, newOption] : [newOption];
        return { ...field, options };
      }
      return field;
    });
    updateForm({ ...editableForm, schema: updatedSchema });
    setNewOption("");
  };

  // Remove option from radio/select fields
  const removeOption = (fieldId: string, optionIndex: number) => {
    const updatedSchema = editableForm.schema.map(field => {
      if (field.id === fieldId && field.options && field.options.length > 1) {
        const updatedOptions = field.options.filter((_, index) => index !== optionIndex);
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    updateForm({ ...editableForm, schema: updatedSchema });
  };

  // Handle checkbox status for the active form
  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    // setFormResponses(prev => ({
    //   ...prev,
    //   [fieldId]: checked
    // }));
  };

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
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingTitle(false)}
              >
                <Check className="w-4 h-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        ) : (
          <CardTitle className="flex justify-between items-center">
            <span>{editableForm.title}</span>
            {editable && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingTitle(true)}
              >
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
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingDescription(false)}
              >
                <Check className="w-4 h-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        ) : (
          <CardDescription className="flex justify-between items-center mt-2">
            <span>{editableForm.description}</span>
            {editable && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingDescription(true)}
              >
                <PencilLine className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {editableForm.schema.map((field, index) => (
            <div key={field.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
              {editingField === field.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input 
                      value={field.label}
                      onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                      placeholder="Question text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select 
                      value={field.type}
                      onValueChange={(value: any) => handleFieldTypeChange(field.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Short Text</SelectItem>
                        <SelectItem value="textarea">Long Text</SelectItem>
                        <SelectItem value="radio">Multiple Choice</SelectItem>
                        <SelectItem value="checkbox">Yes/No</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(field.type === 'text' || field.type === 'textarea') && (
                    <div className="space-y-2">
                      <Label>Placeholder Text</Label>
                      <Input 
                        value={field.placeholder || ''}
                        onChange={(e) => handleFieldPlaceholderChange(field.id, e.target.value)}
                        placeholder="Placeholder text"
                      />
                    </div>
                  )}
                  
                  {(field.type === 'radio' || field.type === 'select') && field.options && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {field.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <Input 
                            value={option}
                            onChange={(e) => handleOptionChange(field.id, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeOption(field.id, optIndex)}
                            disabled={field.options?.length === 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Input 
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="New option"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newOption.trim()) {
                              e.preventDefault();
                              addOption(field.id);
                            }
                          }}
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => addOption(field.id)}
                          disabled={!newOption.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={field.required}
                      onCheckedChange={(checked) => handleRequiredToggle(field.id, checked)}
                      id={`required-${field.id}`}
                    />
                    <Label htmlFor={`required-${field.id}`}>Required</Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingField(null)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-800">
                      {index + 1}. {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    {editable && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingField(field.id)}
                      >
                        <PencilLine className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text" 
                      placeholder={field.placeholder} 
                      className="w-full p-3 border border-gray-200 rounded-md" 
                      disabled 
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea 
                      placeholder={field.placeholder} 
                      className="w-full p-3 border border-gray-200 rounded-md" 
                      rows={3} 
                      disabled 
                    />
                  )}
                  
                  {field.type === 'radio' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input type="radio" disabled />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {field.type === 'select' && field.options && (
                    <select className="w-full p-3 border border-gray-200 rounded-md" disabled>
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="flex items-center space-x-2">
                      <Switch id={`switch-${field.id}`} disabled />
                      <Label htmlFor={`switch-${field.id}`} className="cursor-default text-gray-500">{field.label === 'Yes' ? 'No' : 'Yes'}</Label>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
