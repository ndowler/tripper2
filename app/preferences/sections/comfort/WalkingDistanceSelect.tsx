"use client";

import { UserVibes } from "@/lib/types/vibes";
import { BasicSelect } from "@/components/basic/BasicSelect";

const walkingDistances = {
  "3": "3km - Minimal walking",
  "5": "5km - Light strolls",
  "8": "8km - Moderate walking",
  "12": "12km - Active exploration",
  "18": "18km+ - All-day adventures",
};

interface WalkingDistanceSelectProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function WalkingDistanceSelect({
  preferences,
  onChange,
}: WalkingDistanceSelectProps) {
  return (
    <BasicSelect
      label="Walking Distance Preference"
      value={String(preferences.comfort.walking_km_per_day)}
      options={walkingDistances}
      onChange={onChange}
    />
  );
}
