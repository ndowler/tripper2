"use client";

import { AVAILABLE_THEMES } from "@/lib/types/vibes";
import { UserVibes } from "@/lib/types/vibes";
import { Button } from "@/components/ui/button";
import { PreferenceInput } from "@/app/preferences/components/PreferenceInput";

interface FavoriteThemesProps {
  preferences: UserVibes;
  onClick: (themeId: keyof (typeof AVAILABLE_THEMES)[number]) => void;
}

export function FavoriteThemes({ preferences, onClick }: FavoriteThemesProps) {
  return (
    <PreferenceInput label="Favorite Themes (select multiple)">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {AVAILABLE_THEMES.map((theme) => {
          const isSelected = preferences.taste.theme_weights[theme.id] === 1.0;
          return (
            <Button
              key={theme.id}
              type="button"
              onClick={() =>
                onClick(theme.id as keyof (typeof AVAILABLE_THEMES)[number])
              }
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {theme.icon} {theme.label}
            </Button>
          );
        })}
      </div>
    </PreferenceInput>
  );
}
