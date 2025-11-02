"use client";

import React from "react";
import type { DaypartBias, UserVibes } from "@/lib/types/vibes";
import { TripPace } from "@/app/preferences/sections/comfort/TripPace";
import { SectionCard } from "@/app/preferences/components/SectionCard";
import { PreferredTiming } from "@/app/preferences/sections/comfort/PreferredTiming";
import { WalkingDistanceSelect } from "@/app/preferences/sections/comfort/WalkingDistanceSelect";

interface ComfortSectionProps {
  preferences: UserVibes;
  updatePreference: (section: keyof UserVibes, updates: any) => void;
  isMounted: boolean;
}

export function ComfortSection({
  preferences,
  updatePreference,
  isMounted,
}: ComfortSectionProps) {
  if (!isMounted) {
    return (
      <SectionCard icon="⚡" title="Comfort & Pace" isMounted={isMounted} />
    );
  }

  return (
    <SectionCard icon="⚡" title="Comfort & Pace" isMounted={isMounted}>
      <TripPace
        preferences={preferences}
        onChange={(value) =>
          updatePreference("comfort", {
            pace_score: Number(value),
          })
        }
      />
      <WalkingDistanceSelect
        preferences={preferences}
        onChange={(value) =>
          updatePreference("comfort", {
            walking_km_per_day: Number(value),
          })
        }
      />

      <PreferredTiming
        preferences={preferences}
        onChange={(value) =>
          updatePreference("comfort", {
            daypart_bias: value as DaypartBias,
          })
        }
      />
    </SectionCard>
  );
}
