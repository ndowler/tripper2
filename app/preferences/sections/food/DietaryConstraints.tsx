"use client";
import { UserVibes } from "@/lib/types/vibes";
import { Input } from "@/components/ui/input";
import { PreferenceInput } from "@/app/preferences/components/PreferenceInput";

interface DietaryConstraintsProps {
  preferences: UserVibes;
  onChange?: (value: string) => void;
}

export function DietaryConstraints({
  preferences,
  onChange,
}: DietaryConstraintsProps) {
  return (
    <PreferenceInput label="Dietary Constraints">
      <Input
        value={preferences.taste.dietary_constraints.join(", ")}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="e.g., vegetarian, no shellfish, gluten-free"
      />
    </PreferenceInput>
  );
}
