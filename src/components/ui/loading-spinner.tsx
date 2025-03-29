"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium',
  label,
  className
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn(sizeMap[size], "animate-spin", className)} />
      {label && (
        <p className="text-sm text-muted-foreground mt-2">{label}</p>
      )}
    </div>
  );
}
