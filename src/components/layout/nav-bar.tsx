"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from "@/components/auth/auth-provider";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { LayoutDashboard } from "lucide-react";

export default function NavBar() {
  const { user, signOut, isAnonymous } = useAuth();
  const pathname = usePathname();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  // Skip rendering on specific pages if needed
  const hideOnPaths = ['/auth/callback'];
  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  // Determine if the user is effectively signed in (not anonymous)
  const isEffectivelySignedIn = user && !isAnonymous;

  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <Image
              src="/images/logo.png"
              alt="TurboForm Logo"
              width={64}
              height={64}
              className="object-cover rounded-md"
              priority
            />
          </div>
          <span className="font-bold text-lg">TurboForm</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isEffectivelySignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  My Forms
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full p-0 overflow-hidden"
                  asChild
                >
                  <Popover>
                    <PopoverTrigger>
                      <Avatar>
                        {user.user_metadata?.avatar_url ? (
                          <AvatarImage 
                            src={user.user_metadata.avatar_url}
                            alt={`${user.email}'s profile`}
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <Button variant="outline" size="sm" onClick={signOut} className="w-full">
                          Sign Out
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => setIsSignInDialogOpen(true)}>
              Sign In
            </Button>
          )}
        </nav>
      </div>

      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignInSuccess={() => {
          setIsSignInDialogOpen(false);
        }}
        showAnonymousLinkingOption={isAnonymous}
      />
    </header>
  );
}
