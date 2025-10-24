"use client";
import { BasicSelect } from "@/components/basic/BasicSelect";
import { UserVibes } from "@/lib/types/vibes";

const timingOptions = {
  early: "🌅 Early Bird - Morning activities",
  balanced: "🌞 Balanced - Mix of morning and afternoon",
  late: "🌙 Night Owl - Evening activities",
};

interface PreferredTimingProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function PreferredTiming({
  preferences,
  onChange,
}: PreferredTimingProps) {
  return (
    <BasicSelect
      label="Preferred Timing for Activities"
      value={preferences.comfort.daypart_bias}
      options={timingOptions}
      onChange={onChange}
    />
  );
}
