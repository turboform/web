"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface FormGeneratorProps {
  onFormGenerated: (form: any) => void;
}

export function FormGenerator({ onFormGenerated }: FormGeneratorProps) {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description of your form");
      return;
    }

    try {
      setIsGenerating(true);

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
      onFormGenerated(data);
      toast.success("Form generated successfully!");
    } catch (error) {
      console.error("Error generating form:", error);
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a new form</CardTitle>
        <CardDescription>
          Describe the form you want to create with all the questions you need. Start each question on a new line.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent>
          <Textarea
            placeholder={`Describe your form here... (e.g., A customer feedback form with questions about product quality, delivery experience, and suggestions for improvement)`}
            className="min-h-[200px] text-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isGenerating || !description.trim()}
          >
            {isGenerating ? "Generating..." : "Generate Form"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
