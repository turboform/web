'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CalendarX2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitFormResponse } from "@/lib/supabase/actions";
import type { FormData } from "@/lib/supabase/actions";

const isFormExpired = (form: FormData): boolean => {
  if (!form.expires_at) return false;

  const expirationDate = new Date(form.expires_at);
  const now = new Date();

  return expirationDate < now;
};

export function FormSubmission({ form }: { form: FormData }) {
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if the form is expired
  const expired = isFormExpired(form);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if form is expired
    if (expired) {
      toast.error("This form has expired and is no longer accepting responses");
      return;
    }

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

  // Render the expiration notice when the form has expired
  if (expired) {
    return (
      <div className="space-y-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                <CalendarX2 className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-600">This form has expired</h3>
            <p className="text-gray-600">
              This form is no longer accepting responses as it has passed its expiration date.
            </p>
          </div>
        </CardContent>
      </div>
    );
  }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent className="space-y-4 pt-6">
        {form.schema.map((field: any) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-base">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>

            {field.type === 'text' && (
              <input
                type="text"
                id={field.id}
                placeholder={field.placeholder || ''}
                className="w-full p-2 border rounded-md"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                id={field.id}
                placeholder={field.placeholder || ''}
                className="w-full p-2 border rounded-md min-h-[100px]"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              />
            )}

            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={field.id}
                  onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                />
                <Label htmlFor={field.id} className="text-sm text-gray-600">
                  {field.placeholder || 'Yes'}
                </Label>
              </div>
            )}

            {field.type === 'radio' && field.options && (
              <div className="space-y-2">
                {field.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${field.id}-${index}`}
                      name={field.id}
                      value={option}
                      onChange={() => handleInputChange(field.id, option)}
                      required={field.required}
                    />
                    <Label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-600">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {field.type === 'select' && field.options && (
              <Select
                onValueChange={(value) => handleInputChange(field.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option: string, index: number) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'multi_select' && field.options && (
              <div className="border rounded-md p-3">
                <p className="text-sm text-gray-600 mb-2">{field.placeholder || 'Select options'}</p>
                {field.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      id={`${field.id}-${index}`}
                      value={option}
                      onChange={(e) => {
                        const currentSelections = Array.isArray(formResponses[field.id])
                          ? [...formResponses[field.id]]
                          : [];

                        if (e.target.checked) {
                          handleInputChange(field.id, [...currentSelections, option]);
                        } else {
                          handleInputChange(
                            field.id,
                            currentSelections.filter((item: string) => item !== option)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-600">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit'
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
