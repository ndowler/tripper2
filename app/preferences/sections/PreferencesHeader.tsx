/* eslint-disable */
"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ActionButtons";

interface PreferencesHeaderProps {
  title: string;
  description: string;
  handleSave: () => void;
  searchParams: Promise<{ from?: string }>;
}

function BackButton({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = use(searchParams);
  const backHref = params.from || "/demo";

  return (
    <Link href={backHref}>
      <Button variant="ghost" size="icon">
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </Link>
  );
}

export function PreferencesHeader({
  title,
  description,
  handleSave,
  searchParams,
}: PreferencesHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" disabled />
      <BackButton searchParams={searchParams} />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 select-none">{title}</h1>
        <p className="text-muted-foreground select-none">{description}</p>
      </div>
      <SaveButton handleSave={handleSave} />
    </div>
  );
}
