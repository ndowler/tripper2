"use client";

import { useEffect, useState } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { createDemoTrip } from "@/lib/seed-data";
import { Board } from "@/components/board/Board";

export default function DemoPage() {
  const addTrip = useTripStore((state) => state.addTrip);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) => state.getCurrentTrip());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!currentTripId || !currentTrip)) {
      const demoTrip = createDemoTrip();
      addTrip(demoTrip);
      setCurrentTrip(demoTrip.id);
    }
  }, [mounted, currentTripId, currentTrip, addTrip, setCurrentTrip]);

  if (!mounted || !currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    );
  }

  return <Board trip={currentTrip} />;
}
