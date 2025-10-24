"use client";

import React from "react";
import type { UserVibes } from "@/lib/types/vibes";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionCard } from "../components/SectionCard";

interface AccessibilitySectionProps {
  preferences: UserVibes;
  updatePreference: (
    section: keyof UserVibes,
    updates: Partial<UserVibes[keyof UserVibes]>
  ) => void;
  isMounted: boolean;
}
export function AccessibilitySection({
  preferences,
  updatePreference,
  isMounted,
}: AccessibilitySectionProps) {
  if (!isMounted) {
    return (
      <SectionCard
        icon="♿"
        title="Accessibility & Health"
        isMounted={isMounted}
      />
    );
  }

  return (
    <SectionCard icon="♿" title="Accessibility & Health" isMounted={isMounted}>
      <div className="flex items-center gap-3">
        <Checkbox
          id="wheelchair"
          checked={preferences.access.wheelchair}
          onCheckedChange={(value) =>
            updatePreference("access", {
              wheelchair: value === true,
            })
          }
        />
        <Label htmlFor="wheelchair" className="text-sm">
          Wheelchair accessible routes required
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="low_steps"
          checked={preferences.access.low_steps}
          onCheckedChange={(value) =>
            updatePreference("access", {
              low_steps: value === true,
            })
          }
        />
        <Label htmlFor="low_steps" className="text-sm">
          Prefer minimal steps/stairs
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="motion_sickness"
          checked={preferences.access.motion_sickness}
          onCheckedChange={(value) =>
            updatePreference("access", {
              motion_sickness: value === true,
            })
          }
        />
        <Label htmlFor="motion_sickness" className="text-sm">
          Motion sickness (avoid winding roads)
        </Label>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Medical Notes (Optional)
        </Label>
        <Textarea
          value={preferences.access.medical_notes || ""}
          onChange={(event) =>
            updatePreference("access", {
              medical_notes: event.target.value,
            })
          }
          placeholder="Any other health considerations..."
          rows={2}
        />
      </div>
    </SectionCard>
  );
}
