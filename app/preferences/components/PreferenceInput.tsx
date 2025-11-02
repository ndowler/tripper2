"use client";
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface PreferenceInputProps {
  label: string;
  children: ReactNode;
  helperText?: string;
}

export function PreferenceInput({
  label,
  children,
  helperText,
}: PreferenceInputProps) {
  return (
    <div className="border border-border/50 rounded-md p-4">
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      {children}
      {helperText && (
        <p className="text-xs text-muted-foreground mt-2 select-none">
          {helperText}
        </p>
      )}
    </div>
  );
}
