"use client";

import React, { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from "react-joyride";
import { useOnboarding } from "@/lib/contexts/OnboardingContext";
import { TOUR_STEPS, TOUR_STYLES, TOUR_LOCALE } from "@/lib/constants/onboarding";
import { track } from "@/lib/analytics";

interface OnboardingTourProps {
  userId: string;
  run?: boolean;
}

export function OnboardingTour({ userId, run = false }: OnboardingTourProps) {
  const { 
    isTourActive, 
    currentStep, 
    skipTour, 
    completeTour,
    setCurrentStep,
    startTour,
  } = useOnboarding();

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    if (run && !isTourActive) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        startTour();
        setRunTour(true);
        track("Onboarding Tour Started", { userId });
      }, 500);
    }
  }, [run, isTourActive, startTour, userId]);

  useEffect(() => {
    setRunTour(isTourActive);
  }, [isTourActive]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, type, index, action } = data;

    // Track step progression
    if (type === EVENTS.STEP_AFTER) {
      track("Onboarding Step Completed", {
        userId,
        step: index,
        stepName: TOUR_STEPS[index]?.content?.slice(0, 50),
      });
    }

    // Handle tour completion
    if (status === STATUS.FINISHED) {
      track("Onboarding Tour Completed", { userId });
      await completeTour(userId);
      setRunTour(false);
    }

    // Handle tour skip
    if (status === STATUS.SKIPPED || action === ACTIONS.CLOSE) {
      track("Onboarding Tour Skipped", { 
        userId, 
        lastStep: index,
        totalSteps: TOUR_STEPS.length,
      });
      skipTour();
      setRunTour(false);
    }

    // Update current step
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setCurrentStep(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  };

  if (!isTourActive && !runTour) {
    return null;
  }

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      stepIndex={currentStep}
      callback={handleJoyrideCallback}
      styles={TOUR_STYLES}
      locale={TOUR_LOCALE}
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightPadding={4}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}

