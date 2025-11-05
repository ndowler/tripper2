"use client";

import { useEffect, useState } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { createDemoTrip } from "@/lib/seed-data";
import { Board } from "@/components/board/Board";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";

export default function DemoPage() {
  const addTrip = useTripStore((state) => state.addTrip);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) => state.getCurrentTrip());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Create demo trip on mount (localStorage-only mode, no userId needed)
  useEffect(() => {
    if (isHydrated && (!currentTripId || !currentTrip)) {
      const demoTrip = createDemoTrip();
      addTrip(demoTrip); // Demo trip in localStorage-only mode
      setCurrentTrip(demoTrip.id);
    }
  }, [isHydrated, currentTripId, currentTrip, addTrip, setCurrentTrip]);

  if (!isHydrated || !currentTrip) {
    return <LoadingSpinner loadingText="Loading your demo trip..." />;
  }

  return <Board trip={currentTrip} />;
}
