"use client";
import React from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface SectionCardProps {
  icon: string | React.ReactNode;
  title: string;
  children?: React.ReactNode;
  description?: string;
  isMounted: boolean;
}

export function SectionCard({
  icon,
  title,
  children,
  description,
  isMounted,
}: SectionCardProps) {
  if (!isMounted) {
    return (
      <Card className="p-6">
        <CardTitle className="text-xl font-semibold mb-4 flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardTitle className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon} {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-sm text-muted-foreground mb-4 select-none">
          {description}
        </CardDescription>
      )}
      <CardContent className="space-y-4 p-0">{children}</CardContent>
    </Card>
  );
}
