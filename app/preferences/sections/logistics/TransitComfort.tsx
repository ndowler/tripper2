"use client";

import { UserVibes } from "@/lib/types/vibes";
import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const comfortOptions = {
  rides: "🚖 Rideshares/taxis only",
  metro: "🚋 Metro & trams preferred",
  trains: "🚆 Trains preferred",
  buses: "🚌 Buses preferred",
  all: "⛴️ All transit modes allowed",
};

interface TransitComfortProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function TransitComfort({ preferences, onChange }: TransitComfortProps) {
  return (
    <BasicSelect
      label="Transit Comfort"
      options={comfortOptions}
      value={
        preferences.logistics.transit_modes_allowed.includes("ferry")
          ? "all"
          : preferences.logistics.transit_modes_allowed.includes("bus")
          ? "buses"
          : preferences.logistics.transit_modes_allowed.includes("train")
          ? "trains"
          : preferences.logistics.transit_modes_allowed.includes("metro")
          ? "metro"
          : "rides"
      }
      onChange={onChange}
    />
  );
}
