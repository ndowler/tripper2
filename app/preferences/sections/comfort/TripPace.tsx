"use client";
import { Input } from "@/components/ui/input";
import { PreferenceInput } from "@/app/preferences/components/PreferenceInput";

interface TripPaceProps {
  preferences: any;
  onChange?: (value: string) => void;
}

export function TripPace({ preferences, onChange }: TripPaceProps) {
  const paceScore =
    typeof preferences?.comfort?.pace_score === "number"
      ? preferences.comfort.pace_score
      : 0;

  const getPaceLabel = (score: number) => {
    if (score <= 30) return "Relaxed & slow";
    if (score <= 60) return "Moderate pace";
    return "Active & intense";
  };

  return (
    <PreferenceInput
      label="Trip Pace (0 = Relaxed, 100 = Intense)"
      helperText={getPaceLabel(paceScore)}
    >
      <div className="flex items-center gap-4">
        <Input
          type="range"
          min="0"
          max="100"
          value={paceScore}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1"
        />
        <span className="text-sm font-medium w-12 text-right select-none">
          {paceScore}
        </span>
      </div>
    </PreferenceInput>
  );
}
