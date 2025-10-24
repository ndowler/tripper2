import React from "react";
import { Button } from "@/components/ui/button";

export function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold mb-2">{children}</h3>;
}

export function ExternalLinkButton({
  href,
  icon: Icon,
  children,
  variant = "outline",
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "outline" | "secondary";
}) {
  return (
    <Button variant={variant} size="sm" asChild>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        {Icon}
        {children}
      </a>
    </Button>
  );
}

export function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>
      <span className="ml-2 font-medium">{value}</span>
    </div>
  );
}

export function VibePack({ name }: { name: string }) {
  return (
    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
      {name}
    </span>
  );
}
