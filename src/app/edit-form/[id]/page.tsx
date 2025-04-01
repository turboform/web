"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import { FormPreview } from "@/components/forms/form-preview";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useAuth } from "@/components/auth/auth-provider";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Label } from "@/components/ui/label";
import axios from 'axios';

export const runtime = 'edge';

export default function EditFormPage() {
  const { user, session } = useAuth();
  const params = useParams();
  const formId = params.id as string;
  const router = useRouter();

  const [originalForm, setOriginalForm] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<'description' | 'preview'>('preview');
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

  // Fetch the form data when the component mounts
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data, error } = await supabaseBrowserClient
          .from('forms')
          .select('*')
          .eq('id', formId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          toast.error("Form not found");
          router.push("/dashboard");
          return;
        }

        // Check if user is the owner of the form
        if (user?.id !== data.user_id) {
          toast.error("You don't have permission to edit this form");
          router.push("/dashboard");
          return;
        }

        // Parse expiration date if it exists
        if (data.expires_at) {
          setExpirationDate(new Date(data.expires_at));
        }

        setOriginalForm(data);
        setForm(data);
        setDescription(data.description);
      } catch (error) {
        console.error('Error fetching form:', error);
        toast.error("Failed to load form. It may not exist.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchForm();
    } else {
      setLoading(false);
    }
  }, [formId, router, user]);

  // TODO: check this logic
  const handleDescriptionUpdate = async () => {
    if (description.trim() === originalForm.description.trim()) {
      setEditMode('preview');
      return;
    }

    try {
      setGenerating(true);

      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate form");
      }

      const data = await response.json();

      // Keep the ID from the original form
      const updatedForm = {
        ...data,
        id: originalForm.id,
        user_id: originalForm.user_id,
        created_at: originalForm.created_at,
      };

      setForm(updatedForm);
      setEditMode('preview');
      toast.success("Form updated successfully!");
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update form. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveForm = async () => {
    try {
      setSaving(true);

      const response = await axios.put<{ form: any }>(`/api/forms/${formId}`, {
        title: form.title,
        description: form.description,
        schema: form.schema,
        expires_at: expirationDate ? expirationDate.toISOString() : null,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
        });

      if (!response.data) {
        throw new Error('Failed to save form');
      }

      const { form: updatedForm } = response.data;

      // Update the original form data with the latest changes
      setOriginalForm(updatedForm);

      toast.success("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to sign in to edit this form</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center mb-10">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Edit Form</h1>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {form && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{form.title}</CardTitle>
                <div className="flex justify-between items-center mt-2">
                  <CardDescription className="flex-grow">
                    {editMode === 'preview' ? form.description : 'Edit your form description below'}
                  </CardDescription>
                  {editMode === 'preview' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode('description')}
                    >
                      Edit Description
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDescription(originalForm.description);
                        setEditMode('preview');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardHeader>

              {editMode === 'description' && (
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Describe your form here..."
                      className="min-h-[150px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                      onClick={handleDescriptionUpdate}
                      disabled={generating || !description.trim()}
                      className="w-full"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Form"
                      )}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {editMode === 'preview' && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Form Expiration</CardTitle>
                    </div>
                    <CardDescription>
                      Set a date when this form will stop accepting responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                      <DateTimePicker
                        date={expirationDate}
                        setDate={setExpirationDate}
                        label="Set expiration date and time"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {expirationDate
                          ? `This form will stop accepting responses after ${expirationDate.toLocaleDateString()} at ${expirationDate.toLocaleTimeString()}.`
                          : "After this date, the form will no longer accept new responses."}
                      </p>
                      {expirationDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setExpirationDate(undefined)}
                        >
                          Remove Expiration
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <FormPreview
                  key={`form-preview-${form.id}`}
                  form={form}
                  editable={true}
                  onFormChange={(updatedForm) => setForm(updatedForm)}
                />
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveForm}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
