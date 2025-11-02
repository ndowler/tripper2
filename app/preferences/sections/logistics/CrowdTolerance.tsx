"use client";

import { UserVibes } from "@/lib/types/vibes";
import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const crowdOptions = {
  1: "😌 Avoid lines - Prefer off-peak times",
  3: "🙂 Some crowds okay - Mix of popular and quiet",
  5: "😎 Big sights are fine - Don't mind busy places",
};

interface CrowdToleranceProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function CrowdTolerance({ preferences, onChange }: CrowdToleranceProps) {
  return (
    <BasicSelect
      label="Crowd Tolerance"
      options={crowdOptions}
      value={String(preferences.logistics.crowd_tolerance)}
      onChange={onChange}
    />
  );
}
