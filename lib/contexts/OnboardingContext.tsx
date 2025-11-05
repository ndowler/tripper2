"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { completeOnboarding } from "@/lib/services/onboarding-service";

interface OnboardingContextType {
  isTourActive: boolean;
  currentStep: number;
  startTour: () => void;
  skipTour: () => void;
  completeTour: (userId: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  shouldShowTour: boolean;
  setShouldShowTour: (show: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);

  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStep(0);
  }, []);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
    setShouldShowTour(false);
  }, []);

  const completeTour = useCallback(async (userId: string) => {
    try {
      await completeOnboarding(userId);
      setIsTourActive(false);
      setCurrentStep(0);
      setShouldShowTour(false);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Still close the tour even if saving fails
      setIsTourActive(false);
      setCurrentStep(0);
      setShouldShowTour(false);
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        isTourActive,
        currentStep,
        startTour,
        skipTour,
        completeTour,
        setCurrentStep,
        shouldShowTour,
        setShouldShowTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

