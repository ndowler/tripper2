"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTripStore } from "@/lib/store/tripStore";
import { getDefaultVibes } from "@/lib/utils/vibes";
import type { UserVibes } from "@/lib/types/vibes";

// Section components
import { PreferencesHeader } from "./sections/PreferencesHeader";
import { ComfortSection } from "./sections/ComfortSection";
import { FoodSection } from "./sections/FoodSection";
import { LogisticsSection } from "./sections/LogisticsSection";
import { VibePacksSection } from "./sections/VibePacksSection";
import { AccessibilitySection } from "./sections/AccessibilitySection";
import { CancelButton, SaveButton } from "@/components/ActionButtons";

export default function PreferencesPage() {
  const router = useRouter();
  const userVibes = useTripStore((state) => state.userVibes);
  const setUserVibes = useTripStore((state) => state.setUserVibes);

  const [preferences, setPreferences] = useState<UserVibes>(
    () => userVibes || getDefaultVibes()
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (userVibes) {
      setPreferences(userVibes);
    }
  }, [userVibes]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSave = () => {
    setUserVibes({
      ...preferences,
      updated_at: new Date().toISOString(),
    });
    toast.success("Preferences saved! ✨");
    router.push("/demo");
  };

  const updatePreference = (section: keyof UserVibes, updates: any) => {
    setPreferences((prev) => {
      if (Array.isArray(updates)) {
        return {
          ...prev,
          [section]: updates,
        };
      }
      const prevSectionValue = prev[section];
      return {
        ...prev,
        [section]:
          typeof prevSectionValue === "object" &&
          !Array.isArray(prevSectionValue)
            ? { ...prevSectionValue, ...updates }
            : updates,
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PreferencesHeader
          title="Travel Preferences"
          description="Adjust your preferences to get personalized AI suggestions"
          handleSave={handleSave}
        />
        <div className="space-y-6">
          <ComfortSection
            preferences={preferences}
            updatePreference={updatePreference}
            isMounted={isMounted}
          />
          <FoodSection
            preferences={preferences}
            updatePreference={updatePreference}
            isMounted={isMounted}
          />
          <LogisticsSection
            preferences={preferences}
            updatePreference={updatePreference}
            isMounted={isMounted}
          />
          <VibePacksSection
            preferences={preferences}
            updatePreference={updatePreference}
            isMounted={isMounted}
          />
          <AccessibilitySection
            preferences={preferences}
            updatePreference={updatePreference}
            isMounted={isMounted}
          />
          <div className="flex justify-end gap-3">
            <CancelButton />
            <SaveButton handleSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
