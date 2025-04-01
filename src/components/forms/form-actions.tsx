"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface FormActionsProps {
  form: any;
  onHomeAction?: () => void;
  homePath?: string;
  homeLabel?: string;
}

export function FormActions({ form, onHomeAction, homePath, homeLabel = "Create New Form" }: FormActionsProps) {
  const { isAnonymous, session } = useAuth();
  const router = useRouter();
  const [formSaved, setFormSaved] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

  const saveForm = async () => {
    try {
      // Add expiration date to the form if set
      const formWithExpiration = {
        ...form,
        expires_at: expirationDate ? expirationDate.toISOString() : null
      };

      const response = await axios.post("/api/forms", formWithExpiration, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to save form");
      }

      const data = response.data;
      setFormSaved(true);
      setFormLink(`${window.location.origin}/form/${data.form.id}`);
      setShortLink(`${window.location.origin}/f/${data.form.short_id}`);

      // If user is anonymous, prompt them to sign in to share the form
      if (isAnonymous) {
        toast.success("Form saved! Sign in to get a shareable link");
      } else {
        toast.success("Form saved successfully!");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form. Please try again.");
    }
  };

  const handleHomeAction = () => {
    if (onHomeAction) {
      onHomeAction();
    } else if (homePath) {
      router.push(homePath);
    }
  };

  return (
    <>
      <CardFooter className="flex flex-col space-y-3">
        {!formSaved ? (
          <>
            <div className="w-full space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Form Expiration (Optional)</Label>
                <DateTimePicker
                  date={expirationDate}
                  setDate={setExpirationDate}
                  label="Set expiration date and time"
                />
                <p className="text-xs text-muted-foreground">
                  After this date, the form will no longer accept new responses.
                </p>
              </div>
            </div>
            <Button onClick={saveForm} className="w-full">Save Form</Button>
          </>
        ) : (
          <div className="w-full space-y-3">
            {isAnonymous ? (
              <>
                <Alert>
                  <AlertDescription>
                    Your form has been saved! Sign in to get a shareable link and access your forms from any device.
                  </AlertDescription>
                </Alert>
                <Button
                  className="w-full"
                  onClick={() => setIsSignInDialogOpen(true)}
                >
                  Sign In to Share
                </Button>
              </>
            ) : (
              <>
                <Alert>
                  <AlertDescription>
                    Your form has been saved! Share this link with others to collect responses:
                    <div className="mt-2 p-2 bg-muted rounded-md break-all">
                      {formLink}
                    </div>
                    {shortLink && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">Short link:</div>
                        <div className="p-2 bg-muted rounded-md break-all">
                          {shortLink}
                        </div>
                      </div>
                    )}
                    {form.expires_at && (
                      <div className="mt-2 text-sm text-amber-600">
                        This form will expire on {new Date(form.expires_at).toLocaleDateString()} at {new Date(form.expires_at).toLocaleTimeString()}.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(shortLink || formLink);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleHomeAction}
                  >
                    {homeLabel}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardFooter>

      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignInSuccess={() => {
          setIsSignInDialogOpen(false);
          toast.success("Signed in successfully! You can now share your form.");
        }}
        showAnonymousLinkingOption={isAnonymous}
      />
    </>
  );
}
