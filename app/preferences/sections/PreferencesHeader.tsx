"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ActionButtons";

interface PreferencesHeaderProps {
  title: string;
  description: string;
  handleSave: () => void;
}
export function PreferencesHeader({
  title,
  description,
  handleSave,
}: PreferencesHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/demo">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 select-none">{title}</h1>
        <p className="text-muted-foreground select-none">{description}</p>
      </div>
      <SaveButton handleSave={handleSave} />
    </div>
  );
}
