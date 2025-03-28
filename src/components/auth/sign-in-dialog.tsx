"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useAuth } from "../auth/auth-provider";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: () => void;
  showAnonymousLinkingOption?: boolean;
}

export function SignInDialog({
  isOpen,
  onClose,
  onSignInSuccess,
  showAnonymousLinkingOption = false
}: SignInDialogProps) {
  const { linkAnonymousAccount } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsSigningIn(true);
      setError("");

      if (showAnonymousLinkingOption) {
        // If this is an anonymous user, we should link the account instead
        setIsLinking(true);
        const { success, error: linkError } = await linkAnonymousAccount(email, password);

        if (!success) {
          throw new Error(linkError);
        }

        toast.success("Your anonymous account has been converted to a registered account!");
        onSignInSuccess();
        return;
      }

      const { error } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Signed in successfully!");
      onSignInSuccess();
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message || "Failed to sign in");
      toast.error("Failed to sign in");
    } finally {
      setIsSigningIn(false);
      setIsLinking(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsRegistering(true);
      setError("");

      if (showAnonymousLinkingOption) {
        // If this is an anonymous user, we should link the account instead
        setIsLinking(true);
        const { success, error: linkError } = await linkAnonymousAccount(email, password);

        if (!success) {
          throw new Error(linkError);
        }

        toast.success("Your anonymous account has been converted to a registered account!");
        onSignInSuccess();
        return;
      }

      const { error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Registration successful! Please check your email to confirm your account.");
      setShowRegisterForm(false);
    } catch (error: any) {
      console.error("Error registering:", error);
      setError(error.message || "Failed to register");
      toast.error("Failed to register");
    } finally {
      setIsRegistering(false);
      setIsLinking(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError("");
      const { error } = await supabaseBrowserClient.auth.linkIdentity({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setError(error.message || "Failed to sign in with Google");
      toast.error("Failed to sign in with Google");
    }
  };

  const signInWithX = async () => {
    try {
      setError("");
      const { error } = await supabaseBrowserClient.auth.linkIdentity({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with X:", error);
      setError(error.message || "Failed to sign in with X");
      toast.error("Failed to sign in with X");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{showRegisterForm ? "Create an account" : "Sign in"}</DialogTitle>
          <DialogDescription>
            {showRegisterForm
              ? "Create an account to save and share your forms"
              : "Sign in to save and share your forms"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showAnonymousLinkingOption && (
          <Alert className="mt-4">
            <AlertDescription>
              Signing in will preserve all your anonymous form data and make it accessible from your account.
            </AlertDescription>
          </Alert>
        )}

        {showRegisterForm ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <div className="w-full flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? "Creating account..." : "Create account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRegisterForm(false)}
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <div className="w-full flex flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={isSigningIn}>
                    {isSigningIn ? "Signing in..." : "Sign in"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowRegisterForm(true)}
                  >
                    Don't have an account? Register
                  </Button>
                </div>
              </DialogFooter>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={signInWithGoogle}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={signInWithX}
              >
                X
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
