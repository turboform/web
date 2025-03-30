"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { ProtectedPage } from '@/components/auth/protected-page';

function Dashboard() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch forms when the component mounts
  useEffect(() => {
    async function fetchForms() {
      try {
        const response = await fetch("/api/forms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        setForms(data.forms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Failed to load your forms");
      } finally {
        setLoading(false);
      }
    }

    fetchForms();
  }, []);

  const handleDeleteForm = async (formId: string) => {
    try {
      // Using the supabase browser client directly since it's already initialized
      const { error } = await supabaseBrowserClient
        .from("forms")
        .delete()
        .eq("id", formId);

      if (error) {
        throw error;
      }

      // Update the forms list
      setForms(forms.filter(form => form.id !== formId));
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  return (
    <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Forms</h1>
        <Button onClick={() => router.push("/create-form")} size="default">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border-gray-200">
              <CardHeader className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-4 gap-3">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="mb-3 text-xl font-medium">You haven&apos;t created any forms yet</h3>
          <p className="mb-8 text-gray-600 max-w-md">
            Get started by creating your first form to collect data from users
          </p>
          <Button onClick={() => router.push("/create-form")} size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Form
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="overflow-hidden shadow-sm border-gray-200 flex flex-col">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-xl font-semibold truncate">{form.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  Created {new Date(form.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                <p className="mb-3 text-sm text-gray-600 line-clamp-3">
                  {form.description || "No description"}
                </p>
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500 font-medium">
                    {form.schema && Array.isArray(form.schema) ? (
                      <span>{form.schema.length} question{form.schema.length === 1 ? "" : "s"}</span>
                    ) : (
                      <span>Custom form</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    <span>{form.responseCount} response{form.responseCount === 1 ? "" : "s"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-3 p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => router.push(`/form/${form.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => router.push(`/edit-form/${form.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle className="h-5 w-5" />
                        <h4 className="font-medium">Confirm deletion</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Are you sure you want to delete this form? This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Close the popover by clicking outside
                            document.body.click();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteForm(form.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProtectedPage(Dashboard);
