'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitFormResponse } from "@/lib/supabase/actions";
import type { FormData } from "@/lib/supabase/actions";

export function FormSubmission({ form }: { form: FormData }) {
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = form.schema.filter((field: any) => field.required);
    const missingFields = requiredFields.filter((field: any) =>
      !formResponses[field.id] ||
      (typeof formResponses[field.id] === 'string' && !formResponses[field.id].trim())
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields (${missingFields.length} missing)`);
      return;
    }

    try {
      setSubmitting(true);
      
      const result = await submitFormResponse(form.id, formResponses);

      if (!result.success) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <CardContent className="pt-6">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="py-2">
              Your submission was successful. Thank you for your response!
            </AlertDescription>
          </Alert>
        </CardContent>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="space-y-8">
          {form.schema.map((field: any, index: number) => (
            <div key={field.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="font-medium text-gray-800">
                {index + 1}. {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </div>

              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formResponses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  value={formResponses[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'radio' && field.options && (
                <div className="space-y-3 pl-1">
                  {field.options.map((option: string) => (
                    <div key={option} className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={`${field.id}-${option}`}
                        name={field.id}
                        className="h-4 w-4 text-primary"
                        value={option}
                        checked={formResponses[field.id] === option}
                        onChange={() => handleInputChange(field.id, option)}
                      />
                      <label htmlFor={`${field.id}-${option}`} className="text-gray-700">{option}</label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center space-x-2 pl-1">
                  <Switch
                    id={field.id}
                    checked={!!formResponses[field.id]}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                  />
                  <Label htmlFor={field.id} className="text-gray-700">
                    {formResponses[field.id] ? "Yes" : "No"}
                  </Label>
                </div>
              )}

              {field.type === 'select' && field.options && (
                <Select
                  value={formResponses[field.id] || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6 px-6">
        <Button
          type="submit"
          className="w-full py-6 text-base font-medium"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Form"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
