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
import { Flame, LayoutDashboard, Menu, X } from "lucide-react";

export default function NavBar() {
  const { user, signOut, isAnonymous } = useAuth();
  const pathname = usePathname();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip rendering on specific pages if needed
  const hideOnPaths = ['/f/*'];
  // Check if current path matches any pattern in hideOnPaths (including wildcards)
  if (hideOnPaths.some(pattern => {
    // Convert wildcard pattern to regex
    if (pattern.includes('*')) {
      const regexPattern = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regexPattern.test(pathname);
    }
    // Direct comparison for exact matches
    return pattern === pathname;
  })) {
    return null;
  }

  // Determine if the user is effectively signed in (not anonymous)
  const isEffectivelySignedIn = user && !isAnonymous;

  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded">
            <Image
              src="/images/logo.png"
              alt="TurboForm Logo"
              width={48}
              height={48}
              className="object-cover rounded-md"
              priority
            />
          </div>
          <span className="font-bold text-lg">TurboForm</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>

          {isEffectivelySignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  My Forms
                </Button>
              </Link>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 rounded-full p-0 overflow-hidden"
                    >
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
                    </Button>
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
              </div>
            </>
          ) : (
            <Button onClick={() => setIsSignInDialogOpen(true)}>
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center gap-3">
          {/* Always show Sign In/Avatar on mobile as it's critical */}
          {isEffectivelySignedIn ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    {user.user_metadata?.avatar_url ? (
                      <AvatarImage
                        src={user.user_metadata.avatar_url}
                        alt={`${user.email}'s profile`}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
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
          ) : (
            <Button size="sm" onClick={() => setIsSignInDialogOpen(true)}>
              Sign In
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Simple Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-3 px-4 shadow-md animate-in fade-in-50 slide-in-from-top-5 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Flame className="w-4 h-4" />
                Pricing
              </Button>
            </Link>

            {isEffectivelySignedIn && (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  My Forms
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}

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
