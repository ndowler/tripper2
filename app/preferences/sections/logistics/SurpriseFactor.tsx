"use client";

import { UserVibes } from "@/lib/types/vibes";
import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const surpriseFactorOptions = {
  0: "🎯 Predictable - Stick to the plan",
  1: "🔍 A few twists - I'm open to new experiences",
  2: "🎉 Surprise me - I love the unexpected!",
};

interface SurpriseFactorProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function SurpriseFactor({ preferences, onChange }: SurpriseFactorProps) {
  return (
    <BasicSelect
      label="Surprise Factor"
      value={String(preferences.logistics.surprise_level)}
      options={surpriseFactorOptions}
      onChange={onChange}
    />
  );
}
