import React from "react";
import { UserVibes } from "@/lib/types/vibes";
import { DailyBudget } from "./logistics/DailyBudget";
import { CrowdTolerance } from "./logistics/CrowdTolerance";
import { SurpriseFactor } from "./logistics/SurpriseFactor";
import { TransitComfort } from "./logistics/TransitComfort";
import { SectionCard } from "../components/SectionCard";

interface LogisticsSectionProps {
  preferences: UserVibes;
  updatePreference: (section: keyof UserVibes, updates: any) => void;
  isMounted: boolean;
}
export function LogisticsSection({
  preferences,
  updatePreference,
  isMounted,
}: LogisticsSectionProps) {
  if (!isMounted) {
    return (
      <SectionCard icon="🚇" title="Logistics & Budget" isMounted={isMounted} />
    );
  }

  return (
    <SectionCard icon="🚇" title="Logistics & Budget" isMounted={isMounted}>
      <DailyBudget
        preferences={preferences}
        onChange={(value) =>
          updatePreference("logistics", {
            budget_ppd: Number(value),
          })
        }
      />

      <CrowdTolerance
        preferences={preferences}
        onChange={(value) =>
          updatePreference("logistics", {
            crowd_tolerance: value,
          })
        }
      />

      <TransitComfort
        preferences={preferences}
        onChange={(value) => {
          let modes: string[] = [];
          if (value === "rides") modes = ["rideshare", "taxi"];
          else if (value === "metro") modes = ["metro", "tram", "rideshare"];
          else if (value === "trains")
            modes = ["metro", "tram", "train", "rideshare"];
          else if (value === "buses")
            modes = ["metro", "tram", "train", "bus", "rideshare"];
          else
            modes = [
              "metro",
              "tram",
              "train",
              "bus",
              "rideshare",
              "taxi",
              "ferry",
            ];
          updatePreference("logistics", {
            transit_modes_allowed: modes,
          });
        }}
      />
      <SurpriseFactor
        preferences={preferences}
        onChange={(value) =>
          updatePreference("logistics", {
            surprise_level: value,
          })
        }
      />
    </SectionCard>
  );
}
