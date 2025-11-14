"use client";

import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const walkingDistances = {
  "3": "3k steps - Minimal walking",
  "5": "5k steps - Light strolls",
  "8": "8k steps - Moderate walking",
  "12": "12k steps - Active exploration",
  "18": "18k steps+ - All-day adventures",
};

interface WalkingDistanceSelectProps {
  preferences: any;
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
