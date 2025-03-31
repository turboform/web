"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function FormSubmittedContent() {
  const searchParams = useSearchParams();
  const formName = searchParams.get("formName") || "The form";
  const [animateCheckmark, setAnimateCheckmark] = useState(true);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Success Animation */}
      <div className={cn(
        "flex items-center justify-center h-24 w-24 mb-6 transition-all duration-700",
        animateCheckmark ? "scale-100" : "scale-0"
      )}>
        <CheckCircle2 
          className="h-24 w-24 text-primary/90" 
          strokeWidth={1.5}
          onAnimationEnd={() => setAnimateCheckmark(false)}
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Thank You!
      </h1>
      
      <p className="text-xl text-muted-foreground mb-10 max-w-xl">
        {formName} has been submitted successfully.
      </p>

      <div className="w-full max-w-2xl bg-muted/50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 md:w-28 md:h-28">
              <Image
                src="/images/logo.png"
                alt="Turboform.ai Logo"
                fill
                className="object-cover rounded-md"
                priority
              />
            </div>
          </div>
          
          <div className="flex-1 text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Create Your Own Forms with Turboform.ai
            </h2>
            <p className="text-muted-foreground mb-4">
              Build beautiful, intelligent forms like this one in seconds using AI—no design skills required.
            </p>
            <Link href="/">
              <Button className="gap-1">
                Create My Form <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
        <div className="flex flex-col items-center p-4 rounded-lg border border-border">
          <Sparkles className="h-10 w-10 text-primary/70 mb-3" />
          <h3 className="font-medium mb-1">AI-Powered</h3>
          <p className="text-sm text-muted-foreground text-center">
            Describe your form in plain language and AI does the rest
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg border border-border">
          <svg 
            viewBox="0 0 24 24" 
            className="h-10 w-10 text-primary/70 mb-3"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <h3 className="font-medium mb-1">Quick Setup</h3>
          <p className="text-sm text-muted-foreground text-center">
            Create and share forms in seconds, not hours
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg border border-border">
          <svg 
            viewBox="0 0 24 24" 
            className="h-10 w-10 text-primary/70 mb-3"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
            <path d="M8 10h8" />
            <path d="M8 14h4" />
          </svg>
          <h3 className="font-medium mb-1">Beautifully Designed</h3>
          <p className="text-sm text-muted-foreground text-center">
            Professional-looking forms with zero design effort
          </p>
        </div>
      </div>

      <Link href="/">
        <Button size="lg" className="gap-1">
          Create Your First Form <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

export default function FormSubmittedPage() {
  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 mb-6 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Thank You!
          </h1>
        </div>
      }>
        <FormSubmittedContent />
      </Suspense>
    </div>
  );
}
