"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FormPreview } from "@/components/forms/form-preview";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useAuth } from "@/components/auth/auth-provider";

export const runtime = 'edge';

export default function EditFormPage() {
  const { user } = useAuth();
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

      const { error } = await supabaseBrowserClient
        .from('forms')
        .update({
          title: form.title,
          description: form.description,
          schema: form.schema
        })
        .eq('id', formId);

      if (error) {
        throw error;
      }

      setOriginalForm(form);
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
      <div className="container max-w-3xl mx-auto py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-3xl mx-auto py-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
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
          Back to Dashboard
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
