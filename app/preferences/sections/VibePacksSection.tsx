"use client";

import React from "react";
import { VIBE_PACKS, type UserVibes } from "@/lib/types/vibes";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SectionCard } from "../components/SectionCard";

interface VibePacksSectionProps {
  preferences: UserVibes;
  updatePreference: (section: keyof UserVibes, updates: any) => void;
  isMounted: boolean;
}
export function VibePacksSection({
  preferences,
  updatePreference,
  isMounted,
}: VibePacksSectionProps) {
  if (!isMounted) {
    return (
      <SectionCard
        icon={<Sparkles className="w-5 h-5" />}
        title="Vibe Packs"
        isMounted={isMounted}
      />
    );
  }

  return (
    <SectionCard
      icon={<Sparkles className="w-5 h-5" />}
      title="Vibe Packs"
      description="Select up to 2 vibe packs that match your travel style"
      isMounted={isMounted}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-0">
        {Object.entries(VIBE_PACKS).map(([name, pack]) => {
          const vibePacksArray = Array.isArray(preferences.vibe_packs)
            ? preferences.vibe_packs
            : [];
          const isSelected = vibePacksArray.includes(name);
          const canSelect = vibePacksArray.length < 2 || isSelected;

          return (
            <Button
              key={name}
              type="button"
              onClick={() => {
                const vibePacksArray = Array.isArray(preferences.vibe_packs)
                  ? preferences.vibe_packs
                  : [];
                if (isSelected) {
                  updatePreference(
                    "vibe_packs",
                    vibePacksArray.filter((p: string) => p !== name)
                  );
                } else if (canSelect) {
                  updatePreference("vibe_packs", [...vibePacksArray, name]);
                }
              }}
              disabled={!canSelect && !isSelected}
              variant="outline"
              className={`p-4 rounded-lg border-2 text-left h-auto transition-all flex flex-col items-start overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : canSelect
                  ? "border-border hover:border-primary/50"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 w-full">
                <span className="text-2xl flex-shrink-0">{pack.icon}</span>
                <span className="font-semibold text-sm truncate">{name}</span>
              </div>
              <p className="text-xs text-muted-foreground w-full break-words whitespace-normal">
                {pack.description}
              </p>
            </Button>
          );
        })}
      </div>
    </SectionCard>
  );
}
