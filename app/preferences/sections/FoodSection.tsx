"use client";

import { UserVibes } from "@/lib/types/vibes";
import { FoodAdventurousness } from "./food/FoodAdventurousness";
import { DietaryConstraints } from "./food/DietaryConstraints";
import { FavoriteThemes } from "./food/FavoriteThemes";
import { SectionCard } from "../components/SectionCard";

interface FoodSectionProps {
  preferences: UserVibes;
  updatePreference: (
    section: keyof UserVibes,
    updates: Partial<UserVibes[keyof UserVibes]>
  ) => void;
  isMounted: boolean;
}
export function FoodSection({
  preferences,
  updatePreference,
  isMounted,
}: FoodSectionProps) {
  if (!isMounted) {
    return (
      <SectionCard icon="🍽️" title="Food & Interests" isMounted={isMounted} />
    );
  }

  return (
    <SectionCard icon="🍽️" title="Food & Interests" isMounted={isMounted}>
      <FoodAdventurousness
        preferences={preferences}
        onChange={(value) =>
          updatePreference("taste", {
            food_adventurousness: Number(value),
          })
        }
      />
      <DietaryConstraints
        preferences={preferences}
        onChange={(value) =>
          updatePreference("taste", {
            dietary_constraints: value.split(",").map((s) => s.trim()),
          })
        }
      />
      <FavoriteThemes
        preferences={preferences}
        onClick={(themeId) => {
          const newWeights = {
            ...preferences.taste.theme_weights,
          };
          const isSelected = newWeights[themeId] === 1.0;
          if (isSelected) {
            delete newWeights[themeId];
          } else {
            newWeights[themeId] = 1.0;
          }
          updatePreference("taste", {
            theme_weights: newWeights,
          });
        }}
      />
    </SectionCard>
  );
}
