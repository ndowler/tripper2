"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { VIBE_PACKS } from "@/lib/types/vibes";

interface VibePackSelectorProps {
  selectedPacks: string[];
  onChange: (packs: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function VibePackSelector({
  selectedPacks,
  onChange,
  maxSelections = 2,
  className,
}: VibePackSelectorProps) {
  const handleToggle = (packName: string) => {
    if (selectedPacks.includes(packName)) {
      onChange(selectedPacks.filter((name) => name !== packName));
    } else if (selectedPacks.length < maxSelections) {
      onChange([...selectedPacks, packName]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-muted-foreground">
        Pick up to {maxSelections} vibe packs • {selectedPacks.length}/
        {maxSelections} selected
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(VIBE_PACKS).map(([name, pack]) => {
          const isSelected = selectedPacks.includes(name);
          const isDisabled =
            !isSelected && selectedPacks.length >= maxSelections;

          return (
            <button
              key={name}
              type="button"
              onClick={() => handleToggle(name)}
              disabled={isDisabled}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left",
                "hover:border-primary hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected && "border-primary bg-primary/10",
                !isSelected && "border-border",
                isDisabled &&
                  "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent"
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-3xl">{pack.icon}</span>
                <span className="font-semibold">{name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {pack.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
